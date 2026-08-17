import type { CashShift } from "../../../../types";

export interface CloseShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (closingAmount: number, note?: string) => Promise<void>;
  activeShift: Pick<CashShift, "openingAmount" | "id"> | null;
  shiftStats: { expectedCash?: number } | null;
  loading?: boolean;
}