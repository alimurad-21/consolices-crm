import {
  Skeleton,
  ChartSkeleton,
  TableSkeleton,
} from "@/components/skeletons/Skeleton";

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-48" />

      {/* Summary stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card rounded-xl p-5">
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="glass-card rounded-xl p-5">
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>

      {/* Revenue by Client table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <TableSkeleton rows={5} cols={4} />
      </div>

      {/* Revenue by Month chart */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <ChartSkeleton height="h-[350px]" />
      </div>
    </div>
  );
}
