import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useProducts } from "./hooks/useProducts";
import { useShift } from "./hooks/useShift";
import { useCart, type CartItem } from "./hooks/useCart";
import { useSale } from "./hooks/useSale";
import { useClient } from "./hooks/useClient";
import { POSHeader } from "./components/POSHeader/POSHeader";
import { Cart } from "./components/Cart/Cart";
import { PaymentPanel } from "./components/PaymentPanel/PaymentPanel";
import { ProductSearch } from "./components/ProductSearch/ProductSearch";
import { QuickProducts } from "./components/QuickProducts/QuickProducts";
import { ClientPicker } from "./components/ClientPicker/ClientPicker";
import { OpenShiftModal } from "./components/OpenShiftModal/OpenShiftModal";
import { CloseShiftModal } from "./components/CloseShiftModal/CloseShiftModal";
import { ShiftStatusModal } from "./components/ShiftStatusModal/ShiftStatusModal";
import { NewClientModal } from "./components/NewClientModal/NewClientModal";
import { SaleSuccessModal } from "./components/SaleSuccessModal/SaleSuccessModal";
import type { Product, Client } from "../../types";

const PAYMENT_METHODS = [
  { value: "cash", label: "Efectivo", icon: "payments" },
  { value: "transfer", label: "Transferencia", icon: "account_balance" },
  { value: "credit", label: "Crédito", icon: "credit_card" },
] as const;

