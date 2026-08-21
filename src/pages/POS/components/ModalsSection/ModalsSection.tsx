import { OpenShiftModal } from "@/pages/POS/components/OpenShiftModal/OpenShiftModal.tsx";
import { CloseShiftModal } from "@/pages/POS/components/CloseShiftModal/CloseShiftModal.tsx";
import { ShiftStatusModal } from "@/pages/POS/components/ShiftStatusModal/ShiftStatusModal.tsx";
import { NewClientModal } from "@/pages/POS/components/NewClientModal/NewClientModal.tsx";
import { SaleSuccessModal } from "@/pages/POS/components/SaleSuccessModal/SaleSuccessModal.tsx";
import type { ModalsSectionProps } from "./types";

export function ModalsSection({
  showOpenShift,
  onCloseOpenShift,
  onSubmitOpenShift,
  shiftLoading,
  showCloseShift,
  onCloseCloseShift,
  onSubmitCloseShift,
  activeShift,
  shiftStats,
  aggregated,
  showShiftStatus,
  onCloseShiftStatus,
  activeShiftForStatus,
  shiftStatsForStatus,
  showNewClient,
  onCloseNewClient,
  onSubmitNewClient,
  savingClient,
  saleSuccess,
  onCloseSaleSuccess,
}: ModalsSectionProps) {
  return (
    <>
      <OpenShiftModal
        isOpen={showOpenShift}
        onClose={onCloseOpenShift}
        onSubmit={onSubmitOpenShift}
        loading={shiftLoading}
      />

      <CloseShiftModal
        isOpen={showCloseShift}
        onClose={onCloseCloseShift}
        onSubmit={onSubmitCloseShift}
        activeShift={activeShift}
        shiftStats={shiftStats}
        loading={shiftLoading}
        aggregated={aggregated ?? undefined}
      />

      <ShiftStatusModal
        isOpen={showShiftStatus}
        onClose={onCloseShiftStatus}
        activeShift={activeShiftForStatus}
        shiftStats={shiftStatsForStatus}
      />

      <NewClientModal
        isOpen={showNewClient}
        onClose={onCloseNewClient}
        onSubmit={onSubmitNewClient}
        loading={savingClient}
      />

      <SaleSuccessModal
        isOpen={!!saleSuccess}
        onClose={onCloseSaleSuccess}
        total={saleSuccess?.total || 0}
        change={saleSuccess?.change || 0}
      />
    </>
  );
}