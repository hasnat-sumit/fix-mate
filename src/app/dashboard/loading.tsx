import { Skeleton } from "@/components/ui/skeleton";

/** Shown inside the dashboard frame while a dashboard page loads. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-6">
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[118px] rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
