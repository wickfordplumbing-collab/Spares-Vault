import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(here, "../../..");
export const knowledgeBaseDir = path.join(repoRoot, "knowledge-base");
export const sampleCataloguePath = path.join(repoRoot, "data", "catalogue.sample.csv");

export function loadEnvFiles() {
  for (const file of [path.join(repoRoot, ".env"), path.join(repoRoot, "apps/api/.env")]) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

export type AppConfig = {
  port: number;
  publicBaseUrl: string;
  dataDir: string;
  dbPath: string;
  outboxDir: string;
  adminToken: string;
  llmProvider: "mock" | "openai" | "anthropic";
  openaiApiKey: string;
  openaiModel: string;
  anthropicApiKey: string;
  anthropicModel: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  supplierAdapter: "email" | "api-edi";
  supplierName: string;
  supplierOrderEmail: string;
  wickfordOrdersEmail: string;
  orderFromEmail: string;
  orderFromName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
};

export function readConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const dataDir = path.resolve(repoRoot, env.DATA_DIR || "data");
  const requested = (env.LLM_PROVIDER || "").toLowerCase();
  let llmProvider: AppConfig["llmProvider"] = "mock";
  if (requested === "openai" || requested === "anthropic" || requested === "mock") {
    llmProvider = requested;
  } else if (env.OPENAI_API_KEY) {
    llmProvider = "openai";
  } else if (env.ANTHROPIC_API_KEY) {
    llmProvider = "anthropic";
  }
  if (llmProvider === "openai" && !env.OPENAI_API_KEY) llmProvider = "mock";
  if (llmProvider === "anthropic" && !env.ANTHROPIC_API_KEY) llmProvider = "mock";

  const supplierAdapter = env.SUPPLIER_ADAPTER === "api-edi" ? "api-edi" : "email";

  return {
    port: Number(env.PORT || 8787),
    publicBaseUrl: (env.PUBLIC_BASE_URL || `http://localhost:${env.PORT || 8787}`).replace(/\/$/, ""),
    dataDir,
    dbPath: env.DB_PATH || path.join(dataDir, "wickford.sqlite"),
    outboxDir: env.OUTBOX_DIR || path.join(dataDir, "outbox"),
    adminToken: env.ADMIN_TOKEN || "",
    llmProvider,
    openaiApiKey: env.OPENAI_API_KEY || "",
    openaiModel: env.OPENAI_MODEL || "gpt-4o-mini",
    anthropicApiKey: env.ANTHROPIC_API_KEY || "",
    anthropicModel: env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
    stripeSecretKey: env.STRIPE_SECRET_KEY || "",
    stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET || "",
    supplierAdapter,
    supplierName: env.SUPPLIER_NAME || "DHS (Direct Heating Spares)",
    supplierOrderEmail: env.SUPPLIER_ORDER_EMAIL || "orders@dhsspares.example",
    wickfordOrdersEmail: env.WICKFORD_ORDERS_EMAIL || "orders@wickfordplumbing.example",
    orderFromEmail: env.ORDER_FROM_EMAIL || "orders@wickfordplumbing.example",
    orderFromName: env.ORDER_FROM_NAME || "Wickford Plumbing Supplies",
    smtpHost: env.SMTP_HOST || "",
    smtpPort: Number(env.SMTP_PORT || 587),
    smtpUser: env.SMTP_USER || "",
    smtpPass: env.SMTP_PASS || "",
    smtpSecure: env.SMTP_SECURE === "true",
  };
}

export const GAS_SAFE_NOTE =
  "Gas work must be done by a Gas Safe registered engineer. This is parts guidance for identifying spares, not instructions to open a boiler or work on gas, flue, or combustion parts.";
