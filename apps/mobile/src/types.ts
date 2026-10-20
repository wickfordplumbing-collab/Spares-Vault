export type Product = {
  partNumber: string;
  description: string;
  brand: string;
  pricePence: number;
  stock: number;
  fits: string;
  priceNote: string;
};

export type SearchHit = Product & { score: number; reason: string };

export type Alternative = {
  sheet: string;
  description: string;
  componentType: string;
  confidence: string;
  cautions: string;
  groupStatus: string;
  relationship: string;
  evidenceUrl: string;
  equivalents: { brand: string; partNumber: string; fits: string }[];
  sameCompany: boolean;
  cheaperInCatalogue: {
    partNumber: string;
    brand: string;
    description: string;
    pricePence: number;
    priceNote: string;
  }[];
};

export type ChatResponse = {
  reply: string;
  steps: { title: string; detail: string }[];
  parts: (Product & { why: string })[];
  gasSafeNote: string;
  sources: { file: string; title: string }[];
  mode: string;
};

export type OrderItem = {
  partNumber: string;
  brand: string;
  description: string;
  qty: number;
  pricePence: number;
  priceNote: string;
  fits: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  notes: string;
  items: OrderItem[];
  subtotalPence: number;
  paymentMode: string;
  supplierAdapter: string;
  supplierStatus: string | null;
  supplierEmailTo: string | null;
  wickfordEmailTo: string | null;
  emailSubject: string | null;
  supplierEmailBody: string | null;
  wickfordEmailBody: string | null;
  emailDelivery: string | null;
  emailError: string | null;
};

export type Health = {
  ok: boolean;
  assistantMode: string;
  payments: string;
  supplierAdapter: string;
  supplierName: string;
  catalogueMode: string;
  productCount: number;
  gasSafeNote: string;
};
