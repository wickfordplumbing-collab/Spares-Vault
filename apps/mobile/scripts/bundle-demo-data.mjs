import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const kbDir = path.join(repo, "knowledge-base");
const files = {};
for (const name of readdirSync(kbDir)) {
  const full = path.join(kbDir, name);
  if (!statSync(full).isFile()) continue;
  if (!/\.(md|csv|json)$/i.test(name)) continue;
  files[name] = readFileSync(full, "utf8");
}
const catalogueCsv = readFileSync(path.join(repo, "data", "catalogue.sample.csv"), "utf8");
const out = path.join(here, "../src/demo/data.json");
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ files, catalogueCsv }));
console.log(`Wrote ${out} (${Object.keys(files).length} knowledge-base files)`);
