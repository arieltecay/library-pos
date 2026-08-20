import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '../Modal/Modal';
import type { CashMovementModalProps, CashMovementFormData, CashMovementCategory } from './types';
import { CASH_MOVEMENT_CATEGORIES } from './types';

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
    amount: 0,
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CashMovementFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ type: 'out', category: 'lunch', amount: 0, description: '' });
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CashMovementFormData, string>> = {};

    if (formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.description.trim() || formData.description.trim().length < 3) {
      newErrors.description = 'Descripción obligatoria (mínimo 3 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      type: formData.type,
      category: formData.category,
      amount: formData.amount,
      description: formData.description.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <Modal title="Registrar Movimiento de Caja" isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        <div className="flex gap-4">
          <label className="flex-1 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-neutral-600">Tipo</span>
            <div className="flex gap-2" role="radiogroup" aria-label="Tipo de movimiento">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: opt.value }))}
                  className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.type === opt.value
                      ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700`
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                  aria-pressed={formData.type === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1.5">Categoría</label>
          <select
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as CashMovementCategory }))}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:outline-none bg-white"
          >
            {CASH_MOVEMENT_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">Monto</label>
            <input
              type="number"
              min="1"
              value={formData.amount}
              onChange={e => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.amount ? 'border-danger-500' : 'border-neutral-200'
              } focus:border-primary-500 focus:outline-none`}
              placeholder="0"
              autoFocus
            />
            {errors.amount && <p className="mt-1 text-xs text-danger-600">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">Fecha</label>
            <input
              type="date"
              value={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 cursor-not-allowed"
              readOnly
            />
            <p className="mt-1 text-xs text-neutral-400">Hoy: {new Date().toLocaleDateString('es-AR')}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1.5">Descripción <span className="text-danger-500">*</span></label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.description ? 'border-danger-500' : 'border-neutral-200'
            } focus:border-primary-500 focus:outline-none resize-none`}
            placeholder="Ej: Almuerzo equipo, Compra insumos, Retiro personal..."
            maxLength={500}
          />
          {errors.description && <p className="mt-1 text-xs text-danger-600">{errors.description}</p>}
          <p className="mt-1 text-xs text-neutral-400 text-right">{formData.description.length}/500</p>
        </div>

        <div className="bg-neutral-50 rounded-xl p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Impacto en arqueo:</span>
            <span className={`font-semibold ${formData.type === 'out' ? 'text-danger-600' : 'text-success-600'}`}>
              {formData.type === 'out' ? '−' : '+'} ${formData.amount.toLocaleString('es-AR')}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {formData.type === 'out'
              ? 'Resta del efectivo esperado en el cierre de turno'
              : 'Suma al efectivo esperado en el cierre de turno'}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-40"
        >
          {loading ? 'Registrando...' : 'Registrar movimiento'}
        </button>
      </form>
    </Modal>
  );
}