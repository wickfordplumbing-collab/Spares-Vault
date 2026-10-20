import bundle from "./data.json";
import type { Alternative, ChatResponse, Order, OrderItem, Product, SearchHit } from "../types";

const GAS_SAFE_NOTE =
  "Gas work must be done by a Gas Safe registered engineer. This is parts guidance for identifying spares, not instructions to open a boiler or work on gas, flue, or combustion parts.";

const DEMO_TOKEN = "change-me";
const ORDERS_KEY = "wickford.demo.orders";
const SEQ_KEY = "wickford.demo.seq";
const PRODUCTS_KEY = "wickford.demo.products";

type Chunk = { id: string; source: string; title: string; text: string };
type Store = { getItem(key: string): string | null; setItem(key: string, value: string): void };

const memory = new Map<string, string>();

function storage(): Store {
  if (typeof localStorage !== "undefined") return localStorage;
  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
  };
}

export function isDemoMode(): boolean {
  if (process.env.EXPO_PUBLIC_DEMO === "1") return true;
  if (typeof window !== "undefined" && /(^|\.)github\.io$/.test(window.location.hostname)) return true;
  return false;
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const s = input.replace(/^\uFEFF/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
          continue;
        }
        inQuotes = false;
        continue;
      }
      field += c;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      continue;
    }
    field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }
  return rows;
}

function csvRecords(input: string): Record<string, string>[] {
  const rows = parseCsv(input);
  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return record;
  });
}

function poundsToPence(value: string): number {
  const cleaned = value.trim().replace(/[£,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) throw new Error(`Price must be pounds and pence, got "${value}"`);
  const [pounds, fraction = ""] = cleaned.split(".");
  return Number(pounds) * 100 + Number(fraction.padEnd(2, "0"));
}

function productsFromCsv(csv: string): Product[] {
  const aliases: Record<string, string[]> = {
    partNumber: ["part_number", "part number", "partnumber", "mpn", "sku", "part no", "part no."],
    description: ["description", "desc", "name"],
    brand: ["brand", "make", "manufacturer"],
    price: ["price", "price_gbp", "trade_price", "retail_price"],
    stock: ["stock", "qty", "quantity", "stock_qty"],
    fits: ["fits", "models", "boilers", "fitment", "appliances"],
    priceNote: ["price_note", "price note", "note", "notes"],
  };
  const pick = (record: Record<string, string>, field: keyof typeof aliases) => {
    for (const [key, value] of Object.entries(record)) {
      if (aliases[field].includes(key.trim().toLowerCase())) return value.trim();
    }
    return "";
  };
  const products: Product[] = [];
  csvRecords(csv).forEach((record, index) => {
    const partNumber = pick(record, "partNumber");
    const description = pick(record, "description");
    const brand = pick(record, "brand");
    if (!partNumber || !description || !brand) return;
    const stockRaw = pick(record, "stock") || "0";
    if (!/^\d+$/.test(stockRaw)) throw new Error(`Line ${index + 2}: stock must be a whole number`);
    products.push({
      partNumber,
      description,
      brand,
      pricePence: poundsToPence(pick(record, "price")),
      stock: Number(stockRaw),
      fits: pick(record, "fits"),
      priceNote: pick(record, "priceNote"),
    });
  });
  return products;
}

function loadProducts(): Product[] {
  const saved = storage().getItem(PRODUCTS_KEY);
  if (saved) return JSON.parse(saved) as Product[];
  return productsFromCsv(bundle.catalogueCsv);
}

function saveProducts(products: Product[]) {
  storage().setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function catalogueMode(products: Product[]): "sample" | "trade" | "empty" {
  if (!products.length) return "empty";
  return products.every((product) => /placeholder/i.test(product.priceNote)) ? "sample" : "trade";
}

const STOP = new Set("the a an of and or to for on in it is with my our please what how does do i we me that this from by as be at are was if not but they you".split(" "));

function tokensOf(text: string): string[] {
  const parts = text
    .toLowerCase()
    .split(/[^a-z0-9.]+/)
    .filter((token) => token.length > 1 && !STOP.has(token));
  return [...parts, ...parts.map((token) => token.replace(/\./g, "")).filter((token) => token.length > 1 && !STOP.has(token))];
}

function chunkMarkdown(source: string, text: string): Chunk[] {
  const chunks: Chunk[] = [];
  let heading = source;
  let buffer: string[] = [];
  let index = 0;
  const flush = () => {
    const body = buffer.join("\n").trim();
    buffer = [];
    if (body.length < 40) return;
    const windows = body.length <= 1800 ? [body] : Array.from({ length: Math.ceil(body.length / 1400) }, (_, n) => body.slice(n * 1400, n * 1400 + 1800));
    for (const window of windows) chunks.push({ id: `${source}#${index++}`, source, title: heading, text: window });
  };
  for (const line of text.split(/\r?\n/)) {
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      flush();
      heading = headingMatch[2].trim();
      buffer.push(line);
    } else buffer.push(line);
  }
  flush();
  return chunks;
}

function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  for (const [name, text] of Object.entries(bundle.files)) {
    if (name.endsWith(".md")) chunks.push(...chunkMarkdown(name, text));
    else if (name.endsWith(".csv")) {
      csvRecords(text).forEach((row, index) => {
        const title = row["Common part (plain description)"] || row["Family"] || `${name} row ${index + 1}`;
        const body = Object.entries(row)
          .filter(([, value]) => value && value.trim())
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        chunks.push({ id: `${name}#${index}`, source: name, title, text: body });
      });
    } else chunks.push({ id: name, source: name, title: name, text: text.slice(0, 8000) });
  }
  return chunks;
}

