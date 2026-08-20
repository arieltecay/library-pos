import { useState } from "react";
import { CartItem } from "../CartItem/CartItem";
import type { CartProps } from "./types";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-neutral-400">
      <svg className="w-14 h-14 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p className="text-base font-medium">Agregue productos al carrito</p>
      <p className="text-sm">Use la búsqueda (F2) o los accesos rápidos arriba</p>
    </div>
  );
}

function CartHeader() {
  return (
    <div className="grid grid-cols-[130px_1fr_90px_110px_36px] gap-2 px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wide border-b border-neutral-100">
      <span>Cant</span>
      <span>Productos</span>
      <span className="text-right">Precio</span>
      <span className="text-right">Total</span>
      <span></span>
    </div>
  );
}

function ClearConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="mt-2 flex gap-2">
      <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-danger-600 text-white text-sm font-medium hover:bg-danger-700">
        Confirmar
      </button>
      <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-300">
        Cancelar
      </button>
    </div>
  );
}

export function Cart({ cart, onUpdateQuantity, onRemove, onClear }: CartProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="flex-1 bg-white border border-neutral-200 rounded-xl overflow-y-auto flex flex-col">
      <div className="p-2">
        <CartHeader />
        <div className="p-2">
          {cart.map((item) => (
            <CartItem key={item.product} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />
          ))}
        </div>
      </div>
      <div className="border-t border-neutral-200 p-3">
        <button onClick={() => setShowClearConfirm(true)} className="w-full py-2 rounded-lg bg-danger-100 text-danger-600 text-sm font-medium hover:bg-danger-200 transition-colors">
          Limpiar carrito
        </button>
        {showClearConfirm && <ClearConfirmDialog onConfirm={() => { onClear(); setShowClearConfirm(false); }} onCancel={() => setShowClearConfirm(false)} />}
      </div>
    </div>
  );
}