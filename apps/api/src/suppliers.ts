import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import type { AppConfig } from "./config.js";
import { GAS_SAFE_NOTE } from "./config.js";
import type { OrderRecord } from "./types.js";

export type ComposedEmail = { to: string; subject: string; body: string };

export type SupplierSubmission = {
  order: OrderRecord;
  supplierEmail: ComposedEmail;
  wickfordEmail: ComposedEmail;
};

export type SupplierResult = {
  ok: boolean;
  delivery: "smtp" | "outbox" | "unsupported";
  detail: string;
};

export interface SupplierAdapter {
  id: "email" | "api-edi";
  label: string;
  submit(submission: SupplierSubmission): Promise<SupplierResult>;
}

function money(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function composeOrderEmails(order: OrderRecord, config: AppConfig): {
  supplierEmail: ComposedEmail;
  wickfordEmail: ComposedEmail;
} {
  const lines = order.items
    .map((item, index) => {
      return [
        `${index + 1}. ${item.qty} × ${item.partNumber}  ${item.brand}`,
        `   ${item.description}`,
        item.fits ? `   Fits note: ${item.fits}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const address = [
    order.customerName,
    order.addressLine1,
    order.addressLine2,
    order.city,
    order.postcode,
    order.country,
    `Phone: ${order.customerPhone}`,
    `Email: ${order.customerEmail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const subject = `Wickford Plumbing Supplies order ${order.id} — drop-ship`;
  const supplierBody = [
    "WICKFORD PLUMBING SUPPLIES",
    `Drop-ship request ${order.id}`,
    "",
    `Supplier: ${config.supplierName}`,
    `To: ${config.supplierOrderEmail}`,
    "",
    "Please deliver the parts below to the customer address.",
    "Invoice Wickford Plumbing Supplies on our trade account. Do not charge the customer.",
    "",
    "CUSTOMER DELIVERY ADDRESS",
    address,
    "",
    "PARTS",
    lines,
    "",
    order.notes ? `ORDER NOTES\n${order.notes}\n` : "",
    "Write make, model, GC number and serial on the job before the part is fitted.",
    "Prices are not shown on this supplier copy.",
    "",
    GAS_SAFE_NOTE,
    "",
    "— Wickford Plumbing Supplies, Wickford, Essex",
  ]
    .filter((line) => line !== "")
    .join("\n");

  const priceLines = order.items
    .map(
      (item) =>
        `${item.qty} × ${item.partNumber} ${item.brand} @ ${money(item.pricePence)} = ${money(item.pricePence * item.qty)}${
          /placeholder/i.test(item.priceNote) ? " (placeholder price)" : ""
        }`,
    )
    .join("\n");

  const wickfordBody = [
    supplierBody,
    "",
    "----------",
    "INTERNAL COPY FOR WICKFORD — not for the supplier packing note",
    `Payment: ${order.paymentMode}`,
    `Merchandise total (ex VAT): ${money(order.subtotalPence)}`,
    priceLines,
    "Carriage is arranged by the supplier. No carriage has been added in this build.",
    "If the catalogue is still the sample file, these figures are placeholders, not Intact/Xline trade prices.",
  ].join("\n");

  return {
    supplierEmail: { to: config.supplierOrderEmail, subject, body: supplierBody },
    wickfordEmail: {
      to: config.wickfordOrdersEmail,
      subject: `Copy: ${subject}`,
      body: wickfordBody,
    },
  };
}

export class EmailOrderAdapter implements SupplierAdapter {
  id = "email" as const;
  label = "Email order";

  constructor(private config: AppConfig) {}

  async submit(submission: SupplierSubmission): Promise<SupplierResult> {
    fs.mkdirSync(this.config.outboxDir, { recursive: true });
    const supplierPath = path.join(this.config.outboxDir, `${submission.order.id}-supplier.txt`);
    const wickfordPath = path.join(this.config.outboxDir, `${submission.order.id}-wickford.txt`);
    const supplierFile = `To: ${submission.supplierEmail.to}\nSubject: ${submission.supplierEmail.subject}\n\n${submission.supplierEmail.body}\n`;
    const wickfordFile = `To: ${submission.wickfordEmail.to}\nSubject: ${submission.wickfordEmail.subject}\n\n${submission.wickfordEmail.body}\n`;
    fs.writeFileSync(supplierPath, supplierFile);
    fs.writeFileSync(wickfordPath, wickfordFile);

    if (!this.config.smtpHost) {
      return {
        ok: true,
        delivery: "outbox",
        detail: `SMTP is not configured. Order email saved to ${supplierPath} and ${wickfordPath}. It would be sent to ${submission.supplierEmail.to} with a copy to ${submission.wickfordEmail.to}.`,
      };
    }

    try {
      const transport = nodemailer.createTransport({
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        secure: this.config.smtpSecure,
        auth: this.config.smtpUser
          ? { user: this.config.smtpUser, pass: this.config.smtpPass }
          : undefined,
      });
      await transport.sendMail({
        from: `"${this.config.orderFromName}" <${this.config.orderFromEmail}>`,
        to: submission.supplierEmail.to,
        cc: submission.wickfordEmail.to,
        subject: submission.supplierEmail.subject,
        text: submission.supplierEmail.body,
      });
      await transport.sendMail({
        from: `"${this.config.orderFromName}" <${this.config.orderFromEmail}>`,
        to: submission.wickfordEmail.to,
        subject: submission.wickfordEmail.subject,
        text: submission.wickfordEmail.body,
      });
      return {
        ok: true,
        delivery: "smtp",
        detail: `Emailed ${submission.supplierEmail.to} and ${submission.wickfordEmail.to}. Copies also saved in the outbox.`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "SMTP send failed";
      return {
        ok: true,
        delivery: "outbox",
        detail: `SMTP failed (${message}). The order email was still generated and saved in the outbox.`,
      };
    }
  }
}

/** Future supplier API / EDI. The interface is the same; nothing is sent. */
export class ApiEdiOrderAdapter implements SupplierAdapter {
  id = "api-edi" as const;
  label = "Supplier API / EDI (not implemented)";

  async submit(_submission: SupplierSubmission): Promise<SupplierResult> {
    return {
      ok: false,
      delivery: "unsupported",
      detail:
        "The API/EDI supplier adapter is a stub. No order was transmitted. Set SUPPLIER_ADAPTER=email to send a formatted drop-ship email.",
    };
  }
}

export function createSupplierAdapter(config: AppConfig): SupplierAdapter {
  if (config.supplierAdapter === "api-edi") return new ApiEdiOrderAdapter();
  return new EmailOrderAdapter(config);
}
