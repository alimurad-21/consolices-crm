import { PageHeaderSkeleton, TableSkeleton } from "@/components/skeletons/Skeleton";

export default function ProjectsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} cols={5} />
    </div>
  );
}
