import { useState, useMemo } from "react";
import type { Product } from "../components/types";
import type { UseCartResult } from "./types";

export function useCart(products: Product[]): UseCartResult {
  const [cart, setCart] = useState<UseCartResult["cart"]>([]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product === product.id);
      if (existing) {
        if (product.type === "product" && existing.quantity >= product.stock) {
          return prev;
        }
        const newQty = existing.quantity + 1;
        return prev.map((item) =>
          item.product === product.id
            ? { ...item, quantity: newQty, subtotal: newQty * item.unitPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          product: product.id,
          name: product.name,
          type: product.type,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price,
          stock: product.stock,
        },
      ];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart((prev) => {
      const product = products.find((p) => p.id === productId);
      const newQty = Math.max(0, quantity);
      const cappedQty = product?.type === "product" && newQty > product.stock ? product.stock : newQty;
      if (cappedQty === 0) {
        return prev.filter((item) => item.product !== productId);
      }
      return prev.map((item) =>
        item.product === productId
          ? { ...item, quantity: cappedQty, subtotal: cappedQty * item.unitPrice }
          : item
      );
    });
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((item) => item.product !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
  };
}