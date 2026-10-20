import { GAS_SAFE_NOTE } from "./config.js";
import type { KnowledgeIndex, Chunk } from "./kb.js";
import type { LlmProvider } from "./llm.js";
import type { ChatPart, ChatResponse, ChatStep, Product } from "./types.js";

const BRANDS = [
  "Saunier Duval",
  "Worcester Bosch",
  "Worcester",
  "Glow-worm",
  "Glowworm",
  "Vaillant",
  "Ideal",
  "Potterton",
  "Intergas",
  "Viessmann",
  "Vokera",
  "Ferroli",
  "Ariston",
  "Keston",
  "Heatline",
  "Ravenheat",
  "Biasi",
  "Remeha",
  "Alpha",
  "Baxi",
  "Main",
];

const FAMILIES: { test: RegExp; keywords: string[]; why: string }[] = [
  {
    test: /f\.?\s*24|f\.?\s*23|rise too fast|spread too/i,
    keywords: ["pump", "circulator", "ntc", "thermistor", "temperature sensor"],
    why: "F.23/F.24 in the ecoTEC plus and Glow-worm notes is temperature spread or rise too fast: circulation, air, sensors inverted, strainer, pump, non-return valve. These catalogue lines are that family only. The code is not a verdict on one part.",
  },
  {
    test: /f\.?\s*75|e119|low pressure sensor/i,
    keywords: ["pressure sensor", "pump", "pressure switch"],
    why: "F.75 is a system of sensor, pump, air and actual pressure — the wording even changes between Vaillant, ecoFIT and Glow-worm manuals. Do not sell one part from the code.",
  },
  {
    test: /f\.?\s*28|f\.?\s*29|e133|\bl2\b|\bl02\b|\bea\b|ignition|no flame|locks out/i,
    keywords: ["electrode", "ignition", "ionisation", "condensate"],
    why: "Ignition lockout codes (F.28/F.29, E133, L2, EA and the equivalents) mean flame not proven. Condensate, gas supply, electrode, earth and the gas valve are all on the list. Gas valve and burner work is for the Gas Safe engineer; the code alone does not condemn a part.",
  },
  {
    test: /f\.?\s*32|fan fault|\bfan\b/i,
    keywords: ["fan"],
    why: "A fan code can be the fan, the harness, or no supply from the PCB. Ask whether voltage is arriving at the fan before ordering the fan.",
  },
  {
    test: /no hot water|hot water cold|dhw|shower goes cold|lukewarm/i,
    keywords: ["diverter", "flow sensor", "turbine", "plate", "cartridge"],
    why: "Hot water with heating still working splits three ways: no DHW demand (flow sensor/turbine), demand and it fires but the water is poor (plate or diverter travel), demand and it does not fire (diverter motor). Motor, cartridge and valve body are different orders.",
  },
  {
    test: /pressure goes up|expansion|prv|relief valve|discharg/i,
    keywords: ["expansion vessel", "pressure relief", "safety valve"],
    why: "Pressure high when hot and low when cold, with water at the outside pipe, points at the expansion vessel first. The PRV is often the victim. Replace it only once the cause of it lifting is known.",
  },
  {
    test: /blank display|dead boiler|\bpcb\b|fuse/i,
    keywords: ["fuse", "printed circuit board", "pcb"],
    why: "A blank display is power, then the board fuse, then external controls. The PCB is last.",
  },
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
  const patterns = [
    /\b([A-Z]\.\d{2}\.\d{2})\b/i,
    /\b([A-Z]\.\d{2})\b/i,
    /\b(E\d{2,3})\b/i,
    /\b(EA)\b/,
    /\b([LF]\d{1,2})\b/i,
  ];
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
  const patterns = [
    /eco\s?tec\s+plus\s+\d{3}/i,
    /logic(?:\s+combi)?\s+\d{2}/i,
    /duotec\s*2?(?:\s+combi)?(?:\s+(?:he|ga))?\s*\d{2}/i,
    /greenstar\s+\d+\s*i?\s+junior/i,
    /betacom\s+\d+\s*c/i,
    /hre\s+\d{2}\s*\/\s*\d{2}/i,
    /suprima\s+\d+/i,
    /cxi\s+\d+/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].replace(/\s+/g, " ");
  }
  return null;
}

function excerpt(chunks: Chunk[], needle: RegExp, limit = 3): string[] {
  const lines: string[] = [];
  for (const chunk of chunks) {
    for (const line of chunk.text.split("\n")) {
      const clean = line.replace(/\s+/g, " ").replace(/^\|/, "").trim();
      if (clean.length < 30 || clean.length > 360) continue;
      if (!needle.test(clean)) continue;
      lines.push(clean);
      if (lines.length >= limit) return lines;
    }
  }
  return lines;
}

