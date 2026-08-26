import type { CashShift, ShiftAggregated } from "../types";

export interface ShiftStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeShift: Pick<CashShift, "openingAmount" | "openedAt" | "id"> | null;
  shiftStats: ShiftAggregated | null;
}