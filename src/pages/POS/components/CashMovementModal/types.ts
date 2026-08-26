export type CashMovementCategory = 'lunch' | 'supplies' | 'personal_withdrawal' | 'change' | 'expense' | 'other';
export type CashMovementType = 'in' | 'out';

export interface CashMovement {
  id: string;
  cashShift: string;
  seller: string;
  type: CashMovementType;
  category: CashMovementCategory;
  amount: number;
  description: string;
  createdAt: string;
}

export interface CashMovementAggregated {
  cashInTotal: number;
  cashOutTotal: number;
  netMovements: number;
  movementsCount: number;
  byCategory: Record<CashMovementCategory, { in: number; out: number; count: number }>;
}

export interface CashMovementFormData {
  type: CashMovementType;
  category: CashMovementCategory;
  amount: string;
  description: string;
}

export interface CashMovementSubmitData {
  type: CashMovementType;
  category: CashMovementCategory;
  amount: number;
  description: string;
}

export interface CashMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CashMovementSubmitData) => Promise<void>;
  loading: boolean;
}

export const CASH_MOVEMENT_CATEGORIES: {
  value: CashMovementCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: 'lunch', label: 'Almuerzo/Comida', icon: 'restaurant', color: 'orange' },
  { value: 'supplies', label: 'Insumos/Limpieza', icon: 'shopping_basket', color: 'blue' },
  { value: 'personal_withdrawal', label: 'Retiro personal', icon: 'person', color: 'purple' },
  { value: 'change', label: 'Cambio (romper billetes)', icon: 'swap_horiz', color: 'green' },
  { value: 'expense', label: 'Gasto operativo', icon: 'receipt', color: 'teal' },
  { value: 'other', label: 'Otro', icon: 'more_horiz', color: 'grey' },
];