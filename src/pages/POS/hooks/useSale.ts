import { useState, useCallback } from "react";
import api from "../../../api/client";
import type { UseSaleResult } from "./types";

export function useSale(): UseSaleResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = useCallback(async (params: {
    items: { product: string; quantity: number }[];
    clientId?: string;
    discount: number;
    paymentMethod: "cash" | "transfer" | "credit";
    amountReceived: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/sales", {
        items: params.items,
        clientId: params.clientId,
        discount: params.discount,
        paymentMethod: params.paymentMethod,
        amountReceived:
          params.paymentMethod === "cash" || params.paymentMethod === "transfer"
            ? params.amountReceived
            : undefined,
      });
      return { total: data.sale.total, change: data.sale.change };
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al procesar la venta";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkout, loading, error };
}