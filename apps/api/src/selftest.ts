import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Server } from "node:http";
import { createApp } from "./app.js";
import { seedSampleCatalogue } from "./catalogue.js";
import { GAS_SAFE_NOTE, knowledgeBaseDir, readConfig, sampleCataloguePath } from "./config.js";
import { openDatabase } from "./db.js";
import { KnowledgeIndex, loadKnowledgeBase } from "./kb.js";
import { createProvider } from "./llm.js";
import { ApiEdiOrderAdapter } from "./suppliers.js";
import { assertStripeTestKey } from "./stripe.js";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wickford-"));
process.env.ADMIN_TOKEN = "test-admin-token";
process.env.LLM_PROVIDER = "mock";
process.env.STRIPE_SECRET_KEY = "";
process.env.SMTP_HOST = "";
process.env.SUPPLIER_ADAPTER = "email";
process.env.SUPPLIER_ORDER_EMAIL = "orders@dhsspares.example";
process.env.WICKFORD_ORDERS_EMAIL = "orders@wickfordplumbing.example";
process.env.DATA_DIR = tmp;
process.env.DB_PATH = path.join(tmp, "test.sqlite");
process.env.OUTBOX_DIR = path.join(tmp, "outbox");
process.env.PUBLIC_BASE_URL = "http://127.0.0.1:0";

const failures: string[] = [];
function check(condition: unknown, message: string) {
  if (!condition) {
    failures.push(message);
    console.error("FAIL", message);
  } else {
    console.log("ok", message);
  }
}

const config = readConfig();
const db = openDatabase(config.dbPath);
seedSampleCatalogue(db, sampleCataloguePath);
const chunks = loadKnowledgeBase(knowledgeBaseDir);
const index = new KnowledgeIndex(chunks);
check(chunks.length > 40, `knowledge base indexed (${chunks.length} chunks)`);
const provider = createProvider(config);
check(provider.id === "mock", "mock assistant when no key is set");
const app = createApp({ db, config, index, provider });

const server: Server = await new Promise((resolve) => {
  const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
});
const address = server.address();
if (!address || typeof address === "string") throw new Error("no port");
const base = `http://127.0.0.1:${address.port}`;

async function api(pathname: string, init?: RequestInit) {
  const response = await fetch(`${base}${pathname}`, init);
  const text = await response.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = text;
  }
  return { status: response.status, body: body as Record<string, unknown> };
}

const health = await api("/api/health");
check(health.status === 200 && health.body.assistantMode === "mock", "health");

const part = await api("/api/search?q=175591");
const partResults = part.body.results as { partNumber: string }[];
check(part.status === 200 && partResults[0]?.partNumber === "175591", "search by part number");

const gc = await api("/api/search?q=" + encodeURIComponent("47-044-32"));
const gcNumbers = (gc.body.results as { partNumber: string }[]).map((item) => item.partNumber);
check(
  gcNumbers.includes("178985") && gcNumbers.includes("0020059717") && gcNumbers.includes("193592"),
  "search by GC number",
);

const model = await api("/api/search?q=" + encodeURIComponent("Vaillant ecoTEC plus 831"));
const modelNumbers = (model.body.results as { partNumber: string }[]).map((item) => item.partNumber);
check(modelNumbers.includes("193592") && modelNumbers.includes("090709"), "search by boiler model");

const blue = await api("/api/search?q=" + encodeURIComponent("the blue valve under the boiler"));
const blueResults = blue.body.results as { partNumber: string; description: string }[];
check(blueResults[0]?.partNumber === "2000802600", "description search finds the filling loop first");
check(
  blueResults.slice(0, 5).some((item) => /relief|prv|178985|safety valve/i.test(`${item.partNumber} ${item.description}`)),
  "description search also surfaces the relief valve",
);

const motor = await api("/api/product?partNumber=7216534");
const alternatives = motor.body.alternatives as { cautions: string; confidence: string; sameCompany: boolean }[];
check(
  alternatives.some((row) => /24V/i.test(row.cautions) && /verified/i.test(row.confidence)),
  "diverter motor alternatives include 24V caution and confidence",
);

const prv = await api("/api/product?partNumber=178985");
const warnings = prv.body.warnings as string[];
const fits = (prv.body.product as { fits: string }).fits;
check(/collision|Ideal/i.test(`${warnings.join(" ")} ${fits}`), "178985 collision warning");