class KnowledgeIndex {
  chunks: Chunk[];
  private docs: string[][];
  private df = new Map<string, number>();
  private postings = new Map<string, { id: number; tf: number }[]>();
  private avg = 0;

  constructor(chunks: Chunk[]) {
    this.chunks = chunks;
    this.docs = chunks.map((chunk) => tokensOf(`${chunk.title}\n${chunk.text}`));
    this.docs.forEach((doc, id) => {
      const counts = new Map<string, number>();
      for (const token of doc) counts.set(token, (counts.get(token) || 0) + 1);
      this.avg += doc.length;
      for (const [token, tf] of counts) {
        this.df.set(token, (this.df.get(token) || 0) + 1);
        const list = this.postings.get(token) || [];
        list.push({ id, tf });
        this.postings.set(token, list);
      }
    });
    this.avg = this.docs.length ? this.avg / this.docs.length : 0;
  }

  search(query: string, limit = 8): Chunk[] {
    const scores = new Map<number, number>();
    const k1 = 1.2;
    const b = 0.75;
    const n = this.docs.length || 1;
    for (const token of new Set(tokensOf(query))) {
      const df = this.df.get(token) || 0;
      if (!df) continue;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      for (const posting of this.postings.get(token) || []) {
        const len = this.docs[posting.id].length || 1;
        const denom = posting.tf + k1 * (1 - b + b * (len / (this.avg || 1)));
        scores.set(posting.id, (scores.get(posting.id) || 0) + idf * ((posting.tf * (k1 + 1)) / denom));
      }
    }
    const code = query.match(/\b[a-z]\.\d{2}(?:\.\d{2})?\b/i);
    if (code) {
      const needle = code[0].toLowerCase();
      this.chunks.forEach((chunk, id) => {
        if (chunk.text.toLowerCase().includes(needle)) scores.set(id, (scores.get(id) || 0) + 2.4);
      });
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => this.chunks[id]);
  }
}

const index = new KnowledgeIndex(buildChunks());

