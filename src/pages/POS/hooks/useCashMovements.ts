import { useState, useCallback, useEffect } from 'react';
import api from '../../../api/client';
import type { CashMovement, CashMovementAggregated, CashMovementType, CashMovementCategory } from '../components/CashMovementModal/types';

interface UseCashMovementsResult {
  movements: CashMovement[];
  aggregated: CashMovementAggregated | null;
  loading: boolean;
  error: string | null;
  createMovement: (data: {
    type: CashMovementType;
    category: CashMovementCategory;
    amount: number;
    description: string;
  }) => Promise<void>;
  fetchMovements: () => Promise<void>;
  fetchAggregated: () => Promise<void>;
}

export function useCashMovements(shiftId: string | null): UseCashMovementsResult {
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [aggregated, setAggregated] = useState<CashMovementAggregated | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    if (!shiftId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/cash-shifts/${shiftId}/movements`);
      setMovements(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  }, [shiftId]);

  const fetchAggregated = useCallback(async () => {
    if (!shiftId) return;
    try {
      const { data } = await api.get(`/cash-shifts/${shiftId}/movements/aggregated`);
      setAggregated(data);
    } catch (err: any) {
      console.error('[useCashMovements] Error fetching aggregated:', err);
    }
  }, [shiftId]);

  // Auto-fetch on mount and when shiftId changes
  useEffect(() => {
    if (shiftId) {
      fetchMovements();
      fetchAggregated();
    }
  }, [shiftId, fetchMovements, fetchAggregated]);

  const createMovement = useCallback(async (movementData: {
    type: CashMovementType;
    category: CashMovementCategory;
    amount: number;
    description: string;
  }) => {
    if (!shiftId) throw new Error('No hay turno activo');
    setError(null);
    try {
      await api.post(`/cash-shifts/${shiftId}/movements`, movementData);
      await fetchMovements();
      await fetchAggregated();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al registrar movimiento';
      setError(message);
      throw new Error(message);
    }
  }, [shiftId, fetchMovements, fetchAggregated]);

  return {
    movements,
    aggregated,
    loading,
    error,
    createMovement,
    fetchMovements,
    fetchAggregated,
  };
}