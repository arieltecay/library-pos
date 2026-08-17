import { useState, useEffect, useCallback } from "react";
import api from "../../../api/client";
import type { CashShift, ShiftAggregated } from "../../../types";

interface UseShiftResult {
  activeShift: CashShift | null;
  shiftStats: ShiftAggregated | null;
  loading: boolean;
  error: string | null;
  openShift: (openingAmount: number) => Promise<void>;
  closeShift: (closingAmount: number, note?: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useShift(): UseShiftResult {
  const [activeShift, setActiveShift] = useState<CashShift | null>(null);
  const [shiftStats, setShiftStats] = useState<ShiftAggregated | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveShift = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/cash-shifts/active");
      console.log("[useShift] API response:", data);
      setActiveShift(data.cashShift);
      setShiftStats(data.aggregated);
    } catch (err: any) {
      console.error("[useShift] Error fetching active shift:", err);
      setError(err.response?.data?.message || "Error al cargar turno");
    } finally {
      setLoading(false);
    }
  }, []);

  const openShift = useCallback(async (openingAmount: number) => {
    setError(null);
    try {
      await api.post("/cash-shifts/open", { openingAmount });
      await fetchActiveShift();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al abrir turno");
      throw err;
    }
  }, [fetchActiveShift]);

  const closeShift = useCallback(async (closingAmount: number, note?: string) => {
    if (!activeShift) return;
    setError(null);
    try {
      await api.post(`/cash-shifts/${activeShift.id}/close`, {
        closingAmount,
        note: note || "",
      });
      setActiveShift(null);
      setShiftStats(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cerrar turno");
      throw err;
    }
  }, [activeShift]);

  useEffect(() => {
    fetchActiveShift();
  }, [fetchActiveShift]);

  return {
    activeShift,
    shiftStats,
    loading,
    error,
    openShift,
    closeShift,
    refetch: fetchActiveShift,
  };
}