const EXPANSIONS: { pattern: RegExp; terms: string[] }[] = [
  { pattern: /blue\s+valve|valve\s+under|under\s+the\s+boiler|blue\s+handle/, terms: ["filling loop", "blue-handled", "blue valve under the boiler"] },
  { pattern: /\bprv\b|pressure relief|safety valve|dripping outside|discharge pipe/, terms: ["pressure relief", "safety valve", "prv"] },
  { pattern: /filling loop|top up|re-?pressur/, terms: ["filling loop"] },
  { pattern: /no hot water|hot water cold|lukewarm|dhw only/, terms: ["diverter", "flow sensor", "plate heat exchanger", "turbine"] },
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

function normalisePart(value: string): string {
  return value.toUpperCase().replace(/[\s-]/g, "");
}

function searchProducts(products: Product[], query: string): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const gcMatch = trimmed.match(/\b(\d{2})\s*[- ]\s*(\d{3})\s*[- ]\s*(\d{2})\b/);
  const gc = gcMatch ? `${gcMatch[1]}${gcMatch[2]}${gcMatch[3]}` : null;
  const partQuery = normalisePart(trimmed);
  const queryTokens = trimmed
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOP.has(token));
  const extra = EXPANSIONS.filter((rule) => rule.pattern.test(trimmed)).flatMap((rule) => rule.terms.flatMap((term) => term.toLowerCase().split(/[^a-z0-9]+/)));
  const hits: SearchHit[] = [];
  for (const product of products) {
    const hay = `${product.partNumber} ${product.brand} ${product.description} ${product.fits}`.toLowerCase();
    const partNorm = normalisePart(product.partNumber);
    const fitsGc = (product.fits.match(/\d{2}\s*[- ]\s*\d{3}\s*[- ]\s*\d{2}/g) || []).map((value) => value.replace(/\D/g, ""));
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
    for (const token of extra) if (token && hay.includes(token)) score += 7;
    if (score > 0) hits.push({ ...product, score, reason });
  }
  hits.sort((a, b) => b.score - a.score || a.partNumber.localeCompare(b.partNumber));
  return hits.slice(0, 30);
}

