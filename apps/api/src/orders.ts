import type { AppConfig } from "./config.js";
import type { Db } from "./db.js";
import { getOrder, saveOrderFulfillment } from "./db.js";
import { composeOrderEmails, createSupplierAdapter } from "./suppliers.js";
import type { OrderRecord } from "./types.js";

export async function fulfillOrder(
  db: Db,
  config: AppConfig,
  orderId: string,
  stripeSessionId?: string | null,
): Promise<OrderRecord> {
  const existing = getOrder(db, orderId);
  if (!existing) throw new Error("Order not found");
  if (existing.supplierEmailBody && existing.status === "sent_to_supplier") return existing;

  const order: OrderRecord = {
    ...existing,
    stripeSessionId: stripeSessionId || existing.stripeSessionId,
    status: "paid",
  };
  const emails = composeOrderEmails(order, config);
  const adapter = createSupplierAdapter(config);
  const result = await adapter.submit({
    order,
    supplierEmail: emails.supplierEmail,
    wickfordEmail: emails.wickfordEmail,
  });
  const status = result.ok ? "sent_to_supplier" : "supplier_pending_adapter";
  saveOrderFulfillment(db, orderId, {
    status,
    stripeSessionId: stripeSessionId || null,
    supplierStatus: result.detail,
    supplierEmailTo: emails.supplierEmail.to,
    wickfordEmailTo: emails.wickfordEmail.to,
    emailSubject: emails.supplierEmail.subject,
    supplierEmailBody: emails.supplierEmail.body,
    wickfordEmailBody: emails.wickfordEmail.body,
    emailDelivery: result.delivery,
    emailError: result.ok ? null : result.detail,
  });
  const saved = getOrder(db, orderId);
  if (!saved) throw new Error("Order disappeared after fulfillment");
  return saved;
}