export default function POSPage() {
  const { user, logout } = useAuth();
  const { success, error: showError, warning } = useToast();

  // Hooks
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts(100);
  const { activeShift, shiftStats, openShift, closeShift, loading: shiftLoading, refetch } = useShift();
  const { cart, addToCart, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart(products);
  const { checkout, loading: saleLoading } = useSale();
  const { createClient, loading: clientLoading } = useClient();
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState<"$" | "%">("$");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "credit">("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Modals state
  const [showOpenShift, setShowOpenShift] = useState(false);
  const [openingAmount, setOpeningAmount] = useState("");
  const [showCloseShift, setShowCloseShift] = useState(false);
  const [closingAmount, setClosingAmount] = useState("");
  const [showShiftStatus, setShowShiftStatus] = useState(false);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({ fullName: "", dni: "", phone: "" });
  const [savingClient, setSavingClient] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState<{ total: number; change: number } | null>(null);

  // Computed values
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

  const quickProducts = useMemo(() => {
    return products
      .filter((p) => p.active && p.type === "service")
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 5);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => p.active && p.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [products, search]);

  // Keyboard shortcuts
  const anyModalOpen = showOpenShift || showCloseShift || showShiftStatus || showNewClient || !!saleSuccess;
  const hasCartItems = cart.length > 0;
  const loading = saleLoading || clientLoading || savingClient;

  // Handlers
  const handleOpenShift = async () => {
    try {
      const amount = parseFloat(openingAmount);
      if (isNaN(amount) || amount <= 0) {
        showError("Debe ingresar un monto inicial mayor a 0");
        return;
      }
      await openShift(amount);
      setShowOpenShift(false);
      setOpeningAmount("");
      success("Turno de caja abierto");
    } catch (err: any) {
      showError(err.response?.data?.message || "Error al abrir turno de caja");
    }
  };

  const handleCloseShift = async (closingAmount: number, note?: string) => {
    if (!activeShift) return;
    try {
      if (isNaN(closingAmount) || closingAmount < 0) {
        showError("Debe ingresar un monto final válido");
        return;
      }
      await closeShift(closingAmount, note);
      setShowCloseShift(false);
      setClosingAmount("");
      success("Turno de caja cerrado");
    } catch (err: any) {
      showError(err.response?.data?.message || "Error al cerrar turno de caja");
    }
  };

  const handleCreateClient = async () => {
    if (newClient.fullName.trim().length < 2) {
      showError("Ingrese el nombre del cliente");
      return;
    }
    if (!newClient.dni.trim()) {
      showError("Ingrese el DNI del cliente");
      return;
    }
    setSavingClient(true);
    try {
      const client = await createClient({
        fullName: newClient.fullName.trim(),
        dni: newClient.dni.trim(),
        phone: newClient.phone.trim() || undefined,
      });
      setSelectedClient(client);
      setShowNewClient(false);
      setNewClient({ fullName: "", dni: "", phone: "" });
      success("Cliente creado");
    } catch (err: any) {
      showError(err.response?.data?.message || "Error al crear el cliente");
    } finally {
      setSavingClient(false);
    }
  };

  const handleCheckout = async () => {
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

      setSaleSuccess({ total: saleTotal, change: saleChange });
      clearCart();
      refetchProducts();
      refetch(); // Actualizar estado del turno en tiempo real
      success("Venta procesada correctamente");
    } catch (err: any) {
      showError(err.message || "Error al procesar la venta");
    }
  };

  const clearSale = () => {
    clearCart();
    setDiscountValue(0);
    setDiscountType("$");
    setAmountReceived("");
    setPaymentMethod("cash");
    setSelectedClient(null);
    setSearch("");
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => document.getElementById("product-search")?.focus(),
    onDiscount: () => document.getElementById("discount-input")?.focus(),
    onAmountReceived: () => {
      if (paymentMethod === "cash" || paymentMethod === "transfer") {
        document.getElementById("amount-received")?.focus();
      }
    },
    onNewClient: () => setShowNewClient(true),
    onCheckout: () => {
      if (!loading && hasCartItems) handleCheckout();
    },
    onClearSale: () => {
      if (!anyModalOpen && hasCartItems) clearSale();
    },
    onCloseModals: () => {
      setShowOpenShift(false);
      setShowCloseShift(false);
      setShowShiftStatus(false);
      setShowNewClient(false);
      setSaleSuccess(null);
    },
    isModalOpen: anyModalOpen,
    hasCartItems,
    isLoading: loading,
  });

  // Early return if no active shift (and not loading)
  if (!activeShift && !showOpenShift && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning-50 mb-4">
            <svg className="w-8 h-8 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No hay turno de caja abierto</h2>
          <p className="text-neutral-500 mb-6">Debe abrir un turno para comenzar a vender</p>
          <button
            onClick={() => setShowOpenShift(true)}
            className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Abrir turno de caja
          </button>
          <button
            onClick={logout}
            className="ml-3 px-6 py-3 rounded-xl bg-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-300 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <POSHeader
        activeShift={activeShift}
        shiftStats={shiftStats}
        onOpenShift={() => setShowOpenShift(true)}
        onCloseShift={() => setShowCloseShift(true)}
        onShiftStatus={() => setShowShiftStatus(true)}
        onLogout={logout}
      />

      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-end gap-6">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Cliente</span>
            <div className="flex items-center gap-2 mt-1.5">
              <ClientPicker
                selected={selectedClient}
                onSelect={setSelectedClient}
                onNewClient={() => setShowNewClient(true)}
              />
              <button
                onClick={() => setShowNewClient(true)}
                className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Nuevo
                <kbd className="text-xs bg-white/20 px-1.5 py-0.5 rounded">F8</kbd>
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <ProductSearch
              products={products}
              search={search}
              onSearchChange={setSearch}
              onAddProduct={addToCart}
              disabled={!activeShift}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <QuickProducts products={products} onAddProduct={addToCart} />
          </div>

          <div className="flex-1 bg-white border border-neutral-200 rounded-xl overflow-y-auto">
            <Cart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              onClear={clearSale}
            />
          </div>
        </div>

        <PaymentPanel
          subtotal={subtotal}
          discountValue={discountValue}
          discountType={discountType}
          setDiscountValue={setDiscountValue}
          setDiscountType={setDiscountType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          amountReceived={amountReceived}
          setAmountReceived={setAmountReceived}
          total={total}
          change={change}
          discountAmount={discountAmount}
          onCheckout={handleCheckout}
          onClearSale={clearSale}
          loading={saleLoading || clientLoading || savingClient}
          disabled={!activeShift}
        />
      </div>

      <footer className="pb-3 text-center text-xs text-neutral-400">
        Atajos: + incrementa último ítem, − decrementa · F2 buscar · F3 descuento · F4 monto recibido · F8 nuevo cliente · F9 cobrar · ESC anular
      </footer>

      <OpenShiftModal
        isOpen={showOpenShift}
        onClose={() => setShowOpenShift(false)}
        onSubmit={handleOpenShift}
        loading={shiftLoading}
      />

      <CloseShiftModal
        isOpen={showCloseShift}
        onClose={() => setShowCloseShift(false)}
        onSubmit={handleCloseShift}
        activeShift={activeShift}
        shiftStats={shiftStats}
        loading={shiftLoading}
      />

      <ShiftStatusModal
        isOpen={showShiftStatus}
        onClose={() => setShowShiftStatus(false)}
        activeShift={activeShift}
        shiftStats={shiftStats}
      />

      <NewClientModal
        isOpen={showNewClient}
        onClose={() => setShowNewClient(false)}
        onSubmit={handleCreateClient}
        loading={savingClient}
      />

      <SaleSuccessModal
        isOpen={!!saleSuccess}
        onClose={() => setSaleSuccess(null)}
        total={saleSuccess?.total || 0}
        change={saleSuccess?.change || 0}
      />
    </div>
  );
}