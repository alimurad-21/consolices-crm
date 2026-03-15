import {
  DetailHeaderSkeleton,
  CardSkeleton,
  Skeleton,
} from "@/components/skeletons/Skeleton";

export default function InvoiceDetailLoading() {
  return (
    <div className="space-y-6">
      <DetailHeaderSkeleton />
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton lines={5} />
        <CardSkeleton lines={3} />
      </div>
      {/* PDF download button placeholder */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-40 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
