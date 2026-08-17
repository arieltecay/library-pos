import { useState, useRef, useEffect } from "react";
import api from "../../api/client";
import type { Client } from "../../types";

interface ClientPickerProps {
  selected: Client | null;
  onSelect: (client: Client | null) => void;
  onNewClient: () => void;
}

export default function ClientPicker({ selected, onSelect, onNewClient }: ClientPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open || search.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/clients", {
          params: { search, limit: 8 },
        });
        setResults(data.items);
      } catch (err) {
        console.error("Error searching clients:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, open]);

  function handleSelect(client: Client) {
    onSelect(client);
    setOpen(false);
    setSearch("");
  }

  function handleClear() {
    onSelect(null);
    setSearch("");
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <button
        onClick={() => {
          setOpen(!open);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-primary-400 transition-colors text-left"
      >
        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="flex-1 text-sm font-medium text-neutral-900 truncate">
          {selected ? selected.fullName : "Consumidor Final"}
        </span>
        {selected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="shrink-0 text-neutral-400 hover:text-neutral-600"
            aria-label="Quitar cliente"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-neutral-200 z-40 overflow-hidden">
          <div className="p-2 border-b border-neutral-100">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            <button
              onClick={() => {
                onSelect(null);
                setOpen(false);
                setSearch("");
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 text-sm font-medium text-neutral-900 border-b border-neutral-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Consumidor Final
            </button>

            {loading && (
              <div className="px-4 py-3 text-sm text-neutral-500 text-center">Buscando...</div>
            )}

            {!loading && search.length >= 2 && results.length === 0 && (
              <div className="px-4 py-3 text-sm text-neutral-500 text-center">Sin resultados</div>
            )}

            {results.map((client) => (
              <button
                key={client.id}
                onClick={() => handleSelect(client)}
                className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 text-sm border-b border-neutral-100 last:border-0"
              >
                <div className="font-medium text-neutral-900">{client.fullName}</div>
                <div className="text-xs text-neutral-500 flex items-center justify-between">
                  <span>DNI: {client.dni}</span>
                  {client.balance > 0 && (
                    <span className="text-warning-600 font-semibold">
                      Debe ${client.balance.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>
              </button>
            ))}

            <button
              onClick={() => {
                onNewClient();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-primary-50 text-sm font-medium text-primary-700 flex items-center gap-2 border-t border-neutral-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Nuevo cliente
              <kbd className="ml-auto text-xs bg-neutral-100 px-1.5 py-0.5 rounded">F8</kbd>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
