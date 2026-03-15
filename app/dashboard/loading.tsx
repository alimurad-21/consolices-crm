import {
  StatCardSkeleton,
  ChartSkeleton,
  CardSkeleton,
  TableSkeleton,
} from "@/components/skeletons/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* 5 Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts Row: Revenue Chart (2/3) + Top Clients (1/3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSkeleton height="h-[350px]" />
        </div>
        <CardSkeleton lines={5} />
      </div>

      {/* Tables Row: Recent Invoices + Outstanding Payments */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TableSkeleton rows={5} cols={4} />
        <TableSkeleton rows={5} cols={4} />
      </div>
    </div>
  );
}
