export interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; dni: string; phone?: string }) => Promise<void>;
  loading?: boolean;
}