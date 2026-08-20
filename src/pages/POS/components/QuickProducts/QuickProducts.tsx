import type { QuickProductsProps } from "./types";

export function QuickProducts({ products, onAddProduct }: QuickProductsProps) {
  const quickProducts = products
    .filter((p) => p.active && p.type === "service")
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 5);

  if (quickProducts.length === 0) return null;

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
      {quickProducts.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddProduct(product)}
          className="flex-shrink-0 px-4 py-1.5 rounded-full bg-white border border-neutral-300 hover:border-primary-400 hover:shadow-sm transition-all text-sm text-neutral-700"
        >
          {product.name} <span className="font-semibold text-neutral-900">${product.price.toLocaleString("es-AR")}</span>
        </button>
      ))}
    </div>
  );
}