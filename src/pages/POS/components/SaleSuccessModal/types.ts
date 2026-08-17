export interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  change: number;
}