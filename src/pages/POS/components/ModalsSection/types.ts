import type { CashMovementAggregated } from "../CashMovementModal/types";
import type { ReceiptData } from "../Receipt/types";

export interface ModalsSectionProps {
  showOpenShift: boolean;
  onCloseOpenShift: () => void;
  onSubmitOpenShift: (_amount: number) => Promise<void>;
  shiftLoading: boolean;

  showCloseShift: boolean;
  onCloseCloseShift: () => void;
  onSubmitCloseShift: (_closingAmount: number, _note?: string, _aggregated?: CashMovementAggregated) => Promise<void>;
  activeShift: { id: string; openingAmount: number } | null;
  shiftStats: { expectedCash?: number; cashTotal?: number; cashOutTotal?: number; cashInTotal?: number } | null;
  aggregated?: CashMovementAggregated;

  showShiftStatus: boolean;
  onCloseShiftStatus: () => void;
  activeShiftForStatus: { openingAmount: number; openedAt: string; id: string } | null;
  shiftStatsForStatus: { cashTotal?: number; transferTotal?: number; creditTotal?: number; salesCount?: number; productsSold?: number; avgTicket?: number; expectedCash?: number } | null;

  showNewClient: boolean;
  onCloseNewClient: () => void;
  onSubmitNewClient: (_data: { fullName: string; dni: string; phone?: string }) => Promise<void>;
  savingClient: boolean;

  saleSuccess: { total: number; change: number } | null;
  onCloseSaleSuccess: () => void;
  onConfirmSaleSuccess: () => void;

  showReceipt: boolean;
  receiptData: ReceiptData | null;
  onCloseReceipt: () => void;
  onConfirmReceipt: () => void;
}