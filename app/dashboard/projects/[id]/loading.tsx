import { DetailHeaderSkeleton, CardSkeleton } from "@/components/skeletons/Skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="space-y-6">
      <DetailHeaderSkeleton />
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
      </div>
    </div>
  );
}
