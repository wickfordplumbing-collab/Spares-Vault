import fs from "node:fs";
import { csvRecords } from "./csv.js";
import type { Db } from "./db.js";
import { getMeta, listProducts, setMeta } from "./db.js";
import type { Alternative, Product, SearchHit } from "./types.js";

const HEADER_ALIASES: Record<string, string[]> = {
  partNumber: ["part_number", "part number", "partnumber", "mpn", "sku", "part no", "part no."],
  description: ["description", "desc", "name"],
  brand: ["brand", "make", "manufacturer"],
  price: ["price", "price_gbp", "trade_price", "retail_price"],
  stock: ["stock", "qty", "quantity", "stock_qty"],
  fits: ["fits", "models", "boilers", "fitment", "appliances"],
  priceNote: ["price_note", "price note", "note", "notes"],
};

export function poundsToPence(value: string): number {
  const cleaned = value.trim().replace(/[£,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new Error(`Price must be pounds and pence, got "${value}"`);
  }
  const [pounds, fraction = ""] = cleaned.split(".");
  return Number(pounds) * 100 + Number(fraction.padEnd(2, "0"));
}

function pick(record: Record<string, string>, field: keyof typeof HEADER_ALIASES): string {
  const wanted = HEADER_ALIASES[field];
  for (const [key, value] of Object.entries(record)) {
    if (wanted.includes(key.trim().toLowerCase())) return value.trim();
  }
  return "";
}

export type ImportResult = {
  inserted: number;
  updated: number;
  skipped: number;
  errors: { line: number; message: string }[];
  catalogueMode: "sample" | "trade";
};

export function importCatalogueCsv(db: Db, csv: string, replace: boolean): ImportResult {
  const records = csvRecords(csv);
  const result: ImportResult = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    catalogueMode: "trade",
  };
  const upsert = db.prepare(`
    INSERT INTO products (part_number, description, brand, price_pence, stock, fits, price_note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(part_number) DO UPDATE SET
      description = excluded.description,
      brand = excluded.brand,
      price_pence = excluded.price_pence,
      stock = excluded.stock,
      fits = excluded.fits,
      price_note = excluded.price_note
  `);

  db.exec("BEGIN");
  try {
    if (replace) db.exec("DELETE FROM products");
    records.forEach((record, index) => {
      const line = index + 2;
      try {
        const partNumber = pick(record, "partNumber");
        const description = pick(record, "description");
        const brand = pick(record, "brand");
        const priceRaw = pick(record, "price");
        const stockRaw = pick(record, "stock") || "0";
        const fits = pick(record, "fits");
        const priceNote = pick(record, "priceNote");
        if (!partNumber || !description || !brand) {
          result.skipped++;
          result.errors.push({
            line,
            message: "part number, description, and brand are required",
          });
          return;
        }
        if (!/^\d+$/.test(stockRaw)) throw new Error(`stock must be a whole number, got "${stockRaw}"`);
        const pricePence = poundsToPence(priceRaw);
        const existing = db.prepare("SELECT part_number FROM products WHERE part_number = ?").get(partNumber);
        upsert.run(partNumber, description, brand, pricePence, Number(stockRaw), fits, priceNote);
        if (existing && !replace) result.updated++;
        else result.inserted++;
      } catch (error) {
        result.skipped++;
        result.errors.push({
          line,
          message: error instanceof Error ? error.message : "Invalid row",
        });
      }
    });
    const notes = db.prepare("SELECT price_note FROM products").all() as { price_note: string }[];
    const sample =
      notes.length > 0 && notes.every((row) => /placeholder/i.test(row.price_note));
    result.catalogueMode = sample ? "sample" : "trade";
    setMeta(db, "catalogue_mode", result.catalogueMode);
    setMeta(db, "catalogue_imported_at", new Date().toISOString());
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return result;
}

export function seedSampleCatalogue(db: Db, samplePath: string) {
  const count = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
  if (count.n > 0) return;
  if (!fs.existsSync(samplePath)) return;
  importCatalogueCsv(db, fs.readFileSync(samplePath, "utf8"), true);
  setMeta(db, "catalogue_mode", "sample");
}

export function catalogueMode(db: Db): "sample" | "trade" | "empty" {
  const mode = getMeta(db, "catalogue_mode");
  const count = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
  if (!count.n) return "empty";
  return mode === "trade" ? "trade" : "sample";
}

const STOP = new Set([
  "the",
  "a",
  "an",
  "of",
  "and",
  "or",
  "to",
  "for",
  "on",
  "in",
  "it",
  "is",
  "with",
  "my",
  "our",
  "please",
  "what",
  "how",
  "does",
  "do",
  "i",
  "we",
  "me",
  "that",
  "this",
]);

const EXPANSIONS: { pattern: RegExp; terms: string[] }[] = [
  {
    pattern: /blue\s+valve|valve\s+under|under\s+the\s+boiler|blue\s+handle/,
    terms: ["filling loop", "blue-handled", "blue valve under the boiler"],
  },
  {
    pattern: /\bprv\b|pressure relief|safety valve|dripping outside|discharge pipe/,
    terms: ["pressure relief", "safety valve", "prv"],
  },
  { pattern: /filling loop|top up|re-?pressur/, terms: ["filling loop"] },
  {
    pattern: /no hot water|hot water cold|lukewarm|dhw only/,
    terms: ["diverter", "flow sensor", "plate heat exchanger", "turbine"],
  },
  { pattern: /diverter|3[ -]?way/, terms: ["diverter", "motor", "cartridge", "3 way"] },
  { pattern: /\bpump\b|circulator/, terms: ["pump", "circulator"] },
  { pattern: /\bfan\b/, terms: ["fan"] },
  { pattern: /electrode|ignition|ionisation|flame/, terms: ["electrode", "ignition", "ionisation"] },
  { pattern: /expansion|vessel/, terms: ["expansion vessel"] },
  { pattern: /\bpcb\b|circuit board|blank display/, terms: ["pcb", "printed circuit board"] },
  { pattern: /\bntc\b|thermistor/, terms: ["ntc", "thermistor", "temperature sensor"] },
  { pattern: /plate|heat exchanger/, terms: ["plate heat exchanger"] },
  { pattern: /gas valve/, terms: ["gas valve"] },
  { pattern: /condensate|frozen pipe/, terms: ["condensate"] },
  { pattern: /\baav\b|air vent/, terms: ["air vent", "automatic air vent"] },
  { pattern: /pressure sensor|f\.?\s*75/, terms: ["pressure sensor"] },
];

export function normalisePart(value: string): string {
  return value.toUpperCase().replace(/[\s-]/g, "");
}

export function extractGc(value: string): string | null {
  const match = value.match(/\b(\d{2})\s*[- ]\s*(\d{3})\s*[- ]\s*(\d{2})\b/);
  if (!match) return null;
  return `${match[1]}${match[2]}${match[3]}`;
}

function tokens(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOP.has(token));
}

