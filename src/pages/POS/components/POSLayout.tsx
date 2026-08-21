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
  discountValue: number;
  setDiscountValue: (_v: number) => void;
  discountType: "$" | "%";
  setDiscountType: (_t: "$" | "%") => void;
  paymentMethod: "cash" | "transfer" | "credit";
  setPaymentMethod: (_m: "cash" | "transfer" | "credit") => void;
  amountReceived: string;
  setAmountReceived: (_v: string) => void;
  search: string;
  setSearch: (_v: string) => void;
  selectedClient: Client | null;
  setSelectedClient: (_c: Client | null) => void;
  savingClient: boolean;
  setSavingClient: (_v: boolean) => void;
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

interface HeaderAreaProps {
  activeShift: POSLayoutProps["activeShift"];
  onCloseShift: POSLayoutProps["onCloseShift"];
  onShiftStatus: POSLayoutProps["onShiftStatus"];
  onLogout: POSLayoutProps["logout"];
  onCashMovement: POSLayoutProps["handleCreateCashMovement"];
  selectedClient: POSLayoutProps["selectedClient"];
  setSelectedClient: POSLayoutProps["setSelectedClient"];
  onNewClient: POSLayoutProps["onNewClient"];
  products: POSLayoutProps["products"];
  search: POSLayoutProps["search"];
  setSearch: POSLayoutProps["setSearch"];
  addToCart: POSLayoutProps["addToCart"];
}

function HeaderArea(props: HeaderAreaProps) {
  const { activeShift, onCloseShift, onShiftStatus, onLogout, onCashMovement, selectedClient, setSelectedClient, onNewClient, products, search, setSearch, addToCart } = props;

  return (
    <>
      <POSHeader
        activeShift={activeShift}
        onCloseShift={onCloseShift}
        onShiftStatus={onShiftStatus}
        onLogout={onLogout}
        onCashMovement={onCashMovement}
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
    </>
  );
}

interface MainContentAreaProps {
  cart: POSLayoutProps["cart"];
  updateQuantity: POSLayoutProps["updateQuantity"];
  removeItem: POSLayoutProps["removeItem"];
  clearSale: POSLayoutProps["clearSale"];
  subtotal: POSLayoutProps["subtotal"];
  discountValue: POSLayoutProps["discountValue"];
  setDiscountValue: POSLayoutProps["setDiscountValue"];
  discountType: POSLayoutProps["discountType"];
  setDiscountType: POSLayoutProps["setDiscountType"];
  paymentMethod: POSLayoutProps["paymentMethod"];
  setPaymentMethod: POSLayoutProps["setPaymentMethod"];
  amountReceived: POSLayoutProps["amountReceived"];
  setAmountReceived: POSLayoutProps["setAmountReceived"];
  change: POSLayoutProps["change"];
  discountAmount: POSLayoutProps["discountAmount"];
  onCheckout: POSLayoutProps["onCheckout"];
  loading: POSLayoutProps["loading"];
  activeShift: POSLayoutProps["activeShift"];
}

function MainContentArea(props: MainContentAreaProps) {
  const { cart, updateQuantity, removeItem, clearSale, subtotal, discountValue, setDiscountValue, discountType, setDiscountType, paymentMethod, setPaymentMethod, amountReceived, setAmountReceived, change, discountAmount, onCheckout, loading, activeShift } = props;

  return (
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
  );
}

