import type { NoShiftViewProps } from "./types";

export function NoShiftView({ onOpenShift, onLogout }: NoShiftViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning-50 mb-4">
          <svg className="w-8 h-8 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">No hay turno de caja abierto</h2>
        <p className="text-neutral-500 mb-6">Debe abrir un turno para comenzar a vender</p>
        <button
          onClick={onOpenShift}
          className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
        >
          Abrir turno de caja
        </button>
        <button
          onClick={onLogout}
          className="ml-3 px-6 py-3 rounded-xl bg-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-300 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}