export function searchProducts(products: Product[], query: string): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const gc = extractGc(trimmed);
  const partQuery = normalisePart(trimmed);
  const queryTokens = tokens(trimmed);
  const extra: string[] = [];
  for (const rule of EXPANSIONS) {
    if (rule.pattern.test(trimmed)) extra.push(...rule.terms.flatMap(tokens));
  }
  const hits: SearchHit[] = [];

  for (const product of products) {
    const hay = `${product.partNumber} ${product.brand} ${product.description} ${product.fits}`.toLowerCase();
    const partNorm = normalisePart(product.partNumber);
    const fitsGc = (product.fits.match(/\d{2}\s*[- ]\s*\d{3}\s*[- ]\s*\d{2}/g) || [])
      .map((value) => value.replace(/\D/g, ""));
    let score = 0;
    let reason = "Description";

    if (partNorm === partQuery && partQuery.length >= 4) {
      score += 1000;
      reason = "Part number";
    } else if (partQuery.length >= 5 && (partNorm.includes(partQuery) || partQuery.includes(partNorm))) {
      score += 400;
      reason = "Part number";
    }

    if (gc && fitsGc.includes(gc)) {
      score += 500;
      reason = "GC number on the fit list";
    }

    const modelTokens = queryTokens.filter((token) => token.length > 2);
    if (modelTokens.length >= 2 && modelTokens.every((token) => hay.includes(token))) {
      score += 120;
      if (reason === "Description") reason = "Model on the fit list";
    }

    const description = product.description.toLowerCase();
    if (description.includes(trimmed.toLowerCase())) {
      score += 160;
      reason = "Description";
    }

    for (const token of queryTokens) {
      if (description.includes(token)) score += 18;
      if (product.fits.toLowerCase().includes(token)) score += 10;
      if (product.brand.toLowerCase().includes(token)) score += 8;
    }
    for (const token of extra) {
      if (hay.includes(token)) score += 7;
    }

    if (score > 0) hits.push({ ...product, score, reason });
  }

  hits.sort((a, b) => b.score - a.score || a.partNumber.localeCompare(b.partNumber));
  return hits.slice(0, 30);
}

