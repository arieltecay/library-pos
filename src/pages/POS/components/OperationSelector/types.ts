import type { OperationMode } from "../../hooks/types";

export interface OperationSelectorProps {
  operation: OperationMode;
  onChange: (op: OperationMode) => void;
  disabled?: boolean;
}