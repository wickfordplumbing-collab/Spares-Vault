import fs from "node:fs";
import path from "node:path";
import { csvRecords } from "./csv.js";

export type Chunk = {
  id: string;
  source: string;
  title: string;
  text: string;
};

const STOP = new Set([
  "the", "a", "an", "of", "and", "or", "to", "for", "on", "in", "it", "is", "with",
  "my", "our", "please", "what", "how", "does", "do", "i", "we", "me", "that", "this",
  "from", "by", "as", "be", "at", "are", "was", "if", "not", "but", "they", "you",
]);

export function tokensOf(text: string): string[] {
  const lower = text.toLowerCase();
  const parts = lower.split(/[^a-z0-9.]+/).filter((token) => token.length > 1 && !STOP.has(token));
  const extra = parts.map((token) => token.replace(/\./g, "")).filter((token) => token.length > 1 && !STOP.has(token));
  return [...parts, ...extra];
}

function chunkMarkdown(source: string, text: string): Chunk[] {
  const lines = text.split(/\r?\n/);
  const chunks: Chunk[] = [];
  let heading = source;
  let buffer: string[] = [];
  let index = 0;
  const flush = () => {
    const body = buffer.join("\n").trim();
    buffer = [];
    if (body.length < 40) return;
    const windows: string[] = [];
    if (body.length <= 1800) windows.push(body);
    else {
      for (let start = 0; start < body.length; start += 1400) {
        windows.push(body.slice(start, start + 1800));
      }
    }
    for (const window of windows) {
      chunks.push({
        id: `${source}#${index++}`,
        source,
        title: heading,
        text: window,
      });
    }
  };
  for (const line of lines) {
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      flush();
      heading = headingMatch[2].trim();
      buffer.push(line);
    } else {
      buffer.push(line);
    }
  }
  flush();
  return chunks;
}

function chunkCsv(source: string, text: string): Chunk[] {
  return csvRecords(text).map((row, index) => {
    const title =
      row["Common part (plain description)"] ||
      row["Family"] ||
      `${source} row ${index + 1}`;
    const body = Object.entries(row)
      .filter(([, value]) => value && value.trim())
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    return { id: `${source}#${index}`, source, title, text: body };
  });
}

export function loadKnowledgeBase(dir: string): Chunk[] {
  if (!fs.existsSync(dir)) return [];
  const chunks: Chunk[] = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!fs.statSync(full).isFile()) continue;
    if (name.endsWith(".md")) {
      chunks.push(...chunkMarkdown(name, fs.readFileSync(full, "utf8")));
    } else if (name.endsWith(".csv")) {
      chunks.push(...chunkCsv(name, fs.readFileSync(full, "utf8")));
    } else if (name.endsWith(".json")) {
      chunks.push({
        id: name,
        source: name,
        title: name,
        text: fs.readFileSync(full, "utf8").slice(0, 8000),
      });
    }
  }
  return chunks;
}

type Posting = { id: number; tf: number };

export class KnowledgeIndex {
  chunks: Chunk[];
  private docs: string[][];
  private df = new Map<string, number>();
  private postings = new Map<string, Posting[]>();
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
    const qTokens = [...new Set(tokensOf(query))];
    const scores = new Map<number, number>();
    const k1 = 1.2;
    const b = 0.75;
    const n = this.docs.length || 1;
    for (const token of qTokens) {
      const df = this.df.get(token) || 0;
      if (!df) continue;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      for (const posting of this.postings.get(token) || []) {
        const len = this.docs[posting.id].length || 1;
        const denom = posting.tf + k1 * (1 - b + b * (len / (this.avg || 1)));
        const add = idf * ((posting.tf * (k1 + 1)) / denom);
        scores.set(posting.id, (scores.get(posting.id) || 0) + add);
      }
    }
    const code = query.match(/\b[a-z]\.\d{2}(?:\.\d{2})?\b/i);
    if (code) {
      const needle = code[0].toLowerCase();
      this.chunks.forEach((chunk, id) => {
        if (chunk.text.toLowerCase().includes(needle)) {
          scores.set(id, (scores.get(id) || 0) + 2.4);
        }
      });
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => this.chunks[id]);
  }
}

export function warningsForPart(partNumber: string, chunks: Chunk[]): string[] {
  const needle = partNumber.toLowerCase();
  const warnings: string[] = [];
  for (const chunk of chunks) {
    if (!chunk.text.toLowerCase().includes(needle)) continue;
    const sentences = chunk.text.split(/(?<=[.!?])\s+|\n+/);
    for (const sentence of sentences) {
      const line = sentence.replace(/\s+/g, " ").trim();
      if (line.length < 40 || line.length > 420) continue;
      if (!line.toLowerCase().includes(needle)) continue;
      if (/collision|different part|do not|must not|not this|24v|3\.5 bar|voltage|confirm|conflict/i.test(line)) {
        warnings.push(`${line} (${chunk.source})`);
      }
      if (warnings.length >= 3) return warnings;
    }
  }
  return warnings;
}
