import { OpenShiftModal } from "@/pages/POS/components/OpenShiftModal/OpenShiftModal.tsx";
import { CloseShiftModal } from "@/pages/POS/components/CloseShiftModal/CloseShiftModal.tsx";
import { ShiftStatusModal } from "@/pages/POS/components/ShiftStatusModal/ShiftStatusModal.tsx";
import { NewClientModal } from "@/pages/POS/components/NewClientModal/NewClientModal.tsx";
import { SaleSuccessModal } from "@/pages/POS/components/SaleSuccessModal/SaleSuccessModal.tsx";
import type { CashMovementAggregated } from "@/pages/POS/components/CashMovementModal/types.ts";

interface ModalsSectionProps {
  showOpenShift: boolean;
  onCloseOpenShift: () => void;
  onSubmitOpenShift: (amount: number) => Promise<void>;
  shiftLoading: boolean;

  showCloseShift: boolean;
  onCloseCloseShift: () => void;
  onSubmitCloseShift: (closingAmount: number, note?: string, aggregated?: CashMovementAggregated) => Promise<void>;
  activeShift: { id: string; openingAmount: number } | null;
  shiftStats: { expectedCash?: number; cashTotal?: number; cashOutTotal?: number; cashInTotal?: number } | null;
  aggregated?: CashMovementAggregated;

  showShiftStatus: boolean;
  onCloseShiftStatus: () => void;
  activeShiftForStatus: { openingAmount: number; openedAt: string; id: string } | null;
  shiftStatsForStatus: { cashTotal?: number; transferTotal?: number; creditTotal?: number; salesCount?: number; productsSold?: number; avgTicket?: number; expectedCash?: number } | null;

  showNewClient: boolean;
  onCloseNewClient: () => void;
  onSubmitNewClient: (data: { fullName: string; dni: string; phone?: string }) => Promise<void>;
  savingClient: boolean;

  saleSuccess: { total: number; change: number } | null;
  onCloseSaleSuccess: () => void;
}

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