interface FooterModalsAreaProps {
  shiftLoading: POSLayoutProps["shiftLoading"];
  showOpenShift: POSLayoutProps["showOpenShift"];
  onCloseOpenShift: POSLayoutProps["onCloseOpenShift"];
  handleOpenShift: POSLayoutProps["handleOpenShift"];
  showCloseShift: POSLayoutProps["showCloseShift"];
  onCloseCloseShift: POSLayoutProps["onCloseCloseShift"];
  handleCloseShift: POSLayoutProps["handleCloseShift"];
  activeShift: POSLayoutProps["activeShift"];
  shiftStats: POSLayoutProps["shiftStats"];
  showShiftStatus: POSLayoutProps["showShiftStatus"];
  onCloseShiftStatus: POSLayoutProps["onCloseShiftStatus"];
  showNewClient: POSLayoutProps["showNewClient"];
  onCloseNewClient: POSLayoutProps["onCloseNewClient"];
  handleCreateClient: POSLayoutProps["handleCreateClient"];
  savingClient: POSLayoutProps["savingClient"];
  saleSuccess: POSLayoutProps["saleSuccess"];
  onCloseSaleSuccess: POSLayoutProps["onCloseSaleSuccess"];
}

function FooterModalsArea(props: FooterModalsAreaProps) {
  const { shiftLoading, showOpenShift, onCloseOpenShift, handleOpenShift, showCloseShift, onCloseCloseShift, handleCloseShift, activeShift, shiftStats, showShiftStatus, onCloseShiftStatus, showNewClient, onCloseNewClient, handleCreateClient, savingClient, saleSuccess, onCloseSaleSuccess } = props;

  return (
    <>
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
    </>
  );
}

function buildHeaderProps(p: POSLayoutProps): HeaderAreaProps {
  return {
    activeShift: p.activeShift,
    onCloseShift: p.onCloseShift,
    onShiftStatus: p.onShiftStatus,
    onLogout: p.logout,
    onCashMovement: p.handleCreateCashMovement,
    selectedClient: p.selectedClient,
    setSelectedClient: p.setSelectedClient,
    onNewClient: p.onNewClient,
    products: p.products,
    search: p.search,
    setSearch: p.setSearch,
    addToCart: p.addToCart,
  };
}

function buildMainContentProps(p: POSLayoutProps): MainContentAreaProps {
  return {
    cart: p.cart,
    updateQuantity: p.updateQuantity,
    removeItem: p.removeItem,
    clearSale: p.clearSale,
    subtotal: p.subtotal,
    discountValue: p.discountValue,
    setDiscountValue: p.setDiscountValue,
    discountType: p.discountType,
    setDiscountType: p.setDiscountType,
    paymentMethod: p.paymentMethod,
    setPaymentMethod: p.setPaymentMethod,
    amountReceived: p.amountReceived,
    setAmountReceived: p.setAmountReceived,
    change: p.change,
    discountAmount: p.discountAmount,
    onCheckout: p.onCheckout,
    loading: p.loading,
    activeShift: p.activeShift,
  };
}

function buildFooterModalsProps(p: POSLayoutProps): FooterModalsAreaProps {
  return {
    shiftLoading: p.shiftLoading,
    showOpenShift: p.showOpenShift,
    onCloseOpenShift: p.onCloseOpenShift,
    handleOpenShift: p.handleOpenShift,
    showCloseShift: p.showCloseShift,
    onCloseCloseShift: p.onCloseCloseShift,
    handleCloseShift: p.handleCloseShift,
    activeShift: p.activeShift,
    shiftStats: p.shiftStats,
    showShiftStatus: p.showShiftStatus,
    onCloseShiftStatus: p.onCloseShiftStatus,
    showNewClient: p.showNewClient,
    onCloseNewClient: p.onCloseNewClient,
    handleCreateClient: p.handleCreateClient,
    savingClient: p.savingClient,
    saleSuccess: p.saleSuccess,
    onCloseSaleSuccess: p.onCloseSaleSuccess,
  };
}

export function POSLayout(props: POSLayoutProps) {
  if (!props.activeShift && !props.showOpenShift && !props.loading) {
    return <NoShiftView onOpenShift={props.onOpenShift} onLogout={props.logout} />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <HeaderArea {...buildHeaderProps(props)} />
      <MainContentArea {...buildMainContentProps(props)} />
      <FooterModalsArea {...buildFooterModalsProps(props)} />
    </div>
  );
}