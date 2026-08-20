import type { Client } from "@/pages/POS/components/types";

export interface ClientPickerProps {
  selected: Client | null;
  onSelect: (client: Client | null) => void;
  onNewClient: () => void;
}