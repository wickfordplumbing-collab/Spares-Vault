import fs from "node:fs";
import { importCatalogueCsv } from "./catalogue.js";
import { loadEnvFiles, readConfig } from "./config.js";
import { openDatabase } from "./db.js";

loadEnvFiles();
const config = readConfig();
const args = process.argv.slice(2);
const replace = args.includes("--replace");
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("Usage: npm run import-catalogue -- --replace ./stock.csv");
  console.error("Columns: part_number, description, brand, price, stock, fits");
  console.error("Optional column: price_note. Use PLACEHOLDER while prices are not live.");
  process.exit(1);
}
const csv = fs.readFileSync(file, "utf8");
const db = openDatabase(config.dbPath);
const result = importCatalogueCsv(db, csv, replace);
console.log(JSON.stringify(result, null, 2));
if (result.errors.length && result.inserted + result.updated === 0) process.exit(1);
