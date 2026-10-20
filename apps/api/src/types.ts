export type Product = {
  partNumber: string;
  description: string;
  brand: string;
  pricePence: number;
  stock: number;
  fits: string;
  priceNote: string;
};

export type SearchHit = Product & {
  score: number;
  reason: string;
};

export type AlternativeEquivalent = {
  brand: string;
  partNumber: string;
  fits: string;
};

export type Alternative = {
  sheet: string;
  description: string;
  componentType: string;
  confidence: string;
  cautions: string;
  groupStatus: string;
  relationship: string;
  evidenceUrl: string;
  equivalents: AlternativeEquivalent[];
  sameCompany: boolean;
  cheaperInCatalogue: {
    partNumber: string;
    brand: string;
    description: string;
    pricePence: number;
    priceNote: string;
  }[];
};

export type ChatStep = { title: string; detail: string };

export type ChatPart = Product & { why: string };

export type ChatSource = { file: string; title: string };

export type ChatResponse = {
  reply: string;
  steps: ChatStep[];
  parts: ChatPart[];
  gasSafeNote: string;
  sources: ChatSource[];
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

export type OrderRecord = {
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
  country: string;
  notes: string;
  items: OrderItem[];
  subtotalPence: number;
  currency: string;
  stripeSessionId: string | null;
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

export type CheckoutInput = {
  customer: { name: string; email: string; phone: string };
  address: { line1: string; line2?: string; city: string; postcode: string; country?: string };
  notes?: string;
  items: { partNumber: string; qty: number }[];
};