function boundaryHas(haystack: string, partNumber: string): boolean {
  const needle = partNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Z0-9])${needle}([^A-Z0-9]|$)`, "i").test(haystack.toUpperCase());
}

function alternativesFor(partNumber: string, products: Product[]): Alternative[] {
  const csv = bundle.files["cross-brand-equivalents.csv"] || "";
  return csvRecords(csv)
    .filter((row) => boundaryHas([row["Brand A part no."], row["Brand B part no."], row["Brand C / further equivalents (part nos.)"], row["Also listed as / chain (all numbers matched on fetched pages)"], row["Common part (plain description)"]].join(" \n "), partNumber))
    .slice(0, 8)
    .map((row) => {
      const equivalents = [
        { brand: row["Brand A"] || "", partNumber: row["Brand A part no."] || "", fits: row["Fits models (A)"] || "" },
        { brand: row["Brand B"] || "", partNumber: row["Brand B part no."] || "", fits: row["Fits models (B)"] || "" },
        ...(row["Brand C / further equivalents (part nos.)"] || "").split(";").flatMap((chunk) => {
          const match = chunk.match(/^\s*([A-Za-z][A-Za-z .'-]*?)\s+(\d[\dA-Z./-]{3,})/);
          return match ? [{ brand: match[1].trim(), partNumber: match[2].replace(/[.,]+$/, ""), fits: "" }] : [];
        }),
      ].filter((item) => item.partNumber);
      const sheet = row["Sheet"] || "";
      const groupStatus = row["Group / cross-company status"] || "";
      const sameCompany = /not cross-brand|same company|same-group|same group/i.test(`${sheet} ${groupStatus}`);
      const current = products.find((product) => normalisePart(product.partNumber) === normalisePart(partNumber));
      const cheaperInCatalogue = current
        ? equivalents
            .map((item) => products.find((candidate) => boundaryHas(item.partNumber, candidate.partNumber) || boundaryHas(candidate.partNumber, item.partNumber.split(/[/(]/)[0].trim())))
            .filter((product): product is Product => Boolean(product))
            .filter((product) => normalisePart(product.partNumber) !== normalisePart(current.partNumber) && product.pricePence < current.pricePence)
            .map((product) => ({ partNumber: product.partNumber, brand: product.brand, description: product.description, pricePence: product.pricePence, priceNote: product.priceNote }))
        : [];
      return {
        sheet,
        description: row["Common part (plain description)"] || "",
        componentType: row["Component type"] || "",
        confidence: row["Confidence"] || "",
        cautions: row["Cautions / differences"] || "",
        groupStatus,
        relationship: row["Same part or supersession?"] || "",
        evidenceUrl: row["Evidence source URL"] || "",
        equivalents,
        sameCompany,
        cheaperInCatalogue,
      };
    });
}

function warningsForPart(partNumber: string): string[] {
  const needle = partNumber.toLowerCase();
  const warnings: string[] = [];
  for (const chunk of index.chunks) {
    if (!chunk.text.toLowerCase().includes(needle)) continue;
    for (const sentence of chunk.text.split(/(?<=[.!?])\s+|\n+/)) {
      const line = sentence.replace(/\s+/g, " ").trim();
      if (line.length < 40 || line.length > 420 || !line.toLowerCase().includes(needle)) continue;
      if (/collision|different part|do not|must not|not this|24v|3\.5 bar|voltage|confirm|conflict/i.test(line)) warnings.push(`${line} (${chunk.source})`);
      if (warnings.length >= 3) return warnings;
    }
  }
  return warnings;
}

const BRANDS = ["Saunier Duval", "Worcester Bosch", "Worcester", "Glow-worm", "Glowworm", "Vaillant", "Ideal", "Potterton", "Intergas", "Viessmann", "Vokera", "Ferroli", "Ariston", "Keston", "Heatline", "Ravenheat", "Biasi", "Remeha", "Alpha", "Baxi", "Main"];
const FAMILIES: { test: RegExp; keywords: string[]; why: string }[] = [
  { test: /f\.?\s*24|f\.?\s*23|rise too fast|spread too/i, keywords: ["pump", "circulator", "ntc", "thermistor", "temperature sensor"], why: "F.23/F.24 in the ecoTEC plus and Glow-worm notes is temperature spread or rise too fast: circulation, air, sensors inverted, strainer, pump, non-return valve. These catalogue lines are that family only. The code is not a verdict on one part." },
  { test: /f\.?\s*75|e119|low pressure sensor/i, keywords: ["pressure sensor", "pump", "pressure switch"], why: "F.75 is a system of sensor, pump, air and actual pressure — the wording even changes between Vaillant, ecoFIT and Glow-worm manuals. Do not sell one part from the code." },
  { test: /f\.?\s*28|f\.?\s*29|e133|\bl2\b|\bl02\b|\bea\b|ignition|no flame|locks out/i, keywords: ["electrode", "ignition", "ionisation", "condensate"], why: "Ignition lockout codes (F.28/F.29, E133, L2, EA and the equivalents) mean flame not proven. Condensate, gas supply, electrode, earth and the gas valve are all on the list. Gas valve and burner work is for the Gas Safe engineer; the code alone does not condemn a part." },
  { test: /f\.?\s*32|fan fault|\bfan\b/i, keywords: ["fan"], why: "A fan code can be the fan, the harness, or no supply from the PCB. Ask whether voltage is arriving at the fan before ordering the fan." },
  { test: /no hot water|hot water cold|dhw|shower goes cold|lukewarm/i, keywords: ["diverter", "flow sensor", "turbine", "plate", "cartridge"], why: "Hot water with heating still working splits three ways: no DHW demand (flow sensor/turbine), demand and it fires but the water is poor (plate or diverter travel), demand and it does not fire (diverter motor). Motor, cartridge and valve body are different orders." },
  { test: /pressure goes up|expansion|prv|relief valve|discharg/i, keywords: ["expansion vessel", "pressure relief", "safety valve"], why: "Pressure high when hot and low when cold, with water at the outside pipe, points at the expansion vessel first. The PRV is often the victim. Replace it only once the cause of it lifting is known." },
  { test: /blank display|dead boiler|\bpcb\b|fuse/i, keywords: ["fuse", "printed circuit board", "pcb"], why: "A blank display is power, then the board fuse, then external controls. The PCB is last." },
];

function detectBrand(text: string): string | null {
  const lower = text.toLowerCase();
  for (const brand of BRANDS) {
    if (lower.includes(brand.toLowerCase())) {
      if (brand === "Glowworm") return "Glow-worm";
      if (brand === "Worcester") return "Worcester Bosch";
      return brand;
    }
  }
  return null;
}

function detectFaultCode(text: string): string | null {
  const patterns = [/\b([A-Z]\.\d{2}\.\d{2})\b/i, /\b([A-Z]\.\d{2})\b/i, /\b(E\d{2,3})\b/i, /\b(EA)\b/, /\b([LF]\d{1,2})\b/i];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const raw = match[1].toUpperCase();
    if (/^[FL]\d{1,2}$/.test(raw)) return `${raw[0]}.${raw.slice(1)}`;
    return raw;
  }
  return null;
}

function detectModel(text: string): string | null {
  const patterns = [/eco\s?tec\s+plus\s+\d{3}/i, /logic(?:\s+combi)?\s+\d{2}/i, /duotec\s*2?(?:\s+combi)?(?:\s+(?:he|ga))?\s*\d{2}/i, /greenstar\s+\d+\s*i?\s+junior/i, /betacom\s+\d+\s*c/i, /hre\s+\d{2}\s*\/\s*\d{2}/i, /suprima\s+\d+/i, /cxi\s+\d+/i];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].replace(/\s+/g, " ");
  }
  return null;
}

function answer(messages: { role: string; content: string }[]): ChatResponse {
  const transcript = messages.map((message) => `${message.role}: ${message.content}`).join("\n");
  const focus = transcript;
  const code = detectFaultCode(focus);
  const model = detectModel(focus);
  const brand = detectBrand(focus);
  const seen = new Set<string>();
  const chunks = [...index.search(focus, 8), ...index.search([brand, model, code, "GC number"].filter(Boolean).join(" "), 6)].filter((chunk) => {
    if (seen.has(chunk.id)) return false;
    seen.add(chunk.id);
    return true;
  });
  const identity = [brand, model].filter(Boolean).join(" ");
  const codePattern = code ? new RegExp(code.replace(".", "\\.?"), "i") : /$a/;
  const excerpt = (needle: RegExp, limit = 3) => {
    const lines: string[] = [];
    for (const chunk of chunks) {
      for (const line of chunk.text.split("\n")) {
        const clean = line.replace(/\s+/g, " ").replace(/^\|/, "").trim();
        if (clean.length < 30 || clean.length > 360 || !needle.test(clean)) continue;
        lines.push(clean);
        if (lines.length >= limit) return lines;
      }
    }
    return lines;
  };
  const codeLines = code ? excerpt(codePattern, 3) : [];
  const gcLines = excerpt(/GC Number|GC\s+\d{2}-\d{3}-\d{2}/i, 2);
  const steps: { title: string; detail: string }[] = [
    {
      title: "Pin the appliance before any part",
      detail: identity
        ? `Working from what you have said: ${identity}${code ? `, code ${code}` : ""}. I still want a photo of the data badge — full model, kW, GC number (00-000-00), serial, and natural gas or LPG. The name on the front case is not enough, and a range covers more than one appliance.`
        : "I do not have a make and model yet. Start with a photo of the data badge: make, full model, kW, GC number, serial, and fuel. Then the fault code as it is displayed, letters and dots included.",
    },
  ];
  if (codeLines.length) steps.push({ title: code ? `What ${code} covers in our notes` : "What the notes say", detail: `${codeLines.join(" ")} A code lists causes, not a verdict. If the manual in front of you is a different generation, that manual wins — Baxi Combi 2, Worcester 4000 and older letter codes are not interchangeable.` });
  else if (code) steps.push({ title: `${code} is not in the notes we hold`, detail: `I will not invent a meaning for ${code}. Check the installation and servicing instructions for this exact model, or the DHS appliance page / PartsArena for that GC. Do not order from a generic code list.` });
  else {
    const symptom = excerpt(/no hot water|no heating|low pressure|ignition|condensate|diverter/i, 2);
    steps.push({ title: "What the symptom points at", detail: symptom.length ? `${symptom.join(" ")} Tell me the code from the display as well — letters and dots matter.` : "Describe whether heating, hot water, or both have failed, and whether the boiler fires, clicks, or stays dark. A fault code from the display narrows this a lot." });
  }
  if (gcLines.length && identity) steps.push({ title: "GC and build date", detail: `${gcLines[0]} The GC printed on the data badge is the one that counts. Write make, model, GC, serial and the part number on the order.` });
  steps.push({ title: "Checks before a part is ordered", detail: "Customer-level checks are only the ones in the user guide: system pressure (often 1–1.5 bar cold, where that guide says so), a frozen condensate pipe outside in a cold snap, gas meter credit and supply on, room stat and timer calling, and one reset as the guide instructs. If it comes back, it is a Gas Safe job. Cheap causes first: pressure, air, condensate, controls, sludge. Do not jump to a PCB, and do not condemn a gas valve from the code." });
  const family = FAMILIES.find((item) => item.test.test(focus));
  const brandToken = brand ? brand.toLowerCase().split(" ")[0] : "";
  const parts = family
    ? loadProducts()
        .map((product) => {
          const hay = `${product.description} ${product.fits} ${product.brand}`.toLowerCase();
          if (brandToken && !hay.includes(brandToken)) return null;
          let score = 0;
          for (const keyword of family.keywords) if (hay.includes(keyword)) score += 3;
          if (!score) return null;
          if (brandToken) score += 4;
          if (model && hay.includes(model.toLowerCase())) score += 5;
          return { product, score };
        })
        .filter((item): item is { product: Product; score: number } => Boolean(item))
        .sort((a, b) => b.score - a.score)
        .filter((item, _, all) => all.findIndex((other) => other.product.description.toLowerCase().split(" ").slice(0, 3).join(" ") === item.product.description.toLowerCase().split(" ").slice(0, 3).join(" ")) === all.indexOf(item))
        .slice(0, 3)
        .map((item) => ({ ...item.product, why: family.why }))
    : [];
  const opening = identity
    ? `Right — ${identity}${code ? `, code ${code}` : ""}. I'll take it the way we would on the counter, one check at a time. I will not call a part faulty from the code alone.`
    : "Tell me the boiler and what it is doing, and I'll walk it one check at a time. I need the data badge before anything is ordered.";
  const missingCode = code && !codeLines.length ? `${code} is not in the notes we hold. Check the installation manual for this exact model, or the DHS appliance page for that GC. I will not invent a meaning or a part.` : "";
  const partLine = parts.length
    ? `Parts worth having ready once the engineer has proved the cause: ${parts.map((part) => `${part.brand} ${part.partNumber} (${part.description})`).join("; ")}. Prices on these are placeholders until the Intact/Xline stock file is loaded.`
    : "I have not pinned a catalogue part yet. Identify the appliance, then we match a diagram position to a manufacturer number.";
  return {
    reply: [opening, missingCode, partLine, GAS_SAFE_NOTE].filter(Boolean).join("\n\n"),
    steps,
    parts,
    gasSafeNote: GAS_SAFE_NOTE,
    sources: chunks.slice(0, 5).map((chunk) => ({ file: chunk.source, title: chunk.title })),
    mode: "mock",
  };
}