type KbAlternativeRow = {
  sheet: string;
  description: string;
  componentType: string;
  confidence: string;
  cautions: string;
  groupStatus: string;
  relationship: string;
  evidenceUrl: string;
  brandA: string;
  partA: string;
  fitsA: string;
  brandB: string;
  partB: string;
  fitsB: string;
  further: string;
  chain: string;
};

let alternativeCache: KbAlternativeRow[] | null = null;

export function loadAlternatives(csvText: string): KbAlternativeRow[] {
  return csvRecords(csvText).map((row) => ({
    sheet: row["Sheet"] || "",
    description: row["Common part (plain description)"] || "",
    componentType: row["Component type"] || "",
    confidence: row["Confidence"] || "",
    cautions: row["Cautions / differences"] || "",
    groupStatus: row["Group / cross-company status"] || "",
    relationship: row["Same part or supersession?"] || "",
    evidenceUrl: row["Evidence source URL"] || "",
    brandA: row["Brand A"] || "",
    partA: row["Brand A part no."] || "",
    fitsA: row["Fits models (A)"] || "",
    brandB: row["Brand B"] || "",
    partB: row["Brand B part no."] || "",
    fitsB: row["Fits models (B)"] || "",
    further: row["Brand C / further equivalents (part nos.)"] || "",
    chain: row["Also listed as / chain (all numbers matched on fetched pages)"] || "",
  }));
}

export function getAlternativeRows(csvPath: string): KbAlternativeRow[] {
  if (!alternativeCache) {
    alternativeCache = fs.existsSync(csvPath) ? loadAlternatives(fs.readFileSync(csvPath, "utf8")) : [];
  }
  return alternativeCache;
}

export function clearAlternativeCache() {
  alternativeCache = null;
}

function boundaryHas(haystack: string, partNumber: string): boolean {
  const needle = partNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|[^A-Z0-9])${needle}([^A-Z0-9]|$)`, "i");
  return pattern.test(haystack.toUpperCase());
}

function numbersIn(text: string): { brand: string; partNumber: string }[] {
  const found: { brand: string; partNumber: string }[] = [];
  const branded = text.split(/;/);
  for (const chunk of branded) {
    const brandMatch = chunk.match(/^\s*([A-Za-z][A-Za-z .'-]*?)\s+(\d[\dA-Z./-]{3,})/);
    if (brandMatch) {
      found.push({ brand: brandMatch[1].trim(), partNumber: brandMatch[2].replace(/[.,]+$/, "") });
    }
  }
  return found;
}

export function alternativesFor(
  partNumber: string,
  rows: KbAlternativeRow[],
  products: Product[],
): Alternative[] {
  const matches = rows.filter((row) => {
    const blob = [row.partA, row.partB, row.further, row.chain, row.description].join(" \n ");
    return boundaryHas(blob, partNumber);
  });

  return matches.slice(0, 8).map((row) => {
    const equivalents = [
      { brand: row.brandA, partNumber: row.partA, fits: row.fitsA },
      { brand: row.brandB, partNumber: row.partB, fits: row.fitsB },
      ...numbersIn(row.further).map((item) => ({ ...item, fits: "" })),
    ].filter((item) => item.partNumber);
    const sameCompany = /not cross-brand|same company|same-group|same group/i.test(
      `${row.sheet} ${row.groupStatus}`,
    );
    const priced = equivalents
      .map((item) => {
        const product = products.find((candidate) => boundaryHas(item.partNumber, candidate.partNumber) || boundaryHas(candidate.partNumber, item.partNumber.split(/[/(]/)[0].trim()));
        return product;
      })
      .filter((product): product is Product => Boolean(product));
    const current = products.find((product) => normalisePart(product.partNumber) === normalisePart(partNumber));
    const cheaperInCatalogue = current
      ? priced
          .filter(
            (product) =>
              normalisePart(product.partNumber) !== normalisePart(current.partNumber) &&
              product.pricePence < current.pricePence,
          )
          .map((product) => ({
            partNumber: product.partNumber,
            brand: product.brand,
            description: product.description,
            pricePence: product.pricePence,
            priceNote: product.priceNote,
          }))
      : [];
    return {
      sheet: row.sheet,
      description: row.description,
      componentType: row.componentType,
      confidence: row.confidence,
      cautions: row.cautions,
      groupStatus: row.groupStatus,
      relationship: row.relationship,
      evidenceUrl: row.evidenceUrl,
      equivalents,
      sameCompany,
      cheaperInCatalogue,
    };
  });
}
