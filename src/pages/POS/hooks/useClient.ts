import { useState, useCallback } from "react";
import api from "../../../api/client";
import type { Client } from "../../../types";

interface UseClientResult {
  createClient: (data: { fullName: string; dni: string; phone?: string }) => Promise<Client>;
  loading: boolean;
  error: string | null;
}

export function useClient(): UseClientResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = useCallback(async (data: { fullName: string; dni: string; phone?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data: client } = await api.post("/clients", {
        fullName: data.fullName.trim(),
        dni: data.dni.trim(),
        phone: data.phone?.trim() || undefined,
      });
      return client;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al crear el cliente";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createClient, loading, error };
}