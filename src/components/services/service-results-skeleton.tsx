import { Skeleton } from "@/components/ui/skeleton";

export function ServiceResultsSkeleton() {
  return (
    <div role="status" aria-label="Loading services">
      <Skeleton className="h-[148px] rounded-2xl sm:h-[124px]" />
      <Skeleton className="mt-10 h-9 w-56" />
      <Skeleton className="mt-3 h-4 w-48" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-[420px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
