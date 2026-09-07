export type SkeletonVariant = "text" | "circle" | "rect";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  count?: number;
  gap?: string;
}

export interface POSSkeletonProps {
  variant?: "full" | "shift-only";
}