function loadOrders(): Order[] {
  const raw = storage().getItem(ORDERS_KEY);
  return raw ? (JSON.parse(raw) as Order[]) : [];
}

function saveOrders(orders: Order[]) {
  storage().setItem(ORDERS_KEY, JSON.stringify(orders));
}

function composeEmail(order: Order) {
  const lines = order.items
    .map((item, i) => [`${i + 1}. ${item.qty} × ${item.partNumber}  ${item.brand}`, `   ${item.description}`, item.fits ? `   Fits note: ${item.fits}` : ""].filter(Boolean).join("\n"))
    .join("\n");
  const address = [order.customerName, order.addressLine1, order.addressLine2, order.city, order.postcode, "United Kingdom", `Phone: ${order.customerPhone}`, `Email: ${order.customerEmail}`].filter(Boolean).join("\n");
  const subject = `Wickford Plumbing Supplies order ${order.id} — drop-ship`;
  const supplierEmailBody = [
    "WICKFORD PLUMBING SUPPLIES",
    `Drop-ship request ${order.id}`,
    "Supplier: DHS (Direct Heating Spares)",
    "To: orders@dhsspares.example",
    "Please deliver the parts below to the customer address.",
    "Invoice Wickford Plumbing Supplies on our trade account. Do not charge the customer.",
    "CUSTOMER DELIVERY ADDRESS",
    address,
    "PARTS",
    lines,
    order.notes ? `ORDER NOTES\n${order.notes}` : "",
    "Write make, model, GC number and serial on the job before the part is fitted.",
    "Prices are not shown on this supplier copy.",
    GAS_SAFE_NOTE,
    "— Wickford Plumbing Supplies, Wickford, Essex",
    "",
    "DEMO: this email was composed in the browser. Nothing was sent.",
  ]
    .filter(Boolean)
    .join("\n");
  const priceLines = order.items
    .map((item) => `${item.qty} × ${item.partNumber} ${item.brand} @ £${(item.pricePence / 100).toFixed(2)} = £${((item.pricePence * item.qty) / 100).toFixed(2)}${/placeholder/i.test(item.priceNote) ? " (placeholder price)" : ""}`)
    .join("\n");
  const wickfordEmailBody = `${supplierEmailBody}\n\n----------\nINTERNAL COPY FOR WICKFORD — not for the supplier packing note\nPayment: ${order.paymentMode}\nMerchandise total (ex VAT): £${(order.subtotalPence / 100).toFixed(2)}\n${priceLines}\nCarriage is arranged by the supplier. No carriage has been added in this build.\nThis browser demo did not send email.`;
  return { subject, supplierEmailBody, wickfordEmailBody };
}