const chat = await api("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", content: "Vaillant ecoTEC plus 831 F.24" }] }),
});
const reply = String(chat.body.reply || "");
const steps = chat.body.steps as { title: string; detail: string }[];
const parts = chat.body.parts as { partNumber: string }[];
const sources = chat.body.sources as { file: string }[];
check(chat.status === 200 && chat.body.mode === "mock", "chat mock mode");
check(reply.includes("Gas Safe") && chat.body.gasSafeNote === GAS_SAFE_NOTE, "chat includes the Gas Safe note");
check(/F\.24/.test(reply) && steps.length >= 3, "chat walks F.24 in steps");
check(
  parts.some((item) => item.partNumber === "193592" || item.partNumber === "160928"),
  "chat suggests a catalogue part for F.24",
);
check(
  sources.some((source) => /model-fault|fault-diagnosis|dhs-lookup/.test(source.file)),
  "chat cites the knowledge base",
);

const unknown = await api("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", content: "Keston Combi showing F.99" }] }),
});
check(/manual|not in the notes/i.test(String(unknown.body.reply)), "unknown code is not invented");

const checkout = await api("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customer: { name: "Pat Engineer", email: "pat@example.com", phone: "07700900123" },
    address: { line1: "12 Runwell Road", line2: "", city: "Wickford", postcode: "SS12 9AB" },
    notes: "Vaillant ecoTEC plus 831 GC 47-044-32 serial on the badge",
    items: [{ partNumber: "193592", qty: 1 }],
  }),
});
check(checkout.status === 200 && checkout.body.paymentMode === "simulated-test", "checkout without Stripe key");
const orderId = String(checkout.body.orderId);

const badCard = await api(`/api/orders/${orderId}/confirm-test`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ cardNumber: "4000000000000002" }),
});
check(badCard.status === 402, "rejects a non-test card in simulated checkout");

const paid = await api(`/api/orders/${orderId}/confirm-test`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ cardNumber: "4242 4242 4242 4242" }),
});
const order = paid.body.order as {
  status: string;
  supplierEmailBody: string;
  wickfordEmailBody: string;
  emailDelivery: string;
};
check(paid.status === 200 && order.status === "sent_to_supplier", "order marked sent to supplier");
check(order.emailDelivery === "outbox", "email generated to the outbox");
check(
  /12 Runwell Road/.test(order.supplierEmailBody) &&
    /SS12 9AB/.test(order.supplierEmailBody) &&
    /193592/.test(order.supplierEmailBody) &&
    /DHS/.test(order.supplierEmailBody) &&
    /Gas Safe/.test(order.supplierEmailBody) &&
    !/£/.test(order.supplierEmailBody),
  "supplier email has address, part, DHS, Gas Safe, and no price",
);
check(/placeholder/i.test(order.wickfordEmailBody) && /£/.test(order.wickfordEmailBody), "Wickford copy has the placeholder total");
check(fs.existsSync(path.join(config.outboxDir, `${orderId}-supplier.txt`)), "outbox file written");

const hidden = await api(`/api/orders/${orderId}`);
check(hidden.status === 404, "order lookup needs the customer email");
const shown = await api(`/api/orders/${orderId}?email=pat@example.com`);
check(shown.status === 200, "customer can read their order");

const noToken = await api("/api/admin/orders");
check(noToken.status === 401, "admin requires a token");
const admin = await api("/api/admin/orders", { headers: { Authorization: "Bearer test-admin-token" } });
const orders = admin.body.orders as { id: string }[];
check(admin.status === 200 && orders.some((item) => item.id === orderId), "admin lists the order");

const imported = await api("/api/admin/catalogue/import", {
  method: "POST",
  headers: { Authorization: "Bearer test-admin-token", "Content-Type": "application/json" },
  body: JSON.stringify({
    csv: "part_number,description,brand,price,stock,fits\nTEST-1,Sample imported pump,TestBrand,12.00,1,Nowhere\n",
    replace: false,
  }),
});
check(imported.status === 200 && (imported.body.inserted as number) >= 1, "CSV import");
const foundImport = await api("/api/search?q=TEST-1");
check((foundImport.body.results as { partNumber: string }[])[0]?.partNumber === "TEST-1", "imported part is searchable");

const stub = await new ApiEdiOrderAdapter().submit({
  order: order as never,
  supplierEmail: { to: "a", subject: "s", body: "b" },
  wickfordEmail: { to: "a", subject: "s", body: "b" },
});
check(stub.ok === false && stub.delivery === "unsupported", "API/EDI adapter is a stub");

let liveRefused = false;
try {
  assertStripeTestKey("sk_live_secret");
} catch {
  liveRefused = true;
}
check(liveRefused, "live Stripe keys are refused");

server.close();
if (failures.length) {
  console.error(`\n${failures.length} failed`);
  process.exit(1);
}
console.log("\nAll API checks passed");
