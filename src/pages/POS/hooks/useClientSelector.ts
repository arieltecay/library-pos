import { useCallback } from "react";
import type { Client } from "../components/types";

export interface ClientSelectorDeps {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  createClient: (data: { fullName: string; dni: string; phone?: string }) => Promise<Client>;
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
  closeNewClientModal: () => void;
  setSavingClient: (loading: boolean) => void;
}

export function useClientSelector(deps: ClientSelectorDeps) {
  const { selectedClient, setSelectedClient, createClient, showError, showSuccess, closeNewClientModal, setSavingClient } = deps;

  const handleCreateClient = useCallback(async (data: { fullName: string; dni: string; phone?: string }) => {
    if (!data.fullName.trim() || data.fullName.trim().length < 2) {
      showError("Ingrese el nombre del cliente");
      return;
    }
    if (!data.dni.trim()) {
      showError("Ingrese el DNI del cliente");
      return;
    }
    setSavingClient(true);
    try {
      const client = await createClient({
        fullName: data.fullName.trim(),
        dni: data.dni.trim(),
        phone: data.phone?.trim() || undefined,
      });
      setSelectedClient(client);
      closeNewClientModal();
      showSuccess("Cliente creado");
    } catch (err: any) {
      showError(err.response?.data?.message || "Error al crear el cliente");
    } finally {
      setSavingClient(false);
    }
  }, [createClient, setSelectedClient, closeNewClientModal, showError, showSuccess, setSavingClient]);

  return { handleCreateClient };
}