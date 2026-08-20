import { useState, useCallback } from "react";
import api from "../../../api/client";
import type { UseClientResult } from "./types";

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

  const listClients = useCallback(async (params?: { search?: string; page?: number; limit?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set("search", params.search);
      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());
      
      const { data } = await api.get(`/clients?${queryParams.toString()}`);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar clientes";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchClients = useCallback(async (query: string) => {
    if (!query.trim()) return [];
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/clients", { 
        params: { search: query, limit: 10, page: 1 } 
      });
      return data.items || [];
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al buscar clientes";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createClient, listClients, searchClients, loading, error };
}