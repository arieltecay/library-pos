import { useCallback } from "react";
import type { CartItem } from "../components/Cart/types";
import type { Client } from "../components/types";
import type { CashMovementAggregated } from "../components/CashMovementModal/types";

export interface SaleFlowDeps {
  activeShift: { id: string } | null;
  cart: CartItem[];
  selectedClient: Client | null;
  discountAmount: number;
  paymentMethod: "cash" | "transfer" | "credit";
  amountReceived: string;
  subtotal: number;
  total: number;
  checkout: (params: {
    items: { product: string; quantity: number }[];
    clientId?: string;
    discount: number;
    paymentMethod: "cash" | "transfer" | "credit";
    amountReceived: number;
  }) => Promise<{ total: number; change: number }>;
  clearCart: () => void;
  refetchProducts: () => Promise<void>;
  refetchShift: () => Promise<void>;
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
  openSaleSuccess: (total: number, change: number) => void;
}

export function useSaleFlow(deps: SaleFlowDeps) {
  const {
    activeShift,
    cart,
    selectedClient,
    discountAmount,
    paymentMethod,
    amountReceived,
    subtotal,
    total,
    checkout,
    clearCart,
    refetchProducts,
    refetchShift,
    showError,
    showSuccess,
    openSaleSuccess,
  } = deps;

  const handleCheckout = useCallback(async () => {
    if (!activeShift) {
      showError("Debe abrir un turno de caja primero");
      return;
    }
    if (cart.length === 0) return;
    if (paymentMethod === "credit" && !selectedClient) {
      showError("Seleccione un cliente para venta a crédito");
      return;
    }
    if (paymentMethod === "cash" || paymentMethod === "transfer") {
      const received = amountReceived ? parseFloat(amountReceived) : total;
      if (received < total) {
        showError("Monto recibido insuficiente");
        return;
      }
    }

    try {
      const items = cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      const { total: saleTotal, change: saleChange } = await checkout({
        items,
        clientId: selectedClient?.id,
        discount: discountAmount,
        paymentMethod,
        amountReceived: (paymentMethod === "cash" || paymentMethod === "transfer") ? parseFloat(amountReceived) || total : total,
      });

      openSaleSuccess(saleTotal, saleChange);
      clearCart();
      await refetchProducts();
      await refetchShift();
      showSuccess("Venta procesada correctamente");
    } catch (err: any) {
      showError(err.message || "Error al procesar la venta");
    }
  }, [
    activeShift,
    cart,
    selectedClient,
    discountAmount,
    paymentMethod,
    amountReceived,
    total,
    checkout,
    clearCart,
    refetchProducts,
    refetchShift,
    showError,
    showSuccess,
    openSaleSuccess,
  ]);

  return { handleCheckout };
}