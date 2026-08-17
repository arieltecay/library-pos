import type { Client } from "../../../../types";

export interface ClientPickerProps {
  selected: Client | null;
  onSelect: (client: Client | null) => void;
  onNewClient: () => void;
}

export type { Client };