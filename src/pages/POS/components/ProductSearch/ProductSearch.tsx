import { useState, useEffect, useRef } from "react";
import type { Product, ProductSearchProps } from "./types";

export function ProductSearch({
  products,
  search,
  onSearchChange,
  onAddProduct,
  disabled,
}: ProductSearchProps) {
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products
    .filter((p) => p.active && p.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredProducts.length > 0) {
      e.preventDefault();
      onAddProduct(filteredProducts[0]);
      onSearchChange("");
      setShowResults(false);
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleFocus = () => {
    if (search.trim()) setShowResults(true);
  };

  return (
    <div className="flex-1 relative" ref={resultsRef}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500">Buscar producto / servicio</span>
        <kbd className="text-xs bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-200">F2</kbd>
      </div>
      <div className="relative mt-1.5">
        <svg className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          id="product-search"
          type="text"
          placeholder="Nombre del producto o servicio..."
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowResults(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredProducts.length > 0) {
              e.preventDefault();
              onAddProduct(filteredProducts[0]);
              onSearchChange("");
              setShowResults(false);
            }
          }}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          disabled={disabled}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:border-primary-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {showResults && search && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-neutral-200 z-40 overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="px-4 py-3 text-sm text-neutral-500 text-center">No se encontraron productos</div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onAddProduct(product);
                  onSearchChange("");
                  setShowResults(false);
                }}
                disabled={product.type === "product" && product.stock === 0}
                className="w-full text-left px-4 py-2.5 hover:bg-primary-50 text-sm border-b border-neutral-100 last:border-0 flex items-center justify-between gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="font-medium text-neutral-900 truncate">{product.name}</span>
                <span className="flex items-center gap-3 shrink-0">
                  {product.type === "product" && (
                    <span className={`text-xs ${product.stock <= (product.minStock ?? 5) ? "text-warning-600" : "text-neutral-400"}`}>
                      Stock: {product.stock}
                    </span>
                  )}
                  <span className="font-bold text-primary-600">${product.price.toLocaleString("es-AR")}</span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}