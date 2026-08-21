import { ProductSearch } from "@/pages/POS/components/ProductSearch/ProductSearch.tsx";
import { QuickProducts } from "@/pages/POS/components/QuickProducts/QuickProducts.tsx";
import type { ProductSectionProps } from "./types";

export function ProductSection({ products, search, onSearchChange, onAddProduct, disabled }: ProductSectionProps) {
  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <QuickProducts products={products} onAddProduct={onAddProduct} />
      </div>

      <div className="flex-1 bg-white border border-neutral-200 rounded-xl overflow-y-auto">
        <ProductSearch
          products={products}
          search={search}
          onSearchChange={onSearchChange}
          onAddProduct={onAddProduct}
          disabled={disabled}
        />
      </div>
    </div>
  );
}