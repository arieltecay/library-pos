import { useEffect } from "react";
import { Modal } from "../Modal/Modal";
import type { SaleSuccessModalProps } from "./types";

export function SaleSuccessModal({ isOpen, onClose, onConfirm, total, change }: SaleSuccessModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      } else if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  return (
    <Modal title="" isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-50 mb-4">
          <svg className="w-8 h-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">¡Venta exitosa!</h2>
        <p className="text-lg text-neutral-700 font-semibold mb-1">${total.toLocaleString("es-AR")}</p>
        {change > 0 && (
          <p className="text-sm text-neutral-500">Vuelto: ${change.toLocaleString("es-AR")}</p>
        )}
        <button
          onClick={onConfirm}
          className="mt-6 w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </Modal>
  );
}