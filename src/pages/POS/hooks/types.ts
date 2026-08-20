import type { Product } from "../components/types";
import type { CashShift, ShiftAggregated } from "../components/types";
import type { CashMovementAggregated } from "../components/CashMovementModal/types";
import type { Client, ClientListResponse } from "../components/types";
import type { CartItem, SaleItem } from "../components/Cart/types";

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseShiftResult {
  activeShift: CashShift | null;
  shiftStats: ShiftAggregated | null;
  loading: boolean;
  error: string | null;
  openShift: (openingAmount: number) => Promise<void>;
  closeShift: (closingAmount: number, note?: string, aggregated?: CashMovementAggregated) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseClientResult {
  createClient: (data: { fullName: string; dni: string; phone?: string }) => Promise<Client>;
  listClients: (params?: { search?: string; page?: number; limit?: number }) => Promise<ClientListResponse>;
  searchClients: (query: string) => Promise<Client[]>;
  loading: boolean;
  error: string | null;
}

export interface UseCartResult {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
}

export interface UseSaleResult {
  checkout: (params: {
    items: { product: string; quantity: number }[];
    clientId?: string;
    discount: number;
    paymentMethod: "cash" | "transfer" | "credit";
    amountReceived: number;
  }) => Promise<{ total: number; change: number }>;
  loading: boolean;
  error: string | null;
}