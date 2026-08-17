export interface OpenShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (openingAmount: number) => Promise<void>;
  loading?: boolean;
}