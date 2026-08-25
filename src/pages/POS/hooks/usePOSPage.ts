import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { useProducts } from "./useProducts";
import { useShift } from "./useShift";
import { useCart } from "./useCart";
import { useSale } from "./useSale";
import { useClient } from "./useClient";
import { useCashMovements } from "./useCashMovements";
import { useModals } from "./useModals";
import { useSaleFlow } from "./useSaleFlow";
import { useShiftManager } from "./useShiftManager";
import { useClientSelector } from "./useClientSelector";
import { useQuotes } from "./useQuotes";
import { useReturn } from "./useReturn";
import type { Client } from "../components/types";
import type { CashMovementAggregated } from "../components/CashMovementModal/types";
import type { OperationMode, SaleLean, QuoteLean } from "./types";

export function usePOSPage() {
  const { logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  // Operation mode state
  const [operation, setOperation] = useState<OperationMode>("sale");

  // UI State - search must be declared before useProducts
  const [search, setSearch] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState<"$" | "%">("$");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "credit">("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [savingClient, setSavingClient] = useState(false);

  // Core hooks
  const { products, refetch: refetchProducts } = useProducts(100, search);
  const { activeShift, shiftStats, openShift, closeShift, loading: shiftLoading, refetch: refetchShift } = useShift();
  const { cart, addToCart, updateQuantity, removeItem, clearCart, subtotal } = useCart(products);
  const { checkout, loading: saleLoading } = useSale();
  const { createClient, loading: clientLoading } = useClient();
  const { aggregated: aggregatedMovements, createMovement: handleCreateCashMovement } = useCashMovements(activeShift?.id ?? null);
  const { createQuote, loading: quoteLoading } = useQuotes();
  const { createReturn, loading: returnLoading } = useReturn();

  // Modals
  const modals = useModals();

  // Computed
  const discountAmount = useMemo(() => {
    if (discountType === "%") return Math.round(subtotal * (discountValue / 100));
    return Math.min(discountValue, subtotal);
  }, [subtotal, discountValue, discountType]);

  const total = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);
  const change = useMemo(() => {
    const received = parseFloat(amountReceived) || 0;
    if (paymentMethod === "cash" || paymentMethod === "transfer") {
      return Math.max(0, received - total);
    }
    return 0;
  }, [paymentMethod, amountReceived, total]);

  const anyModalOpen = modals.showOpenShift || modals.showCloseShift || modals.showShiftStatus || modals.showNewClient || !!modals.saleSuccess || modals.showReceipt;
  const hasCartItems = cart.length > 0;
  const loading = saleLoading || clientLoading || savingClient || quoteLoading || returnLoading;

  // Dispatcher functions for different operations
  const handleCheckoutQuote = useCallback(async () => {
    if (cart.length === 0) return;
    if (discountAmount > subtotal) {
      showError("El descuento no puede ser mayor al subtotal");
      return;
    }

    try {
      const items = cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      const quote = await createQuote({
        items,
        clientId: selectedClient?.id,
        discount: discountAmount,
      });

      // Build receipt data for quote
      const receiptData = {
        number: quote.number,
        type: "quote" as const,
        items: quote.items,
        subtotal: quote.subtotal,
        discount: quote.discount,
        total: quote.total,
        client: quote.client ?? null,
        seller: quote.seller,
        createdAt: quote.createdAt,
      };

      modals.openReceipt(receiptData);
      clearCart();
      await refetchProducts();
      showSuccess("Presupuesto generado correctamente");
    } catch (err: any) {
      showError(err.message || "Error al generar el presupuesto");
    }
  }, [cart, subtotal, discountAmount, selectedClient, createQuote, clearCart, refetchProducts, modals, showError, showSuccess]);

  const handleCheckoutReturn = useCallback(async () => {
    if (!activeShift) {
      showError("Debe abrir un turno de caja primero");
      return;
    }
    if (cart.length === 0) return;
    if (paymentMethod === "credit" && !selectedClient) {
      showError("Seleccione un cliente para devolución a crédito");
      return;
    }

    try {
      const items = cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      const { sale } = await createReturn({
        items,
        clientId: selectedClient?.id,
        method: paymentMethod,
      });

      // Build receipt data for return
      const receiptData = {
        number: sale.number,
        type: "return" as const,
        items: sale.items,
        subtotal: sale.subtotal,
        discount: sale.discount,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        amountReceived: sale.amountReceived,
        change: sale.change,
        client: sale.client ?? null,
        seller: sale.seller,
        createdAt: sale.createdAt,
      };

      modals.openReceipt(receiptData);
      clearCart();
      await refetchProducts();
      await refetchShift();
      showSuccess("Devolución procesada correctamente");
    } catch (err: any) {
      showError(err.message || "Error al procesar la devolución");
    }
  }, [activeShift, cart, paymentMethod, selectedClient, createReturn, clearCart, refetchProducts, refetchShift, modals, showError, showSuccess]);

  // Composed hooks - useSaleFlow now receives operation-aware checkout
  const { handleCheckout } = useSaleFlow({
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
    openReceipt: modals.openReceipt,
  });

  const { handleOpenShift, handleCloseShift } = useShiftManager({
    activeShift,
    openShift,
    closeShift,
    showError,
    showSuccess,
    closeOpenShiftModal: modals.closeOpenShift,
    closeCloseShiftModal: modals.closeCloseShift,
  });

  const { handleCreateClient } = useClientSelector({
    selectedClient,
    setSelectedClient,
    createClient,
    showError,
    showSuccess,
    closeNewClientModal: modals.closeNewClient,
    setSavingClient,
  });

  // Clear sale - also resets operation to default
  const clearSale = useCallback(() => {
    clearCart();
    setDiscountValue(0);
    setDiscountType("$");
    setAmountReceived("");
    setPaymentMethod("cash");
    setSelectedClient(null);
    setSearch("");
    setOperation("sale");
  }, [clearCart]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => document.getElementById("product-search")?.focus(),
    onDiscount: () => document.getElementById("discount-input")?.focus(),
    onAmountReceived: () => {
      if (paymentMethod === "cash" || paymentMethod === "transfer") {
        document.getElementById("amount-received")?.focus();
      }
    },
    onNewClient: modals.openNewClient,
    onCheckout: () => {
      if (!loading && hasCartItems) {
        switch (operation) {
          case "sale":
            handleCheckout();
            break;
          case "quote":
            handleCheckoutQuote();
            break;
          case "return":
            handleCheckoutReturn();
            break;
        }
      }
    },
    onClearSale: () => {
      if (!anyModalOpen && hasCartItems) clearSale();
    },
    onCloseModals: modals.closeAll,
    isModalOpen: anyModalOpen,
    hasCartItems,
    isLoading: loading,
  });

  return {
    // Operation mode
    operation,
    setOperation,
    // Core hooks data
    products,
    refetchProducts,
    activeShift,
    shiftStats,
    shiftLoading,
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    saleLoading,
    clientLoading,
    quoteLoading,
    returnLoading,
    handleCreateCashMovement,
    // UI State
    discountValue,
    setDiscountValue,
    discountType,
    setDiscountType,
    paymentMethod,
    setPaymentMethod,
    amountReceived,
    setAmountReceived,
    search,
    setSearch,
    selectedClient,
    setSelectedClient,
    savingClient,
    setSavingClient,
    // Modals
    ...modals,
    // Computed
    discountAmount,
    total,
    change,
    anyModalOpen,
    hasCartItems,
    loading,
    // Actions
    handleCheckout,
    handleCheckoutQuote,
    handleCheckoutReturn,
    handleOpenShift,
    handleCloseShift,
    handleCreateClient,
    clearSale,
    logout,
    // Receipt modal
    onCloseReceipt: modals.closeReceipt,
    onConfirmReceipt: modals.closeReceipt,
  };
}