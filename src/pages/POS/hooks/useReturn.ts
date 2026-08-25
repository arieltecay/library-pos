import { useState, useCallback } from "react";
import api from "../../../api/client";
import type { UseReturnResult, SaleLean } from "./types";

export function useReturn(): UseReturnResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReturn = useCallback(async (params: {
    items: { product: string; quantity: number }[];
    clientId?: string;
    method: "cash" | "transfer" | "credit";
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/sales/returns", {
        items: params.items,
        clientId: params.clientId,
        method: params.method,
      });
      return { sale: data.sale as SaleLean };
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al procesar la devolución";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createReturn, loading, error };
}