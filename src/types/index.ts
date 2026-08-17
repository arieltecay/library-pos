export interface Product {
  id: string;
  name: string;
  description?: string;
  type: "product" | "service";
  price: number;
  cost?: number;
  stock: number;
  minStock?: number;
  unit?: "unit" | "sheet" | "binding";
  code?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Client {
  id: string;
  fullName: string;
  phone?: string;
  dni: string;
  isDefault: boolean;
  balance: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListResponse {
  items: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SaleItem {
  product: string;
  name: string;
  type: "product" | "service";
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  amountReceived: number;
  change: number;
  paymentMethod: "cash" | "transfer" | "credit";
  type: "sale" | "return";
  client: string;
  seller: string;
  cashShift: string;
  voided: boolean;
  createdAt: string;
}

export interface SalePreview {
  items: Array<{
    product: string;
    name: string;
    type: "product" | "service";
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  amountReceived?: number;
  change?: number;
  paymentMethod: "cash" | "transfer" | "credit";
  creditBalanceAfter?: number;
}

export interface CashShift {
  id: string;
  seller: string;
  openedAt: string;
  closedAt?: string;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  status: "open" | "closed";
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftAggregated {
  cashTotal: number;
  transferTotal: number;
  creditTotal: number;
  salesCount: number;
  productsSold: number;
  avgTicket: number;
  expectedCash: number;
}