function findProduct(products: Product[], partNumber: string): Product | undefined {
  return products.find((product) => product.partNumber === partNumber) || products.find((product) => normalisePart(product.partNumber) === normalisePart(partNumber));
}

class DemoError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function requireAdmin(token?: string) {
  if (token !== DEMO_TOKEN) throw new DemoError(401, "Staff token required");
}

export async function demoRequest<T>(path: string, init?: { method?: string; body?: BodyInit | null; token?: string }): Promise<T> {
  const url = new URL(path, "https://demo.local");
  const method = (init?.method || "GET").toUpperCase();
  const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {};
  const products = loadProducts();

  if (url.pathname === "/api/health") {
    return {
      ok: true,
      assistantMode: "mock",
      payments: "simulated-test",
      supplierAdapter: "email",
      supplierName: "DHS (Direct Heating Spares)",
      catalogueMode: catalogueMode(products),
      productCount: products.length,
      gasSafeNote: GAS_SAFE_NOTE,
      demo: true,
    } as T;
  }
  if (url.pathname === "/api/search") return { query: url.searchParams.get("q") || "", results: searchProducts(products, url.searchParams.get("q") || "") } as T;
  if (url.pathname === "/api/product") {
    const product = findProduct(products, url.searchParams.get("partNumber") || "");
    if (!product) throw new DemoError(404, "Part not found in the catalogue");
    return { product, alternatives: alternativesFor(product.partNumber, products), warnings: warningsForPart(product.partNumber), gasSafeNote: GAS_SAFE_NOTE } as T;
  }
  if (url.pathname === "/api/chat" && method === "POST") {
    const messages = Array.isArray(body.messages) ? (body.messages as { role?: string; content?: string }[]) : [];
    const cleaned = messages
      .filter((message) => message && typeof message.content === "string")
      .map((message) => ({ role: message.role === "assistant" ? "assistant" : "user", content: String(message.content).slice(0, 4000) }))
      .slice(-12);
    if (!cleaned.length) throw new DemoError(400, "Send a message describing the boiler and the fault");
    return answer(cleaned) as T;
  }

  const confirm = url.pathname.match(/^\/api\/orders\/([^/]+)\/confirm-test$/);
  if (confirm && method === "POST") {
    const orders = loadOrders();
    const order = orders.find((item) => item.id === decodeURIComponent(confirm[1]));
    if (!order) throw new DemoError(404, "Order not found");
    const digits = String(body.cardNumber || "").replace(/\D/g, "");
    if (digits !== "4242424242424242") throw new DemoError(402, "Use the Stripe test card 4242 4242 4242 4242. Any future expiry and any CVC are accepted here. The card number is not stored.");
    const email = composeEmail(order);
    const saved: Order = {
      ...order,
      status: "sent_to_supplier",
      paymentMode: "simulated-test",
      supplierAdapter: "email",
      supplierStatus: "DEMO: supplier email composed in this browser. Nothing was sent to DHS or Wickford.",
      supplierEmailTo: "orders@dhsspares.example",
      wickfordEmailTo: "orders@wickfordplumbing.example",
      emailSubject: email.subject,
      supplierEmailBody: email.supplierEmailBody,
      wickfordEmailBody: email.wickfordEmailBody,
      emailDelivery: "browser",
      emailError: null,
    };
    saveOrders(orders.map((item) => (item.id === saved.id ? saved : item)));
    return { order: saved } as T;
  }

  const orderGet = url.pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (orderGet && method === "GET") {
    const order = loadOrders().find((item) => item.id === decodeURIComponent(orderGet[1]));
    const email = url.searchParams.get("email") || "";
    if (!order || email.toLowerCase() !== order.customerEmail.toLowerCase()) throw new DemoError(404, "Order not found");
    return { order } as T;
  }

  if (url.pathname === "/api/checkout" && method === "POST") {
    const customer = (body.customer || {}) as { name?: string; email?: string; phone?: string };
    const address = (body.address || {}) as { line1?: string; line2?: string; city?: string; postcode?: string };
    const name = customer.name?.trim() || "";
    const email = customer.email?.trim() || "";
    const phone = customer.phone?.trim() || "";
    const line1 = address.line1?.trim() || "";
    const city = address.city?.trim() || "";
    const postcode = address.postcode?.trim() || "";
    if (!name || !email.includes("@") || phone.length < 6 || !line1 || !city || !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postcode)) {
      throw new DemoError(400, "Name, email, phone, address line, city, and a UK postcode are required");
    }
    const requested = Array.isArray(body.items) ? (body.items as { partNumber?: string; qty?: number }[]) : [];
    if (!requested.length) throw new DemoError(400, "The basket is empty");
    const items: OrderItem[] = requested.map((item) => {
      const product = findProduct(products, String(item.partNumber || ""));
      const qty = Number(item.qty);
      if (!product) throw new DemoError(400, `Unknown part ${item.partNumber}`);
      if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new DemoError(400, "Quantity must be 1–99");
      return { partNumber: product.partNumber, brand: product.brand, description: product.description, qty, pricePence: product.pricePence, priceNote: product.priceNote, fits: product.fits };
    });
    const seq = Number(storage().getItem(SEQ_KEY) || "1000") + 1;
    storage().setItem(SEQ_KEY, String(seq));
    const order: Order = {
      id: `WPS-${seq}`,
      createdAt: new Date().toISOString(),
      status: "pending_payment",
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      addressLine1: line1,
      addressLine2: address.line2?.trim() || "",
      city,
      postcode: postcode.toUpperCase(),
      notes: String(body.notes || ""),
      items,
      subtotalPence: items.reduce((sum, item) => sum + item.pricePence * item.qty, 0),
      paymentMode: "simulated-test",
      supplierAdapter: "email",
      supplierStatus: null,
      supplierEmailTo: null,
      wickfordEmailTo: null,
      emailSubject: null,
      supplierEmailBody: null,
      wickfordEmailBody: null,
      emailDelivery: null,
      emailError: null,
    };
    saveOrders([order, ...loadOrders()]);
    return {
      orderId: order.id,
      subtotalPence: order.subtotalPence,
      paymentMode: "simulated-test",
      checkoutUrl: null,
      publishableHint: "Browser demo. Pay with Stripe test card 4242 4242 4242 4242. No card data leaves this device, and the supplier email is only shown on the order.",
    } as T;
  }

  if (url.pathname === "/api/admin/orders") {
    requireAdmin(init?.token);
    return { orders: loadOrders() } as T;
  }
  if (url.pathname === "/api/admin/catalogue/import" && method === "POST") {
    requireAdmin(init?.token);
    const csv = typeof body.csv === "string" ? body.csv : "";
    if (!csv.trim()) throw new DemoError(400, "Paste the CSV into the csv field");
    const incoming = productsFromCsv(csv);
    const replace = Boolean(body.replace);
    const next = replace ? [] : [...products];
    let inserted = 0;
    let updated = 0;
    for (const product of incoming) {
      const existing = next.findIndex((item) => item.partNumber === product.partNumber);
      if (existing >= 0 && !replace) {
        next[existing] = product;
        updated++;
      } else {
        next.push(product);
        inserted++;
      }
    }
    saveProducts(next);
    return { inserted, updated, skipped: 0, errors: [], catalogueMode: catalogueMode(next) } as T;
  }

  throw new DemoError(404, `No demo route for ${url.pathname}`);
}
