import { Skeleton } from "./Skeleton";
import type { POSSkeletonProps } from "./types";

export function POSSkeleton({ variant = "full" }: POSSkeletonProps) {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col" role="status" aria-label="Cargando punto de venta">
      {/* Header skeleton */}
      <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Skeleton variant="rect" className="w-9 h-9 rounded-lg" />
          <Skeleton variant="text" className="w-48" />
        </div>
        <div className="flex items-center gap-6">
          <Skeleton variant="text" className="w-32" />
          <div className="flex flex-col gap-1.5">
            <Skeleton variant="text" className="w-36 h-3.5" />
            <Skeleton variant="text" className="w-28 h-3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="rect" className="w-36 h-9 rounded-lg" />
            <Skeleton variant="rect" className="w-28 h-9 rounded-lg" />
            <Skeleton variant="rect" className="w-32 h-9 rounded-lg" />
          </div>
          <Skeleton variant="text" className="w-10" />
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Columna izquierda */}
        <div className="flex-1 flex flex-col min-w-0 gap-4">
          {/* Client & Search Row */}
          <div className="flex items-end gap-6 bg-white p-4 rounded-2xl border border-neutral-200">
            <div className="flex flex-col gap-2 w-56">
              <Skeleton variant="text" className="w-20 h-3" />
              <Skeleton variant="rect" className="w-56 h-10 rounded-lg" />
            </div>
            <div className="flex-1">
              <Skeleton variant="rect" className="w-full h-12 rounded-xl" />
            </div>
          </div>

          {/* Quick products + Cart */}
          <div className="flex-1 flex flex-col min-w-0">
            {variant === "full" && (
              <div className="flex gap-2 mb-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} variant="rect" className="w-28 h-8 rounded-full shrink-0" />
                ))}
              </div>
            )}
            <div className="flex-1 bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col gap-3">
              <Skeleton variant="text" className="w-24 h-3" />
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton variant="text" className="w-2/3" />
                    <Skeleton variant="text" className="w-1/3 h-3" />
                  </div>
                  <Skeleton variant="rect" className="w-24 h-9 rounded-lg" />
                  <Skeleton variant="text" className="w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha - Payment panel */}
        {variant === "full" && (
          <div className="w-[380px] shrink-0 flex flex-col">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-4">
              <Skeleton variant="text" className="w-20 h-3" />
              <div className="flex justify-between">
                <Skeleton variant="text" className="w-24" />
                <Skeleton variant="text" className="w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton variant="text" className="w-20" />
                <Skeleton variant="text" className="w-14" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} variant="rect" className="flex-1 h-9 rounded-lg" />
                ))}
              </div>
              <Skeleton variant="rect" className="w-full h-12 rounded-xl" />
              <Skeleton variant="rect" className="w-full h-14 rounded-xl" />
            </div>
          </div>
        )}
      </div>

      <div className="pb-3 text-center">
        <Skeleton variant="text" className="w-96 h-3 mx-auto" />
      </div>
    </div>
  );
}
