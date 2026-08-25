import { useState, useCallback } from "react";
import type { ReceiptData } from "./types";

export interface ModalsState {
  showOpenShift: boolean;
  showCloseShift: boolean;
  showShiftStatus: boolean;
  showNewClient: boolean;
  saleSuccess: { total: number; change: number } | null;
  showReceipt: boolean;
  receiptData: ReceiptData | null;
}

export interface ModalsActions {
  openOpenShift: () => void;
  closeOpenShift: () => void;
  openCloseShift: () => void;
  closeCloseShift: () => void;
  openShiftStatus: () => void;
  closeShiftStatus: () => void;
  openNewClient: () => void;
  closeNewClient: () => void;
  openSaleSuccess: (total: number, change: number) => void;
  closeSaleSuccess: () => void;
  openReceipt: (data: ReceiptData) => void;
  closeReceipt: () => void;
  closeAll: () => void;
}

export function useModals(): ModalsState & ModalsActions {
  const [showOpenShift, setShowOpenShift] = useState(false);
  const [showCloseShift, setShowCloseShift] = useState(false);
  const [showShiftStatus, setShowShiftStatus] = useState(false);
  const [showNewClient, setShowNewClient] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState<ModalsState["saleSuccess"]>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const openOpenShift = useCallback(() => setShowOpenShift(true), []);
  const closeOpenShift = useCallback(() => setShowOpenShift(false), []);
  const openCloseShift = useCallback(() => setShowCloseShift(true), []);
  const closeCloseShift = useCallback(() => setShowCloseShift(false), []);
  const openShiftStatus = useCallback(() => setShowShiftStatus(true), []);
  const closeShiftStatus = useCallback(() => setShowShiftStatus(false), []);
  const openNewClient = useCallback(() => setShowNewClient(true), []);
  const closeNewClient = useCallback(() => setShowNewClient(false), []);
  const openSaleSuccess = useCallback((total: number, change: number) => setSaleSuccess({ total, change }), []);
  const closeSaleSuccess = useCallback(() => setSaleSuccess(null), []);
  const openReceipt = useCallback((data: ReceiptData) => {
    setReceiptData(data);
    setShowReceipt(true);
  }, []);
  const closeReceipt = useCallback(() => {
    setShowReceipt(false);
    setReceiptData(null);
  }, []);

  const closeAll = useCallback(() => {
    setShowOpenShift(false);
    setShowCloseShift(false);
    setShowShiftStatus(false);
    setShowNewClient(false);
    setSaleSuccess(null);
    setShowReceipt(false);
    setReceiptData(null);
  }, []);

  return {
    showOpenShift,
    showCloseShift,
    showShiftStatus,
    showNewClient,
    saleSuccess,
    showReceipt,
    receiptData,
    openOpenShift,
    closeOpenShift,
    openCloseShift,
    closeCloseShift,
    openShiftStatus,
    closeShiftStatus,
    openNewClient,
    closeNewClient,
    openSaleSuccess,
    closeSaleSuccess,
    openReceipt,
    closeReceipt,
    closeAll,
  };
}