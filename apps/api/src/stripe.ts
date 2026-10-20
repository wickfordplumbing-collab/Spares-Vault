import Stripe from "stripe";

export function assertStripeTestKey(secretKey: string) {
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not set");
  if (secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_")) {
    throw new Error("Live Stripe keys are refused. Use an sk_test_ key.");
  }
  if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("rk_test_")) {
    throw new Error("Stripe checkout expects a test secret key (sk_test_).");
  }
}

export async function createStripeCheckout(options: {
  secretKey: string;
  orderId: string;
  customerEmail: string;
  items: { name: string; qty: number; pricePence: number }[];
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string; id: string }> {
  assertStripeTestKey(options.secretKey);
  const stripe = new Stripe(options.secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: options.customerEmail,
    client_reference_id: options.orderId,
    metadata: { orderId: options.orderId },
    line_items: options.items.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: "gbp",
        unit_amount: item.pricePence,
        product_data: { name: item.name },
      },
    })),
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return { url: session.url, id: session.id };
}

export async function retrievePaidOrderId(secretKey: string, sessionId: string): Promise<string | null> {
  assertStripeTestKey(secretKey);
  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return null;
  return session.metadata?.orderId || session.client_reference_id || null;
}

export function constructStripeEvent(secretKey: string, webhookSecret: string, raw: Buffer, signature: string) {
  assertStripeTestKey(secretKey);
  const stripe = new Stripe(secretKey);
  return stripe.webhooks.constructEvent(raw, signature, webhookSecret);
}
