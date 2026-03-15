import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { OutstandingPayments } from "@/components/dashboard/OutstandingPayments";
import { TopClients } from "@/components/dashboard/TopClients";
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

async function getDashboardData() {
  const supabase = createServerClient();

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toISOString()
    .split("T")[0];

  const [
    { count: totalClients },
    { count: activeClients },
    { data: retainerClients },
    { data: allPaidInvoices },
    { data: outstandingInvoices },
    { data: recentInvoices },
    { data: thisMonthPaid },
    { data: lastMonthPaid },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("clients")
      .select("monthly_rate")
      .eq("status", "active")
      .eq("project_type", "retainer"),
    supabase.from("invoices").select("amount, paid_date, client_id").eq("status", "paid"),
    supabase
      .from("invoices")
      .select("id, invoice_number, amount, status, due_date, clients(name)")
      .in("status", ["pending", "overdue"])
      .order("due_date", { ascending: true }),
    supabase
      .from("invoices")
      .select("id, invoice_number, amount, status, due_date, created_at, clients(name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("invoices")
      .select("amount")
      .eq("status", "paid")
      .gte("paid_date", thisMonthStart),
    supabase
      .from("invoices")
      .select("amount")
      .eq("status", "paid")
      .gte("paid_date", lastMonthStart)
      .lt("paid_date", thisMonthStart),
  ]);

  // Stats
  const mrr = (retainerClients || []).reduce(
    (sum, c) => sum + (c.monthly_rate || 0),
    0
  );
  const totalRevenue = (allPaidInvoices || []).reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );
  const totalOutstanding = (outstandingInvoices || []).reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );
  const revenueThisMonth = (thisMonthPaid || []).reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );
  const revenueLastMonth = (lastMonthPaid || []).reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );

  // Revenue change percentage
  let revenueChange = 0;
  let revenueChangeDirection: "up" | "down" | "none" = "none";
  if (revenueLastMonth > 0) {
    revenueChange = Math.round(
      ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
    );
    revenueChangeDirection = revenueChange >= 0 ? "up" : "down";
  } else if (revenueThisMonth > 0) {
    revenueChangeDirection = "up";
  }

  // Monthly revenue chart data (last 6 months)
  const monthlyRevenue: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = d.toISOString().split("T")[0];
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1)
      .toISOString()
      .split("T")[0];
    const monthRevenue = (allPaidInvoices || [])
      .filter((inv) => inv.paid_date && inv.paid_date >= monthStart && inv.paid_date < nextMonth)
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);
    monthlyRevenue.push({
      month: getMonthLabel(d),
      revenue: monthRevenue,
    });
  }

  // Top 5 clients by revenue
  const clientRevenueMap = new Map<
    string,
    { totalRevenue: number; invoiceCount: number }
  >();
  for (const inv of allPaidInvoices || []) {
    const existing = clientRevenueMap.get(inv.client_id) || {
      totalRevenue: 0,
      invoiceCount: 0,
    };
    existing.totalRevenue += inv.amount || 0;
    existing.invoiceCount += 1;
    clientRevenueMap.set(inv.client_id, existing);
  }

  const topClientIds = Array.from(clientRevenueMap.entries())
    .sort((a, b) => b[1].totalRevenue - a[1].totalRevenue)
    .slice(0, 5);

  let topClients: {
    id: string;
    name: string;
    totalRevenue: number;
    invoiceCount: number;
  }[] = [];

  if (topClientIds.length > 0) {
    const { data: clientNames } = await supabase
      .from("clients")
      .select("id, name")
      .in(
        "id",
        topClientIds.map(([id]) => id)
      );

    const nameMap = new Map(
      (clientNames || []).map((c) => [c.id, c.name])
    );

    topClients = topClientIds.map(([id, data]) => ({
      id,
      name: nameMap.get(id) || "Unknown",
      totalRevenue: data.totalRevenue,
      invoiceCount: data.invoiceCount,
    }));
  }

  return {
    stats: {
      totalClients: totalClients || 0,
      activeClients: activeClients || 0,
      mrr,
      totalRevenue,
      totalOutstanding,
      revenueThisMonth,
      revenueChange,
      revenueChangeDirection,
    },
    monthlyRevenue,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentInvoices: (recentInvoices || []) as any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outstandingInvoices: (outstandingInvoices || []) as any[],
    topClients,
  };
}

export default async function DashboardPage() {
  const {
    stats,
    monthlyRevenue,
    recentInvoices,
    outstandingInvoices,
    topClients,
  } = await getDashboardData();

  const revenueDescription =
    stats.revenueChangeDirection === "none"
      ? undefined
      : `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}% from last month`;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Clients"
          value={String(stats.totalClients)}
          icon={Users}
        />
        <StatCard
          title="Active Clients"
          value={String(stats.activeClients)}
          icon={UserCheck}
        />
        <StatCard
          title="MRR"
          value={formatCurrency(stats.mrr)}
          icon={DollarSign}
        />
        <StatCard
          title="Revenue This Month"
          value={formatCurrency(stats.revenueThisMonth)}
          icon={
            stats.revenueChangeDirection === "down"
              ? ArrowDownRight
              : stats.revenueChangeDirection === "up"
              ? ArrowUpRight
              : TrendingUp
          }
          description={revenueDescription}
        />
        <StatCard
          title="Outstanding"
          value={formatCurrency(stats.totalOutstanding)}
          icon={Clock}
          description={
            outstandingInvoices.length > 0
              ? `${outstandingInvoices.length} unpaid invoice${outstandingInvoices.length !== 1 ? "s" : ""}`
              : undefined
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </div>
        <TopClients clients={topClients} />
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentInvoices invoices={recentInvoices} />
        <OutstandingPayments invoices={outstandingInvoices} />
      </div>
    </div>
  );
}
