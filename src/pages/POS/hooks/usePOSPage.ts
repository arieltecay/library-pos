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
import type { Client } from "../components/types";
import type { CashMovementAggregated } from "../components/CashMovementModal/types";

export function usePOSPage() {
  const { logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

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

  const anyModalOpen = modals.showOpenShift || modals.showCloseShift || modals.showShiftStatus || modals.showNewClient || !!modals.saleSuccess;
  const hasCartItems = cart.length > 0;
  const loading = saleLoading || clientLoading || savingClient;

  // Composed hooks
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
    openSaleSuccess: modals.openSaleSuccess,
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

  // Clear sale
  const clearSale = useCallback(() => {
    clearCart();
    setDiscountValue(0);
    setDiscountType("$");
    setAmountReceived("");
    setPaymentMethod("cash");
    setSelectedClient(null);
    setSearch("");
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
      if (!loading && hasCartItems) handleCheckout();
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
    handleOpenShift,
    handleCloseShift,
    handleCreateClient,
    clearSale,
    logout,
  };
}