import { useState, useEffect, type FormEvent } from 'react';
import { Modal } from '../Modal/Modal';
import { CASH_MOVEMENT_CATEGORIES, type CashMovementModalProps, type CashMovementFormData, type CashMovementCategory } from './types';

const TYPE_OPTIONS = [
  { value: 'out', label: 'Salida (Gasto)', color: 'danger' },
  { value: 'in', label: 'Entrada (Ingreso)', color: 'success' },
] as const;

export function CashMovementModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: CashMovementModalProps) {
  const [formData, setFormData] = useState<CashMovementFormData>({
    type: 'out',
    category: 'lunch',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CashMovementFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ type: 'out', category: 'lunch', amount: '', description: '' });
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CashMovementFormData, string>> = {};

    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.description.trim() || formData.description.trim().length < 3) {
      newErrors.description = 'Descripción obligatoria (mínimo 3 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const amountValue = parseFloat(formData.amount);
    onSubmit({ ...formData, amount: amountValue });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Movimiento de Caja"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <label className="flex-1 flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">Tipo</span>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'in' | 'out' })}
              className="px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:outline-none"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">Categoría</span>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as CashMovementCategory })}
              className="px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:outline-none"
            >
              {CASH_MOVEMENT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Monto</span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`px-3 py-2 rounded-lg border ${errors.amount ? 'border-danger-500' : 'border-neutral-200'} focus:border-primary-500 focus:outline-none`}
            placeholder="Ingrese monto"
            inputMode="decimal"
          />
          {errors.amount && <span className="text-xs text-danger-600">{errors.amount}</span>}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Descripción</span>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`px-3 py-2 rounded-lg border ${errors.description ? 'border-danger-500' : 'border-neutral-200'} focus:border-primary-500 focus:outline-none`}
            placeholder="Motivo del movimiento..."
          />
          {errors.description && <span className="text-xs text-danger-600">{errors.description}</span>}
        </label>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}