import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { OrderItem, OrderRecord, Product } from "./types.js";

export type Db = DatabaseSync;

export function openDatabase(dbPath: string): Db {
  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const db = new DatabaseSync(dbPath);
  if (dbPath !== ":memory:") db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA busy_timeout = 3000;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      part_number TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      brand TEXT NOT NULL,
      price_pence INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      fits TEXT NOT NULL,
      price_note TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT NOT NULL,
      city TEXT NOT NULL,
      postcode TEXT NOT NULL,
      country TEXT NOT NULL,
      notes TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal_pence INTEGER NOT NULL,
      currency TEXT NOT NULL,
      stripe_session_id TEXT,
      payment_mode TEXT NOT NULL,
      supplier_adapter TEXT NOT NULL,
      supplier_status TEXT,
      supplier_email_to TEXT,
      wickford_email_to TEXT,
      email_subject TEXT,
      supplier_email_body TEXT,
      wickford_email_body TEXT,
      email_delivery TEXT,
      email_error TEXT
    );
    CREATE TABLE IF NOT EXISTS order_seq (
      n INTEGER NOT NULL
    );
  `);
  const seq = db.prepare("SELECT n FROM order_seq").get() as { n: number } | undefined;
  if (!seq) db.prepare("INSERT INTO order_seq (n) VALUES (1000)").run();
  return db;
}

export function nextOrderId(db: Db): string {
  db.exec("BEGIN IMMEDIATE");
  try {
    const row = db.prepare("SELECT n FROM order_seq").get() as { n: number };
    const n = row.n + 1;
    db.prepare("UPDATE order_seq SET n = ?").run(n);
    db.exec("COMMIT");
    return `WPS-${n}`;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function rowToProduct(row: Record<string, unknown>): Product {
  return {
    partNumber: String(row.part_number),
    description: String(row.description),
    brand: String(row.brand),
    pricePence: Number(row.price_pence),
    stock: Number(row.stock),
    fits: String(row.fits),
    priceNote: String(row.price_note ?? ""),
  };
}

export function listProducts(db: Db): Product[] {
  const rows = db.prepare("SELECT * FROM products ORDER BY brand, part_number").all() as Record<
    string,
    unknown
  >[];
  return rows.map(rowToProduct);
}

export function getProduct(db: Db, partNumber: string): Product | null {
  const row = db.prepare("SELECT * FROM products WHERE part_number = ?").get(partNumber) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToProduct(row) : null;
}

export function findProductLoose(db: Db, partNumber: string): Product | null {
  const exact = getProduct(db, partNumber);
  if (exact) return exact;
  const target = partNumber.replace(/[\s-]/g, "").toUpperCase();
  const products = listProducts(db);
  return (
    products.find((product) => product.partNumber.replace(/[\s-]/g, "").toUpperCase() === target) ??
    null
  );
}

export function setMeta(db: Db, key: string, value: string) {
  db.prepare(
    "INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  ).run(key, value);
}

export function getMeta(db: Db, key: string): string | null {
  const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? null;
}

export function insertOrder(
  db: Db,
  order: Omit<
    OrderRecord,
    | "supplierStatus"
    | "supplierEmailTo"
    | "wickfordEmailTo"
    | "emailSubject"
    | "supplierEmailBody"
    | "wickfordEmailBody"
    | "emailDelivery"
    | "emailError"
    | "stripeSessionId"
  > & { stripeSessionId?: string | null },
) {
  db.prepare(
    `INSERT INTO orders (
      id, created_at, status, customer_name, customer_email, customer_phone,
      address_line1, address_line2, city, postcode, country, notes, items_json,
      subtotal_pence, currency, stripe_session_id, payment_mode, supplier_adapter
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    order.id,
    order.createdAt,
    order.status,
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.addressLine1,
    order.addressLine2,
    order.city,
    order.postcode,
    order.country,
    order.notes,
    JSON.stringify(order.items),
    order.subtotalPence,
    order.currency,
    order.stripeSessionId ?? null,
    order.paymentMode,
    order.supplierAdapter,
  );
}

export function rowToOrder(row: Record<string, unknown>): OrderRecord {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    status: String(row.status),
    customerName: String(row.customer_name),
    customerEmail: String(row.customer_email),
    customerPhone: String(row.customer_phone),
    addressLine1: String(row.address_line1),
    addressLine2: String(row.address_line2),
    city: String(row.city),
    postcode: String(row.postcode),
    country: String(row.country),
    notes: String(row.notes),
    items: JSON.parse(String(row.items_json)) as OrderItem[],
    subtotalPence: Number(row.subtotal_pence),
    currency: String(row.currency),
    stripeSessionId: row.stripe_session_id ? String(row.stripe_session_id) : null,
    paymentMode: String(row.payment_mode),
    supplierAdapter: String(row.supplier_adapter),
    supplierStatus: row.supplier_status ? String(row.supplier_status) : null,
    supplierEmailTo: row.supplier_email_to ? String(row.supplier_email_to) : null,
    wickfordEmailTo: row.wickford_email_to ? String(row.wickford_email_to) : null,
    emailSubject: row.email_subject ? String(row.email_subject) : null,
    supplierEmailBody: row.supplier_email_body ? String(row.supplier_email_body) : null,
    wickfordEmailBody: row.wickford_email_body ? String(row.wickford_email_body) : null,
    emailDelivery: row.email_delivery ? String(row.email_delivery) : null,
    emailError: row.email_error ? String(row.email_error) : null,
  };
}

export function getOrder(db: Db, id: string): OrderRecord | null {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToOrder(row) : null;
}

export function listOrders(db: Db): OrderRecord[] {
  const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as Record<
    string,
    unknown
  >[];
  return rows.map(rowToOrder);
}

export function saveOrderFulfillment(
  db: Db,
  id: string,
  fields: {
    status: string;
    stripeSessionId?: string | null;
    supplierStatus: string;
    supplierEmailTo: string | null;
    wickfordEmailTo: string | null;
    emailSubject: string | null;
    supplierEmailBody: string | null;
    wickfordEmailBody: string | null;
    emailDelivery: string | null;
    emailError: string | null;
  },
) {
  db.prepare(
    `UPDATE orders SET
      status = ?,
      stripe_session_id = COALESCE(?, stripe_session_id),
      supplier_status = ?,
      supplier_email_to = ?,
      wickford_email_to = ?,
      email_subject = ?,
      supplier_email_body = ?,
      wickford_email_body = ?,
      email_delivery = ?,
      email_error = ?
    WHERE id = ?`,
  ).run(
    fields.status,
    fields.stripeSessionId ?? null,
    fields.supplierStatus,
    fields.supplierEmailTo,
    fields.wickfordEmailTo,
    fields.emailSubject,
    fields.supplierEmailBody,
    fields.wickfordEmailBody,
    fields.emailDelivery,
    fields.emailError,
    id,
  );
}
