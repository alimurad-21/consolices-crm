import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/** Base pulse block */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/70",
        className
      )}
      style={style}
    />
  );
}

/** Matches StatCard: icon box + title + large value */
export function StatCardSkeleton() {
  return (
    <div className="glass-stat rounded-xl p-6">
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="mt-1 h-8 w-28" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}

/** Header row: subtitle text + action button */
export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

/** Table skeleton: header + N rows */
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 border-b border-slate-50 px-4 py-4 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={cn("h-4 flex-1", c === 0 && "max-w-[180px]")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Chart placeholder */
export function ChartSkeleton({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className={cn("glass-card rounded-xl p-6", height)}>
      <Skeleton className="mb-4 h-5 w-36" />
      <div className="flex h-[calc(100%-40px)] items-end gap-3 pt-4">
        {[40, 65, 45, 80, 55, 70].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Card with title + content lines */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass-card rounded-xl p-6">
      <Skeleton className="mb-4 h-5 w-36" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Detail page header: title + badge + edit button */
export function DetailHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-10 w-24 rounded-md" />
    </div>
  );
}

/** Form skeleton with labeled fields */
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="glass-card rounded-xl p-6 max-w-2xl">
      <Skeleton className="mb-6 h-6 w-40" />
      <div className="space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
