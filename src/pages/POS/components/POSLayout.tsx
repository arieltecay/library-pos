import { POSHeader } from "@/pages/POS/components/POSHeader/POSHeader.tsx";
import { ClientSection } from "@/pages/POS/components/ClientSection.tsx";
import { ProductSection } from "@/pages/POS/components/ProductSection.tsx";
import { CartSection } from "@/pages/POS/components/CartSection.tsx";
import { PaymentSection } from "@/pages/POS/components/PaymentSection.tsx";
import { ModalsSection } from "@/pages/POS/components/ModalsSection.tsx";
import { NoShiftView } from "@/pages/POS/components/NoShiftView.tsx";
import type { Client, Product, CartItem } from "@/pages/POS/components/types.ts";
import type { CashMovementAggregated, CashMovementType, CashMovementCategory } from "@/pages/POS/components/CashMovementModal/types.ts";

interface POSLayoutProps {
  products: Product[];
  activeShift: { id: string; openingAmount: number; openedAt: string } | null;
  shiftStats: { cashTotal?: number; transferTotal?: number; creditTotal?: number; salesCount?: number; productsSold?: number; avgTicket?: number; expectedCash?: number } | null;
  shiftLoading: boolean;
  cart: CartItem[];
  subtotal: number;
  saleLoading: boolean;
  clientLoading: boolean;
  discountValue: number;
  setDiscountValue: (v: number) => void;
  discountType: "$" | "%";
  setDiscountType: (t: "$" | "%") => void;
  paymentMethod: "cash" | "transfer" | "credit";
  setPaymentMethod: (m: "cash" | "transfer" | "credit") => void;
  amountReceived: string;
  setAmountReceived: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  selectedClient: Client | null;
  setSelectedClient: (c: Client | null) => void;
  savingClient: boolean;
  setSavingClient: (v: boolean) => void;
  showOpenShift: boolean;
  onCloseOpenShift: () => void;
  showCloseShift: boolean;
  onCloseCloseShift: () => void;
  showShiftStatus: boolean;
  onCloseShiftStatus: () => void;
  showNewClient: boolean;
  onCloseNewClient: () => void;
  saleSuccess: { total: number; change: number } | null;
  onCloseSaleSuccess: () => void;
  discountAmount: number;
  total: number;
  change: number;
  anyModalOpen: boolean;
  hasCartItems: boolean;
  loading: boolean;
  onOpenShift: () => void;
  onCloseShift: () => void;
  onShiftStatus: () => void;
  onNewClient: () => void;
  onCheckout: () => void;
  clearSale: () => void;
  logout: () => void;
  handleOpenShift: (amount: number) => Promise<void>;
  handleCloseShift: (closingAmount: number, note?: string, aggregated?: CashMovementAggregated) => Promise<void>;
  handleCreateClient: (data: { fullName: string; dni: string; phone?: string }) => Promise<void>;
  handleCreateCashMovement: (data: { type: CashMovementType; category: CashMovementCategory; amount: number; description: string }) => Promise<void>;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export function POSLayout(props: POSLayoutProps) {
  const {
    products,
    activeShift,
    shiftStats,
    shiftLoading,
    cart,
    subtotal,
    saleLoading,
    clientLoading,
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
    showOpenShift,
    onCloseOpenShift,
    showCloseShift,
    onCloseCloseShift,
    showShiftStatus,
    onCloseShiftStatus,
    showNewClient,
    onCloseNewClient,
    saleSuccess,
    onCloseSaleSuccess,
    discountAmount,
    total,
    change,
    anyModalOpen,
    hasCartItems,
    loading,
    onOpenShift,
    onCloseShift,
    onShiftStatus,
    onNewClient,
    onCheckout,
    clearSale,
    logout,
    handleOpenShift,
    handleCloseShift,
    handleCreateClient,
    handleCreateCashMovement,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = props;

  if (!activeShift && !showOpenShift && !loading) {
    return <NoShiftView onOpenShift={onOpenShift} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <POSHeader
        activeShift={activeShift}
        onCloseShift={onCloseShift}
        onShiftStatus={onShiftStatus}
        onLogout={logout}
        onCashMovement={handleCreateCashMovement}
      />

      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-end gap-6">
          <ClientSection
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
            onNewClient={onNewClient}
          />

          <div className="flex-1 relative">
            <ProductSection
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
          <CartSection
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
            onClear={clearSale}
          />
        </div>

        <PaymentSection
          subtotal={subtotal}
          discountValue={discountValue}
          discountType={discountType}
          setDiscountValue={setDiscountValue}
          setDiscountType={setDiscountType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          amountReceived={amountReceived}
          setAmountReceived={setAmountReceived}
          change={change}
          discountAmount={discountAmount}
          onCheckout={onCheckout}
          loading={loading}
          disabled={!activeShift}
        />
      </div>

      <footer className="pb-3 text-center text-xs text-neutral-400">
        Atajos: + incrementa último ítem, − decrementa · F2 buscar · F3 descuento · F4 monto recibido · F8 nuevo cliente · F9 cobrar · ESC anular
      </footer>

      <ModalsSection
        showOpenShift={showOpenShift}
        onCloseOpenShift={onCloseOpenShift}
        onSubmitOpenShift={handleOpenShift}
        shiftLoading={shiftLoading}
        showCloseShift={showCloseShift}
        onCloseCloseShift={onCloseCloseShift}
        onSubmitCloseShift={handleCloseShift}
        activeShift={activeShift}
        shiftStats={shiftStats}
        aggregated={undefined}
        showShiftStatus={showShiftStatus}
        onCloseShiftStatus={onCloseShiftStatus}
        activeShiftForStatus={activeShift}
        shiftStatsForStatus={shiftStats}
        showNewClient={showNewClient}
        onCloseNewClient={onCloseNewClient}
        onSubmitNewClient={handleCreateClient}
        savingClient={savingClient}
        saleSuccess={saleSuccess}
        onCloseSaleSuccess={onCloseSaleSuccess}
      />
    </div>
  );
}