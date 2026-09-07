import type { SkeletonProps, SkeletonVariant } from "./types";

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 rounded-md",
  circle: "rounded-full",
  rect: "rounded-xl",
};

export function Skeleton({ variant = "rect", className = "", count = 1, gap = "gap-3" }: SkeletonProps) {
  const base = `animate-pulse bg-neutral-200 ${variantClasses[variant]} ${className}`;

  if (count > 1) {
    return (
      <div className={`flex flex-col ${gap}`} aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={base} />
        ))}
      </div>
    );
  }

  return <div className={base} aria-hidden="true" />;
}
