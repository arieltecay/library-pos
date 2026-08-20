import type { CashShift } from "../types";
import type { CashMovementAggregated } from "../CashMovementModal/types";

export type { CashMovementAggregated };

export interface CloseShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    closingAmount: number,
    note?: string,
    aggregated?: CashMovementAggregated
  ) => Promise<void>;
  activeShift: Pick<CashShift, "openingAmount" | "id"> | null;
  shiftStats: { expectedCash?: number; cashTotal?: number; cashOutTotal?: number; cashInTotal?: number } | null;
  loading?: boolean;
  aggregated?: CashMovementAggregated;
}