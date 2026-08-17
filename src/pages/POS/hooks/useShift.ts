import { useState, useEffect, useCallback, useRef } from "react";
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
  const isMountedRef = useRef(true);

  const fetchActiveShift = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/cash-shifts/active");
      console.log("[useShift] API response:", data);
      if (isMountedRef.current) {
        setActiveShift(data.cashShift);
        setShiftStats(data.aggregated);
      }
    } catch (err: any) {
      console.error("[useShift] Error fetching active shift:", err);
      if (isMountedRef.current) {
        setError(err.response?.data?.message || "Error al cargar turno");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const openShift = useCallback(async (openingAmount: number) => {
    setError(null);
    try {
      await api.post("/cash-shifts/open", { openingAmount });
      await fetchActiveShift(false);
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
    fetchActiveShift(true);
    // Poll every 10 seconds to keep shift stats updated
    const interval = setInterval(() => fetchActiveShift(false), 10000);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchActiveShift]);

  return {
    activeShift,
    shiftStats,
    loading,
    error,
    openShift,
    closeShift,
    refetch: () => fetchActiveShift(false),
  };
}