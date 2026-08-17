import { Modal } from "../Modal/Modal";
import type { ShiftStatusModalProps } from "./types";

export function ShiftStatusModal({
  isOpen,
  onClose,
  activeShift,
  shiftStats,
}: ShiftStatusModalProps) {
  if (!activeShift) return null;

  return (
    <Modal title="Estado del turno" isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-2">
        <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
          <span className="text-neutral-500">Apertura</span>
          <span className="font-semibold">
            {new Date(activeShift.openedAt).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
          <span className="text-neutral-500">Monto inicial</span>
          <span className="font-semibold">${activeShift.openingAmount.toLocaleString("es-AR")}</span>
        </div>
        {shiftStats && (
          <>
            <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Ventas realizadas</span>
              <span className="font-semibold">{shiftStats.salesCount}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Efectivo</span>
              <span className="font-semibold">${shiftStats.cashTotal?.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Transferencias</span>
              <span className="font-semibold">${shiftStats.transferTotal?.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Crédito</span>
              <span className="font-semibold">${shiftStats.creditTotal?.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-neutral-500">Efectivo esperado en caja</span>
              <span className="font-bold text-primary-600">${shiftStats.expectedCash?.toLocaleString("es-AR")}</span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}