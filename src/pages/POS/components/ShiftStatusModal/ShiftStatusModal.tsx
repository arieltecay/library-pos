import { useState, useMemo } from 'react';
import { useCashMovements } from "../../hooks/useCashMovements";
import { Modal } from "../Modal/Modal";
import type { ShiftStatusModalProps } from "./types";
import type { CashMovement } from "../CashMovementModal/types";

export function ShiftStatusModal({
  isOpen,
  onClose,
  activeShift,
  shiftStats,
}: ShiftStatusModalProps) {
  const { movements } = useCashMovements(
    activeShift?.id ?? null
  );
  const [movementsOpen, setMovementsOpen] = useState(false);

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "$0";
    return `$${value.toLocaleString("es-AR")}`;
  };

  const openingAmount = activeShift?.openingAmount ?? 0;

  // Calcular totales de movimientos para el display (memoized)
  const { cashInTotal, cashOutTotal, netMovements } = useMemo(() => {
    const out = movements
      .filter((m: CashMovement) => m.type === "out")
      .reduce((sum, m) => sum + m.amount, 0);
    const inn = movements
      .filter((m: CashMovement) => m.type === "in")
      .reduce((sum, m) => sum + m.amount, 0);
    return { cashInTotal: inn, cashOutTotal: out, netMovements: inn - out };
  }, [movements]);

  return (
    <Modal title="Estado del turno" isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-2">
        <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
          <span className="text-neutral-500">Apertura</span>
          <span className="font-semibold">
            {activeShift?.openedAt
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
          <span className="font-semibold">{formatCurrency(openingAmount)}</span>
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
        {/* Nueva sección: Movimientos de Caja */}
        {movementsOpen && (
          <div className="px-4 pb-4">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="font-medium text-neutral-700">Movimientos de Caja</span>
              <button
                onClick={() => setMovementsOpen(false)}
                className="text-xs text-primary-600 hover:underline"
              >
                Cerrar
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {movements.length === 0 ? (
                <div className="text-center text-sm text-neutral-500 py-4">
                  Sin movimientos registrados
                </div>
              ) : (
                movements.map((mov: CashMovement, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm px-2 py-1.5 border-b border-neutral-100 last:border-0"
                  >
                    <span className="text-neutral-500">
                      {mov.type === "out" ? "Salida" : "Entrada"}
                      {mov.category ? ` - ${mov.category}` : ""}
                    </span>
                    <span className="font-semibold">
                      {mov.type === "out" ? "−" : "+"} ${mov.amount.toLocaleString(
                        "es-AR"
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="pt-3 border-t border-neutral-100">
              <div className="flex justify-between text-sm font-medium">
                <span>Neto movimientos</span>
                <span className={netMovements >= 0 ? "text-primary-600" : "text-danger-600"}>
                  {netMovements >= 0 ? "+" : ""} ${netMovements.toLocaleString(
                    "es-AR"
                  )}
                </span>
              </div>
              {cashInTotal > 0 && cashOutTotal > 0 && (
                <div className="mt-1 text-xs text-neutral-500">
                  (+${cashInTotal.toLocaleString("es-AR")} Entradas, −${cashOutTotal.toLocaleString(
                    "es-AR"
                  )} Salidas)
                </div>
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => setMovementsOpen(true)}
          className="mt-2 text-sm text-primary-600 hover:underline"
          aria-label="Ver movimientos de caja"
        >
          {movements.length > 0 ? `Ver ${movements.length} movimiento(s)` : "Agregar movimiento de caja"}
        </button>
      </div>
    </Modal>
  );
}