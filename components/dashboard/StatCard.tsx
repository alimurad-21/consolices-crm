import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="glass-stat rounded-xl p-6">
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100/50">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
