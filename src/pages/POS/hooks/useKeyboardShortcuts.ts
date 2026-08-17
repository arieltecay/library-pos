import { useEffect, useCallback } from "react";

interface UseKeyboardShortcutsOptions {
  onSearch?: () => void;
  onDiscount?: () => void;
  onAmountReceived?: () => void;
  onNewClient?: () => void;
  onCheckout?: () => void;
  onClearSale?: () => void;
  onCloseModals?: () => void;
  isModalOpen?: boolean;
  hasCartItems?: boolean;
  isLoading?: boolean;
}

export function useKeyboardShortcuts({
  onSearch,
  onDiscount,
  onAmountReceived,
  onNewClient,
  onCheckout,
  onClearSale,
  onCloseModals,
  isModalOpen = false,
  hasCartItems = false,
  isLoading = false,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (isInput) return;

      if (isModalOpen) {
        if (e.key === "Escape") onCloseModals?.();
        return;
      }

      switch (e.key) {
        case "F2":
          e.preventDefault();
          onSearch?.();
          break;
        case "F3":
          e.preventDefault();
          onDiscount?.();
          break;
        case "F4":
          e.preventDefault();
          onAmountReceived?.();
          break;
        case "F8":
          e.preventDefault();
          onNewClient?.();
          break;
        case "F9":
          e.preventDefault();
          if (!isLoading && hasCartItems) onCheckout?.();
          break;
        case "Escape":
          if (hasCartItems) onClearSale?.();
          break;
        case "+":
        case "-":
          e.preventDefault();
          break;
      }
    },
    [
      onSearch,
      onDiscount,
      onAmountReceived,
      onNewClient,
      onCheckout,
      onClearSale,
      onCloseModals,
      isModalOpen,
      hasCartItems,
      isLoading,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}