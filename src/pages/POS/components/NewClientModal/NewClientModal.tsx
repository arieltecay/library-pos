import { useState } from "react";
import { Modal } from "../Modal/Modal";
import type { NewClientModalProps } from "./types";

export function NewClientModal({ isOpen, onClose, onSubmit, loading }: NewClientModalProps) {
  const [form, setForm] = useState({ fullName: "", dni: "", phone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ fullName: form.fullName.trim(), dni: form.dni.trim(), phone: form.phone.trim() || undefined });
  };

  return (
    <Modal title="Nuevo cliente" isOpen={isOpen} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-neutral-700 block mb-1">Nombre completo</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none"
            placeholder="Ej: María González"
            autoFocus
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700 block mb-1">DNI</label>
          <input
            type="text"
            value={form.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none"
            placeholder="Ej: 30123456"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700 block mb-1">Teléfono (opcional)</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none"
            placeholder="Ej: 3415551234"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "Guardando..." : "Crear cliente"}
        </button>
      </form>
    </Modal>
  );
}