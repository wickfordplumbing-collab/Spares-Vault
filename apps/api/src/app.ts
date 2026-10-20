import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import path from "node:path";
import { alternativesFor, catalogueMode, getAlternativeRows, importCatalogueCsv, searchProducts } from "./catalogue.js";
import { answerQuestion } from "./chat.js";
import type { AppConfig } from "./config.js";
import { GAS_SAFE_NOTE, knowledgeBaseDir } from "./config.js";
import { findProductLoose, getOrder, insertOrder, listOrders, listProducts, nextOrderId, type Db } from "./db.js";
import { warningsForPart, type KnowledgeIndex } from "./kb.js";
import type { LlmProvider } from "./llm.js";
import { fulfillOrder } from "./orders.js";
import { assertStripeTestKey, constructStripeEvent, createStripeCheckout, retrievePaidOrderId } from "./stripe.js";
import type { CheckoutInput } from "./types.js";

const TEST_CARD = "4242424242424242";

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

function postcodeOk(value: string): boolean {
  return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(value.trim());
}

export function createApp(options: {
  db: Db;
  config: AppConfig;
  index: KnowledgeIndex;
  provider: LlmProvider;
}) {
  const { db, config, index, provider } = options;
  const app = express();
  app.use(cors());

  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    asyncHandler(async (req, res) => {
      if (!config.stripeSecretKey || !config.stripeWebhookSecret) {
        res.status(400).json({ error: "Stripe webhook is not configured" });
        return;
      }
      const signature = req.header("stripe-signature") || "";
      const event = constructStripeEvent(
        config.stripeSecretKey,
        config.stripeWebhookSecret,
        req.body as Buffer,
        signature,
      );
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as { id?: string; metadata?: { orderId?: string }; payment_status?: string };
        const orderId = session.metadata?.orderId;
        if (orderId && session.payment_status === "paid") {
          await fulfillOrder(db, config, orderId, session.id || null);
        }
      }
      res.json({ received: true });
    }),
  );

  app.use(express.json({ limit: "8mb" }));

  app.get("/api/health", (_req, res) => {
    const products = listProducts(db);
    res.json({
      ok: true,
      service: "wickford-plumbing-supplies",
      assistantMode: provider.id,
      payments: config.stripeSecretKey ? "stripe-test" : "simulated-test",
      supplierAdapter: config.supplierAdapter,
      supplierName: config.supplierName,
      catalogueMode: catalogueMode(db),
      productCount: products.length,
      gasSafeNote: GAS_SAFE_NOTE,
    });
  });

  app.get("/api/search", (req, res) => {
    const q = String(req.query.q || "");
    const results = searchProducts(listProducts(db), q);
    res.json({ query: q, results });
  });

  app.get("/api/product", (req, res) => {
    const partNumber = String(req.query.partNumber || "");
    const product = findProductLoose(db, partNumber);
    if (!product) {
      res.status(404).json({ error: "Part not found in the catalogue" });
      return;
    }
    const csvPath = path.join(knowledgeBaseDir, "cross-brand-equivalents.csv");
    const alternatives = alternativesFor(product.partNumber, getAlternativeRows(csvPath), listProducts(db));
    const warnings = warningsForPart(product.partNumber, index.chunks);
    res.json({ product, alternatives, warnings, gasSafeNote: GAS_SAFE_NOTE });
  });

  app.post(
    "/api/chat",
    asyncHandler(async (req, res) => {
      const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
      const cleaned = messages
        .filter((message: { role?: string; content?: string }) => message && typeof message.content === "string")
        .map((message: { role?: string; content: string }) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content.slice(0, 4000),
        }))
        .slice(-12);
      if (!cleaned.length) {
        res.status(400).json({ error: "Send a message describing the boiler and the fault" });
        return;
      }
      const answer = await answerQuestion({
        messages: cleaned,
        index,
        products: listProducts(db),
        provider,
      });
      res.json(answer);
    }),
  );

  app.post(
    "/api/checkout",
    asyncHandler(async (req, res) => {
      const body = req.body as CheckoutInput;
      const name = body.customer?.name?.trim() || "";
      const email = body.customer?.email?.trim() || "";
      const phone = body.customer?.phone?.trim() || "";
      const line1 = body.address?.line1?.trim() || "";
      const city = body.address?.city?.trim() || "";
      const postcode = body.address?.postcode?.trim() || "";
      if (!name || !email.includes("@") || phone.length < 6 || !line1 || !city || !postcodeOk(postcode)) {
        res.status(400).json({
          error: "Name, email, phone, address line, city, and a UK postcode are required",
        });
        return;
      }
      if (!Array.isArray(body.items) || !body.items.length) {
        res.status(400).json({ error: "The basket is empty" });
        return;
      }
      const items = body.items.map((item) => {
        const product = findProductLoose(db, String(item.partNumber || ""));
        const qty = Number(item.qty);
        if (!product) throw new Error(`Unknown part ${item.partNumber}`);
        if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error("Quantity must be 1–99");
        return {
          partNumber: product.partNumber,
          brand: product.brand,
          description: product.description,
          qty,
          pricePence: product.pricePence,
          priceNote: product.priceNote,
          fits: product.fits,
        };
      });
      const subtotalPence = items.reduce((sum, item) => sum + item.pricePence * item.qty, 0);
      const id = nextOrderId(db);
      const useStripe = Boolean(config.stripeSecretKey);
      if (useStripe) assertStripeTestKey(config.stripeSecretKey);
      insertOrder(db, {
        id,
        createdAt: new Date().toISOString(),
        status: "pending_payment",
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        addressLine1: line1,
        addressLine2: body.address?.line2?.trim() || "",
        city,
        postcode: postcode.toUpperCase(),
        country: body.address?.country?.trim() || "United Kingdom",
        notes: body.notes?.trim() || "",
        items,
        subtotalPence,
        currency: "gbp",
        paymentMode: useStripe ? "stripe-test" : "simulated-test",
        supplierAdapter: config.supplierAdapter,
      });

      if (useStripe) {
        const session = await createStripeCheckout({
          secretKey: config.stripeSecretKey,
          orderId: id,
          customerEmail: email,
          items: items.map((item) => ({
            name: `${item.brand} ${item.partNumber} ${item.description}`,
            qty: item.qty,
            pricePence: item.pricePence,
          })),
          successUrl: `${config.publicBaseUrl}/payments/return?orderId=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${config.publicBaseUrl}/payments/cancel?orderId=${encodeURIComponent(id)}`,
        });
        res.json({
          orderId: id,
          subtotalPence,
          paymentMode: "stripe-test",
          checkoutUrl: session.url,
          publishableHint: "Complete payment on the Stripe test checkout page. Card 4242 4242 4242 4242.",
        });
        return;
      }

      res.json({
        orderId: id,
        subtotalPence,
        paymentMode: "simulated-test",
        checkoutUrl: null,
        publishableHint:
          "STRIPE_SECRET_KEY is not set. Pay with Stripe test card 4242 4242 4242 4242 in the app. No card data is sent to Stripe.",
      });
    }),
  );

  app.post(
    "/api/orders/:id/confirm-test",
    asyncHandler(async (req, res) => {
      const order = getOrder(db, req.params.id);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      if (order.paymentMode !== "simulated-test") {
        res.status(409).json({ error: "This order is using Stripe Checkout, not the simulated test payment" });
        return;
      }
      const digits = String(req.body?.cardNumber || "").replace(/\D/g, "");
      if (digits !== TEST_CARD) {
        res.status(402).json({
          error: "Use the Stripe test card 4242 4242 4242 4242. Any future expiry and any CVC are accepted here. The card number is not stored.",
        });
        return;
      }
      const saved = await fulfillOrder(db, config, order.id, null);
      res.json({ order: saved });
    }),
  );

  app.get("/api/orders/:id", (req, res) => {
    const order = getOrder(db, req.params.id);
    const email = String(req.query.email || "");
    if (!order || email.toLowerCase() !== order.customerEmail.toLowerCase()) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ order });
  });

  app.get("/payments/return", asyncHandler(async (req, res) => {
    const orderId = String(req.query.orderId || "");
    const sessionId = String(req.query.session_id || "");
    let message = "Return to the Wickford app to see the order.";
    if (sessionId && config.stripeSecretKey) {
      const paidOrderId = await retrievePaidOrderId(config.stripeSecretKey, sessionId);
      if (paidOrderId && paidOrderId === orderId) {
        await fulfillOrder(db, config, orderId, sessionId);
        message = `Payment received for ${orderId}. The drop-ship email has been generated. You can close this page and return to the app.`;
      } else {
        message = "Stripe has not marked this payment as paid yet. Wait a moment and refresh.";
      }
    }
    res.type("html").send(paymentPage("Payment", message));
  }));

  app.get("/payments/cancel", (req, res) => {
    const orderId = String(req.query.orderId || "");
    res.type("html").send(paymentPage("Payment cancelled", `Order ${orderId} is still unpaid. You can close this page.`));
  });

  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const header = req.header("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!config.adminToken || token !== config.adminToken) {
      res.status(401).json({ error: "Staff token required" });
      return;
    }
    next();
  }

  app.get("/api/admin/orders", requireAdmin, (_req, res) => {
    res.json({ orders: listOrders(db) });
  });

  app.get("/api/admin/orders/:id", requireAdmin, (req, res) => {
    const order = getOrder(db, req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ order });
  });

  app.post(
    "/api/admin/orders/:id/resend",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const order = getOrder(db, req.params.id);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      if (order.status === "pending_payment") {
        res.status(409).json({ error: "Order is not paid" });
        return;
      }
      db.prepare("UPDATE orders SET supplier_email_body = NULL, status = 'paid' WHERE id = ?").run(order.id);
      const saved = await fulfillOrder(db, config, order.id, order.stripeSessionId);
      res.json({ order: saved });
    }),
  );

  app.post(
    "/api/admin/catalogue/import",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const csv = typeof req.body?.csv === "string" ? req.body.csv : "";
      if (!csv.trim()) {
        res.status(400).json({ error: "Paste the CSV into the csv field" });
        return;
      }
      const result = importCatalogueCsv(db, csv, Boolean(req.body?.replace));
      res.json(result);
    }),
  );

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = /unknown part|quantity/i.test(message) ? 400 : 500;
    res.status(status).json({ error: message });
  });

  return app;
}

function paymentPage(title: string, message: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>body{font-family:Georgia,serif;background:#0B1F33;color:#F6F3EC;margin:0;padding:32px}main{max-width:32rem}h1{font-weight:500}p{line-height:1.45}</style>
  </head><body><main><p>Wickford Plumbing Supplies</p><h1>${title}</h1><p>${message}</p></main></body></html>`;
}
