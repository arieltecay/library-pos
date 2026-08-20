import { useCallback } from "react";
import type { CashMovementAggregated } from "../components/CashMovementModal/types";

export interface ShiftManagerDeps {
  activeShift: { id: string } | null;
  openShift: (amount: number) => Promise<void>;
  closeShift: (closingAmount: number, note?: string, aggregated?: CashMovementAggregated) => Promise<void>;
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
  closeOpenShiftModal: () => void;
  closeCloseShiftModal: () => void;
}

export function useShiftManager(deps: ShiftManagerDeps) {
  const { activeShift, openShift, closeShift, showError, showSuccess, closeOpenShiftModal, closeCloseShiftModal } = deps;

  const handleOpenShift = useCallback(async (amount: number) => {
    try {
      if (isNaN(amount) || amount <= 0) {
        showError("Debe ingresar un monto inicial mayor a 0");
        return;
      }
      await openShift(amount);
      closeOpenShiftModal();
      showSuccess("Turno de caja abierto");
    } catch (err: any) {
      showError(err.response?.data?.message || "Error al abrir turno de caja");
    }
  }, [openShift, closeOpenShiftModal, showError, showSuccess]);

  const handleCloseShift = useCallback(async (closingAmount: number, note?: string, aggregated?: CashMovementAggregated) => {
    if (!activeShift) return;
    try {
      if (isNaN(closingAmount) || closingAmount < 0) {
        showError("Debe ingresar un monto final válido");
        return;
      }
      await closeShift(closingAmount, note, aggregated);
      closeCloseShiftModal();
      showSuccess("Turno de caja cerrado");
    } catch (err: any) {
      showError(err.response?.data?.message || "Error al cerrar turno de caja");
    }
  }, [activeShift, closeShift, closeCloseShiftModal, showError, showSuccess]);

  return { handleOpenShift, handleCloseShift };
}