import { useState } from "react";
import { Modal } from "../Modal/Modal";
import type { OpenShiftModalProps } from "./types";

export function OpenShiftModal({ isOpen, onClose, onSubmit, loading }: OpenShiftModalProps) {
  const [openingAmount, setOpeningAmount] = useState("");

  const handleSubmit = async (_e: React.FormEvent) => {
    const amount = parseFloat(openingAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Debe ingresar un monto inicial mayor a 0");
      return;
    }
    await onSubmit(amount);
  };

  return (
    <Modal title="Abrir turno de caja" isOpen={isOpen} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-neutral-700 block mb-1">Monto inicial</label>
          <input
            type="number"
            min={0}
            value={openingAmount}
            onChange={(e) => setOpeningAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none"
            placeholder="0"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-40"
        >
          {loading ? "Abriendo..." : "Abrir turno"}
        </button>
      </form>
    </Modal>
  );
}