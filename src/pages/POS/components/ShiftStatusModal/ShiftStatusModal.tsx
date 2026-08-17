import { Modal } from "../Modal/Modal";
import type { ShiftStatusModalProps } from "./types";

export function ShiftStatusModal({
  isOpen,
  onClose,
  activeShift,
  shiftStats,
}: ShiftStatusModalProps) {
  if (!activeShift) return null;

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "$0";
    return `$${value.toLocaleString("es-AR")}`;
  };

  return (
    <Modal title="Estado del turno" isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-2">
        <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
          <span className="text-neutral-500">Apertura</span>
          <span className="font-semibold">
            {activeShift.openedAt
              ? new Date(activeShift.openedAt).toLocaleString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </span>
        </div>
        <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
          <span className="text-neutral-500">Monto inicial</span>
          <span className="font-semibold">{formatCurrency(activeShift.openingAmount)}</span>
        </div>
        {shiftStats && (
          <>
            <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Ventas realizadas</span>
              <span className="font-semibold">{shiftStats.salesCount ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Efectivo</span>
              <span className="font-semibold">{formatCurrency(shiftStats.cashTotal)}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Transferencias</span>
              <span className="font-semibold">{formatCurrency(shiftStats.transferTotal)}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Crédito</span>
              <span className="font-semibold">{formatCurrency(shiftStats.creditTotal)}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-neutral-500">Efectivo esperado en caja</span>
              <span className="font-bold text-primary-600">{formatCurrency(shiftStats.expectedCash)}</span>
            </div>
          </>
        )}
        {!shiftStats && (
          <div className="text-center text-sm text-neutral-500 py-4">
            Sin datos de ventas para este turno
          </div>
        )}
      </div>
    </Modal>
  );
}