import type { CashShift } from "../types";

export interface ShiftStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeShift: Pick<CashShift, "openingAmount" | "openedAt" | "id"> | null;
  shiftStats: {
    cashTotal?: number;
    transferTotal?: number;
    creditTotal?: number;
    salesCount?: number;
    productsSold?: number;
    avgTicket?: number;
    expectedCash?: number;
  } | null;
}