function suggestParts(text: string, products: Product[]): ChatPart[] {
  const brand = detectBrand(text);
  const model = detectModel(text);
  const family = FAMILIES.find((item) => item.test.test(text));
  if (!family) return [];
  const brandToken = brand ? brand.toLowerCase().split(" ")[0] : "";
  const ranked = products
    .map((product) => {
      const hay = `${product.description} ${product.fits} ${product.brand}`.toLowerCase();
      if (brandToken && !hay.includes(brandToken)) return null;
      let score = 0;
      for (const keyword of family.keywords) {
        if (hay.includes(keyword)) score += 3;
      }
      if (!score) return null;
      if (brandToken) score += 4;
      if (model && hay.includes(model.toLowerCase())) score += 5;
      return { product, score };
    })
    .filter((item): item is { product: Product; score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score);
  const picked: ChatPart[] = [];
  const seen = new Set<string>();
  for (const item of ranked) {
    const key = item.product.description.toLowerCase().split(" ").slice(0, 3).join(" ");
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push({ ...item.product, why: family.why });
    if (picked.length >= 3) break;
  }
  return picked;
}

function buildMock(transcript: string, chunks: Chunk[], products: Product[]): ChatResponse {
  const brand = detectBrand(transcript);
  const model = detectModel(transcript);
  const code = detectFaultCode(transcript);
  const identity = [brand, model].filter(Boolean).join(" ");
  const codePattern = code ? new RegExp(code.replace(".", "\\.?"), "i") : /$a/;
  const codeLines = code ? excerpt(chunks, codePattern, 3) : [];
  const gcLines = excerpt(chunks, /GC Number|GC\s+\d{2}-\d{3}-\d{2}/i, 2);

  const steps: ChatStep[] = [
    {
      title: "Pin the appliance before any part",
      detail: identity
        ? `Working from what you have said: ${identity}${code ? `, code ${code}` : ""}. I still want a photo of the data badge — full model, kW, GC number (00-000-00), serial, and natural gas or LPG. The name on the front case is not enough, and a range covers more than one appliance.`
        : "I do not have a make and model yet. Start with a photo of the data badge: make, full model, kW, GC number, serial, and fuel. Then the fault code as it is displayed, letters and dots included.",
    },
  ];

  if (codeLines.length) {
    steps.push({
      title: code ? `What ${code} covers in our notes` : "What the notes say",
      detail: `${codeLines.join(" ")} A code lists causes, not a verdict. If the manual in front of you is a different generation, that manual wins — Baxi Combi 2, Worcester 4000 and older letter codes are not interchangeable.`,
    });
  } else if (code) {
    steps.push({
      title: `${code} is not in the notes we hold`,
      detail: `I will not invent a meaning for ${code}. Check the installation and servicing instructions for this exact model, or the DHS appliance page / PartsArena for that GC. Do not order from a generic code list.`,
    });
  } else {
    const symptom = excerpt(chunks, /no hot water|no heating|low pressure|ignition|condensate|diverter/i, 2);
    steps.push({
      title: "What the symptom points at",
      detail: symptom.length
        ? `${symptom.join(" ")} Tell me the code from the display as well — letters and dots matter.`
        : "Describe whether heating, hot water, or both have failed, and whether the boiler fires, clicks, or stays dark. A fault code from the display narrows this a lot.",
    });
  }

  if (gcLines.length && identity) {
    steps.push({
      title: "GC and build date",
      detail: `${gcLines[0]} The GC printed on the data badge is the one that counts. Write make, model, GC, serial and the part number on the order.`,
    });
  }

  steps.push({
    title: "Checks before a part is ordered",
    detail:
      "Customer-level checks are only the ones in the user guide: system pressure (often 1–1.5 bar cold, where that guide says so), a frozen condensate pipe outside in a cold snap, gas meter credit and supply on, room stat and timer calling, and one reset as the guide instructs. If it comes back, it is a Gas Safe job. Cheap causes first: pressure, air, condensate, controls, sludge. Do not jump to a PCB, and do not condemn a gas valve from the code.",
  });

  const parts = suggestParts(transcript, products);
  const sources = chunks.slice(0, 5).map((chunk) => ({ file: chunk.source, title: chunk.title }));
  const opening = identity
    ? `Right — ${identity}${code ? `, code ${code}` : ""}. I'll take it the way we would on the counter, one check at a time. I will not call a part faulty from the code alone.`
    : "Tell me the boiler and what it is doing, and I'll walk it one check at a time. I need the data badge before anything is ordered.";
  const missingCode =
    code && !codeLines.length
      ? `${code} is not in the notes we hold. Check the installation manual for this exact model, or the DHS appliance page for that GC. I will not invent a meaning or a part.`
      : "";
  const partLine = parts.length
    ? `Parts worth having ready once the engineer has proved the cause: ${parts
        .map((part) => `${part.brand} ${part.partNumber} (${part.description})`)
        .join("; ")}. Prices on these are placeholders until the Intact/Xline stock file is loaded.`
    : "I have not pinned a catalogue part yet. Identify the appliance, then we match a diagram position to a manufacturer number.";

  return {
    reply: [opening, missingCode, partLine, GAS_SAFE_NOTE].filter(Boolean).join("\n\n"),
    steps,
    parts,
    gasSafeNote: GAS_SAFE_NOTE,
    sources,
    mode: "mock",
  };
}

function systemPrompt(chunks: Chunk[], products: Product[]): string {
  const notes = chunks
    .map((chunk) => `SOURCE ${chunk.source} — ${chunk.title}\n${chunk.text.slice(0, 1200)}`)
    .join("\n\n");
  const catalogue = products
    .slice(0, 40)
    .map((product) => `${product.partNumber} | ${product.brand} | ${product.description} | fits: ${product.fits}`)
    .join("\n");
  return `You are the counter assistant at Wickford Plumbing Supplies, a UK trade plumbing merchant in Wickford, Essex. You help identify boiler spare parts the way an experienced spares counter would.

Rules:
- Use ONLY the knowledge-base excerpts and the catalogue below. If a code, resistance, or part number is not in them, say it is not in the notes and must be checked in that model's manual, DHS, or PartsArena.
- Never turn a fault code into a single replacement part. List the causes the notes give.
- Do not give a householder steps for gas, flue, combustion, or opening the sealed chamber. Customer checks are limited to the user guide: pressure, frozen external condensate, gas supply/credit, controls calling, one reset.
- Suggest part numbers only from the catalogue list. If none fit, return an empty partNumbers array.
- Mention cautions you can see in the notes: voltage, thread, bar rating, litres, litres/min, build date, genuine versus compatible, same-company versus cross-brand.
- Always include this sentence in the reply: ${GAS_SAFE_NOTE}

Respond with JSON only:
{"reply":"prose","steps":[{"title":"","detail":""}],"partNumbers":["123"],"citations":["file.md"]}

KNOWLEDGE BASE EXCERPTS:
${notes}

CATALOGUE (placeholder prices, not shown here):
${catalogue}`;
}

function parseModelJson(raw: string): {
  reply?: string;
  steps?: ChatStep[];
  partNumbers?: string[];
  citations?: string[];
} | null {
  const fenced = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(fenced.slice(start, end + 1)) as {
      reply?: string;
      steps?: ChatStep[];
      partNumbers?: string[];
    };
  } catch {
    return null;
  }
}

