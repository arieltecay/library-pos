import type { CashShift } from "../types";
import type { CashMovementType, CashMovementCategory } from "../CashMovementModal/types";
import type { OperationMode } from "../../hooks/types";

export interface POSHeaderProps {
  activeShift: Pick<CashShift, "id" | "openingAmount" | "openedAt"> | null;
  onCloseShift: () => void;
  onShiftStatus: () => void;
  onLogout: () => void;
  onCashMovement: (data: {
    type: CashMovementType;
    category: CashMovementCategory;
    amount: number;
    description: string;
  }) => Promise<void>;
  operation: OperationMode;
  setOperation: (op: OperationMode) => void;
}