import { useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "../Modal/Modal";
import type { CloseShiftModalProps } from "./types";

export function CloseShiftModal({
  isOpen,
  onClose,
  onSubmit,
  activeShift,
  shiftStats,
  loading,
  aggregated,
}: CloseShiftModalProps) {
  const [closingAmount, setClosingAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(closingAmount);
    if (isNaN(amount) || amount < 0) {
      alert("Debe ingresar un monto final válido");
      return;
    }
    const cashInTotal = aggregated?.cashInTotal ?? 0;
    const cashOutTotal = aggregated?.cashOutTotal ?? 0;
    const netMovements = aggregated?.netMovements ?? 0;
    await onSubmit(amount, note.trim() || undefined, {
      cashInTotal,
      cashOutTotal,
      netMovements,
      movementsCount: aggregated?.movementsCount ?? 0,
      byCategory: aggregated?.byCategory ?? {
        lunch: { in: 0, out: 0, count: 0 },
        supplies: { in: 0, out: 0, count: 0 },
        personal_withdrawal: { in: 0, out: 0, count: 0 },
        change: { in: 0, out: 0, count: 0 },
        expense: { in: 0, out: 0, count: 0 },
        other: { in: 0, out: 0, count: 0 },
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  if (!activeShift) return null;

  return (
    <Modal title="Cerrar turno de caja" isOpen={isOpen} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Monto inicial</span>
            <span className="font-semibold">{activeShift.openingAmount.toLocaleString("es-AR")}</span>
          </div>
          {shiftStats && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Efectivo esperado (sin movimientos)</span>
              <span className="font-semibold">
                ${shiftStats.expectedCash?.toLocaleString("es-AR")}
              </span>
            </div>
          )}
          {/* Nueva sección: Resumen de movimientos */}
          {aggregated && (
            <div className="mt-3 p-3 rounded-xl bg-primary-50 border border-primary-200">
              <div className="flex justify-between text-xs text-primary-600 mb-1">
                <span>Salidas (−)</span>
                <span>{aggregated.cashOutTotal.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between text-xs text-success-600 mb-1">
                <span>Entradas (+)</span>
                <span>{aggregated.cashInTotal.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span>Neto esperado</span>
                <span>
                  {aggregated.netMovements >= 0 ? "+" : ""}{aggregated.netMovements.toLocaleString(
                    "es-AR"
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700 block mb-1">Monto final (conteo físico)</label>
          <input
            type="number"
            min={0}
            value={closingAmount}
            onChange={(e) => setClosingAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none"
            placeholder="0"
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700 block mb-1">Nota (opcional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none"
            placeholder="Diferencia, observaciones..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-warning-600 text-white font-semibold hover:bg-warning-700 transition-colors disabled:opacity-40"
        >
          {loading ? "Cerrando..." : "Cerrar turno"}
        </button>
      </form>
    </Modal>
  );
}