import type { Client } from "../types";

export interface ClientSectionProps {
  selectedClient: Client | null;
  onSelectClient: (_client: Client | null) => void;
  onNewClient: () => void;
}