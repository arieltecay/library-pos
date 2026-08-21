import { ClientPicker } from "@/pages/POS/components/ClientPicker/ClientPicker.tsx";
import type { ClientSectionProps } from "./types";

export function ClientSection({ selectedClient, onSelectClient, onNewClient }: ClientSectionProps) {
  return (
    <div>
      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Cliente</span>
      <div className="flex items-center gap-2 mt-1.5">
        <ClientPicker
          selected={selectedClient}
          onSelect={onSelectClient}
          onNewClient={onNewClient}
        />
        <button
          onClick={onNewClient}
          className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Nuevo
          <kbd className="text-xs bg-white/20 px-1.5 py-0.5 rounded">F8</kbd>
        </button>
      </div>
    </div>
  );
}