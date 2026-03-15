import {
  DetailHeaderSkeleton,
  CardSkeleton,
  TableSkeleton,
  Skeleton,
} from "@/components/skeletons/Skeleton";

export default function ClientDetailLoading() {
  return (
    <div className="space-y-6">
      <DetailHeaderSkeleton />

      {/* Contact Info + Project Details cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton lines={2} />
        <CardSkeleton lines={4} />
      </div>

      {/* Separator */}
      <Skeleton className="h-px w-full" />

      {/* Projects table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <TableSkeleton rows={3} cols={4} />
      </div>

      {/* Invoices table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <TableSkeleton rows={3} cols={5} />
      </div>
    </div>
  );
}
