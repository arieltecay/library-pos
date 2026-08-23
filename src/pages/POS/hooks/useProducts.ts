import { useState, useEffect, useCallback } from "react";
import api from "../../../api/client";
import type { UseProductsResult } from "./types";

export function useProducts(limit = 100, search = ""): UseProductsResult {
  const [products, setProducts] = useState<UseProductsResult["products"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/products", { params: { limit, search } });
      setProducts(data.items);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [limit, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}