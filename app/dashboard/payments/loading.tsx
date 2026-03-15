import { Skeleton, TableSkeleton } from "@/components/skeletons/Skeleton";

export default function PaymentsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-64" />
      {/* Summary cards row */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-7 w-24" />
          </div>
        ))}
      </div>
      {/* Actions bar */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <TableSkeleton rows={6} cols={6} />
    </div>
  );
}