export async function answerQuestion(options: {
  messages: { role: "user" | "assistant"; content: string }[];
  index: KnowledgeIndex;
  products: Product[];
  provider: LlmProvider;
}): Promise<ChatResponse> {
  const transcript = options.messages.map((message) => `${message.role}: ${message.content}`).join("\n");
  const userText = [...options.messages].reverse().find((message) => message.role === "user")?.content || "";
  const focus = `${transcript}\n${userText}`;
  const primary = options.index.search(focus, 8);
  const code = detectFaultCode(focus);
  const model = detectModel(focus);
  const brand = detectBrand(focus);
  const extra = options.index.search([brand, model, code, "GC number"].filter(Boolean).join(" "), 6);
  const seen = new Set<string>();
  const chunks = [...primary, ...extra].filter((chunk) => {
    if (seen.has(chunk.id)) return false;
    seen.add(chunk.id);
    return true;
  });
  const mock = buildMock(focus, chunks, options.products);

  if (options.provider.id === "mock") return mock;

  try {
    const raw = await options.provider.complete(
      systemPrompt(chunks, options.products),
      options.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    );
    const parsed = parseModelJson(raw);
    if (!parsed?.reply) return { ...mock, mode: `${options.provider.id}-fallback-mock` };
    const wanted = new Set((parsed.partNumbers || []).map((value) => value.replace(/\s/g, "").toUpperCase()));
    const parts = mock.parts.filter((part) =>
      wanted.size ? wanted.has(part.partNumber.replace(/\s/g, "").toUpperCase()) : false,
    );
    const hydrated: ChatPart[] =
      parts.length > 0
        ? parts
        : (parsed.partNumbers || [])
            .map((partNumber) => options.products.find((product) => product.partNumber === partNumber.trim()))
            .filter((product): product is Product => Boolean(product))
            .map((product) => ({
              ...product,
              why: "Suggested from the notes for this fault. Confirm the diagram position and GC before ordering.",
            }));
    let reply = parsed.reply.trim();
    if (!reply.includes("Gas Safe")) reply = `${reply}\n\n${GAS_SAFE_NOTE}`;
    const steps = Array.isArray(parsed.steps) && parsed.steps.length ? parsed.steps : mock.steps;
    return {
      reply,
      steps: steps.map((step) => ({
        title: String(step.title || "Check"),
        detail: String(step.detail || ""),
      })),
      parts: hydrated.slice(0, 4),
      gasSafeNote: GAS_SAFE_NOTE,
      sources: chunks.slice(0, 5).map((chunk) => ({ file: chunk.source, title: chunk.title })),
      mode: options.provider.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "LLM call failed";
    return {
      ...mock,
      mode: `${options.provider.id}-fallback-mock`,
      reply: `${mock.reply}\n\n(The live model could not be reached: ${message}. This answer is from the offline notes.)`,
    };
  }
}
