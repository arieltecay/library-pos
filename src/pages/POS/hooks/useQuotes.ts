import { useState, useCallback } from "react";
import api from "../../../api/client";
import type { UseQuotesResult, QuoteLean } from "./types";

export function useQuotes(): UseQuotesResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuote = useCallback(async (params: {
    items: { product: string; quantity: number }[];
    clientId?: string;
    discount: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/quotes", {
        items: params.items,
        clientId: params.clientId,
        discount: params.discount,
      });
      return data.quote as QuoteLean;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al generar el presupuesto";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createQuote, loading, error };
}