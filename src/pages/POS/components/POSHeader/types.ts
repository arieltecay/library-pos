import type { CashShift } from "../../../../types";

export interface POSHeaderProps {
  activeShift: Pick<CashShift, "id" | "openingAmount" | "openedAt"> | null;
  shiftStats: { expectedCash?: number } | null;
  onOpenShift: () => void;
  onCloseShift: () => void;
  onShiftStatus: () => void;
  onLogout: () => void;
}