import { demoRequest } from "../src/demo/engine";

const GAS_SAFE = "Gas Safe registered engineer";
let failed = 0;

function check(condition: boolean, label: string) {
  if (condition) {
    console.log(`ok  ${label}`);
    return;
  }
  failed++;
  console.error(`FAIL ${label}`);
}

async function request(path: string, init?: { method?: string; body?: string; token?: string }) {
  try {
    const body = await demoRequest<Record<string, unknown>>(path, init);
    return { status: 200, body };
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error ? Number((error as { status: number }).status) : 500;
    return { status, body: { error: error instanceof Error ? error.message : String(error) } };
  }
}

async function main() {
const health = await request("/api/health");
check(health.status === 200 && health.body.assistantMode === "mock" && health.body.demo === true, "health is the in-browser demo");
check(health.body.catalogueMode === "sample" && Number(health.body.productCount) > 0, "sample catalogue is bundled");

const part = await request("/api/search?q=175591");
const partResults = part.body.results as { partNumber: string }[];
check(part.status === 200 && partResults[0]?.partNumber === "175591", "search by part number");

const gc = await request("/api/search?q=" + encodeURIComponent("47-044-32"));
const gcNumbers = (gc.body.results as { partNumber: string }[]).map((item) => item.partNumber);
check(gcNumbers.includes("178985") && gcNumbers.includes("0020059717") && gcNumbers.includes("193592"), "search by GC number");

const model = await request("/api/search?q=" + encodeURIComponent("Vaillant ecoTEC plus 831"));
const modelNumbers = (model.body.results as { partNumber: string }[]).map((item) => item.partNumber);
check(modelNumbers.includes("193592") && modelNumbers.includes("090709"), "search by boiler model");

const blue = await request("/api/search?q=" + encodeURIComponent("the blue valve under the boiler"));
const blueResults = blue.body.results as { partNumber: string; description: string }[];
check(blueResults[0]?.partNumber === "2000802600", "description search finds the filling loop first");
check(
  blueResults.slice(0, 5).some((item) => /relief|prv|178985|safety valve/i.test(`${item.partNumber} ${item.description}`)),
  "description search also surfaces the relief valve",
);

const motor = await request("/api/product?partNumber=7216534");
const alternatives = motor.body.alternatives as { cautions: string; confidence: string; sameCompany: boolean }[];
check(
  alternatives.some((row) => /24V/i.test(row.cautions) && /verified/i.test(row.confidence)),
  "diverter motor alternatives include 24V caution and confidence",
);

const prv = await request("/api/product?partNumber=178985");
const warnings = prv.body.warnings as string[];
const fits = (prv.body.product as { fits: string }).fits;
check(/collision|Ideal/i.test(`${warnings.join(" ")} ${fits}`), "178985 collision warning");

const chat = await request("/api/chat", {
  method: "POST",
  body: JSON.stringify({ messages: [{ role: "user", content: "Vaillant ecoTEC plus 831 F.24" }] }),
});
const reply = String(chat.body.reply || "");
const steps = chat.body.steps as { title: string }[];
const parts = chat.body.parts as { partNumber: string }[];
const sources = chat.body.sources as { file: string }[];
check(chat.status === 200 && chat.body.mode === "mock", "chat mock mode");
check(reply.includes(GAS_SAFE), "chat includes the Gas Safe note");
check(/F\.24/.test(reply) && steps.length >= 3, "chat walks F.24 in steps");
check(parts.some((item) => item.partNumber === "193592" || item.partNumber === "160928"), "chat suggests a catalogue part for F.24");
check(sources.some((source) => /model-fault|fault-diagnosis|dhs-lookup/.test(source.file)), "chat cites the knowledge base");

const unknown = await request("/api/chat", {
  method: "POST",
  body: JSON.stringify({ messages: [{ role: "user", content: "Keston Combi showing F.99" }] }),
});
check(/manual|not in the notes/i.test(String(unknown.body.reply)), "unknown code is not invented");

const checkout = await request("/api/checkout", {
  method: "POST",
  body: JSON.stringify({
    customer: { name: "Pat Engineer", email: "pat@example.com", phone: "07700900123" },
    address: { line1: "12 Runwell Road", line2: "", city: "Wickford", postcode: "SS12 9AB" },
    notes: "Vaillant ecoTEC plus 831 GC 47-044-32 serial on the badge",
    items: [{ partNumber: "193592", qty: 1 }],
  }),
});
check(checkout.status === 200 && checkout.body.paymentMode === "simulated-test" && checkout.body.checkoutUrl === null, "checkout stays in the browser");
const orderId = String(checkout.body.orderId);

const badCard = await request(`/api/orders/${orderId}/confirm-test`, {
  method: "POST",
  body: JSON.stringify({ cardNumber: "4000000000000002" }),
});
check(badCard.status === 402, "rejects a non-test card");

const paid = await request(`/api/orders/${orderId}/confirm-test`, {
  method: "POST",
  body: JSON.stringify({ cardNumber: "4242 4242 4242 4242" }),
});
const order = paid.body.order as {
  status: string;
  supplierEmailBody: string;
  wickfordEmailBody: string;
  emailDelivery: string;
};
check(paid.status === 200 && order.status === "sent_to_supplier", "order marked sent to supplier");
check(order.emailDelivery === "browser", "email is simulated in the browser");
check(
  /12 Runwell Road/.test(order.supplierEmailBody) &&
    /SS12 9AB/.test(order.supplierEmailBody) &&
    /193592/.test(order.supplierEmailBody) &&
    /DHS/.test(order.supplierEmailBody) &&
    /Gas Safe/.test(order.supplierEmailBody) &&
    /Nothing was sent/.test(order.supplierEmailBody) &&
    !/£/.test(order.supplierEmailBody),
  "supplier email has address, part, DHS, Gas Safe, and no price",
);
check(/placeholder/i.test(order.wickfordEmailBody) && /£/.test(order.wickfordEmailBody), "Wickford copy has the placeholder total");

const hidden = await request(`/api/orders/${orderId}`);
check(hidden.status === 404, "order lookup needs the customer email");
const shown = await request(`/api/orders/${orderId}?email=pat@example.com`);
check(shown.status === 200, "customer can read their order");

const noToken = await request("/api/admin/orders");
check(noToken.status === 401, "admin requires the demo token");
const admin = await request("/api/admin/orders", { token: "change-me" });
const orders = admin.body.orders as { id: string }[];
check(admin.status === 200 && orders.some((item) => item.id === orderId), "admin lists the order");

const imported = await request("/api/admin/catalogue/import", {
  method: "POST",
  token: "change-me",
  body: JSON.stringify({
    csv: "part_number,description,brand,price,stock,fits,price_note\nDEMO-1,Demo washer,Ideal,1.00,3,Ideal Logic,trade\n",
    replace: false,
  }),
});
check(imported.status === 200 && Number(imported.body.inserted) === 1, "CSV import upserts in the browser");
const found = await request("/api/search?q=DEMO-1");
const foundResults = found.body.results as { partNumber: string }[];
check(foundResults[0]?.partNumber === "DEMO-1", "imported part is searchable");

if (failed) {
  console.error(`${failed} demo check(s) failed`);
  process.exit(1);
}
console.log("in-browser demo checks passed");
}

main();
