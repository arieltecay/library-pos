import { usePOSPage } from "./hooks/usePOSPage";
import { POSLayout } from "./components/POSLayout";

export default function POSPage() {
  const {
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
    showOpenShift,
    showCloseShift,
    showShiftStatus,
    showNewClient,
    saleSuccess,
    closeOpenShift,
    closeCloseShift,
    closeShiftStatus,
    closeNewClient,
    closeSaleSuccess,
    openOpenShift,
    openCloseShift,
    openShiftStatus,
    openNewClient,
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
  } = usePOSPage();

  return (
    <POSLayout
      products={products}
      activeShift={activeShift}
      shiftStats={shiftStats}
      shiftLoading={shiftLoading}
      cart={cart}
      subtotal={subtotal}
      saleLoading={saleLoading}
      clientLoading={clientLoading}
      discountValue={discountValue}
      setDiscountValue={setDiscountValue}
      discountType={discountType}
      setDiscountType={setDiscountType}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      amountReceived={amountReceived}
      setAmountReceived={setAmountReceived}
      search={search}
      setSearch={setSearch}
      selectedClient={selectedClient}
      setSelectedClient={setSelectedClient}
      savingClient={savingClient}
      setSavingClient={setSavingClient}
      showOpenShift={showOpenShift}
      onCloseOpenShift={closeOpenShift}
      showCloseShift={showCloseShift}
      onCloseCloseShift={closeCloseShift}
      showShiftStatus={showShiftStatus}
      onCloseShiftStatus={closeShiftStatus}
      showNewClient={showNewClient}
      onCloseNewClient={closeNewClient}
      saleSuccess={saleSuccess}
      onCloseSaleSuccess={closeSaleSuccess}
      discountAmount={discountAmount}
      total={total}
      change={change}
      anyModalOpen={anyModalOpen}
      hasCartItems={hasCartItems}
      loading={loading}
      onOpenShift={openOpenShift}
      onCloseShift={openCloseShift}
      onShiftStatus={openShiftStatus}
      onNewClient={openNewClient}
      onCheckout={handleCheckout}
      clearSale={clearSale}
      logout={logout}
      handleOpenShift={handleOpenShift}
      handleCloseShift={handleCloseShift}
      handleCreateClient={handleCreateClient}
      handleCreateCashMovement={handleCreateCashMovement}
      addToCart={addToCart}
      updateQuantity={updateQuantity}
      removeItem={removeItem}
      clearCart={clearCart}
    />
  );
}