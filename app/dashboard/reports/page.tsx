import { createServerSupabaseClient as createServerClient } from "@/lib/supabase";
import { ReportsView } from "@/components/reports/ReportsView";

export const dynamic = "force-dynamic";

interface PaidInvoice {
  amount: number;
  paid_date: string | null;
  client_id: string;
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default async function ReportsPage() {
  const supabase = createServerClient();

  const [{ data: paidInvoices }, { data: clients }] = await Promise.all([
    supabase
      .from("invoices")
      .select("amount, paid_date, client_id")
      .eq("status", "paid"),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  const invoices = (paidInvoices || []) as PaidInvoice[];
  const clientMap = new Map(
    (clients || []).map((c: { id: string; name: string }) => [c.id, c.name])
  );

  // Revenue by client
  const clientRevenueMap = new Map<
    string,
    { name: string; totalRevenue: number; invoiceCount: number }
  >();
  for (const inv of invoices) {
    const existing = clientRevenueMap.get(inv.client_id) || {
      name: clientMap.get(inv.client_id) || "Unknown",
      totalRevenue: 0,
      invoiceCount: 0,
    };
    existing.totalRevenue += inv.amount || 0;
    existing.invoiceCount += 1;
    clientRevenueMap.set(inv.client_id, existing);
  }
  const revenueByClient = Array.from(clientRevenueMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Revenue by month (last 12 months)
  const now = new Date();
  const monthlyData: { month: string; label: string; revenue: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthKey(d);
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const monthStart = d.toISOString().split("T")[0];
    const monthEnd = nextMonth.toISOString().split("T")[0];

    const revenue = invoices
      .filter(
        (inv) =>
          inv.paid_date && inv.paid_date >= monthStart && inv.paid_date < monthEnd
      )
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    monthlyData.push({
      month: key,
      label: getMonthLabel(key),
      revenue,
    });
  }

  // All-time total
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );
  const totalInvoices = invoices.length;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Revenue reports and analytics
      </p>
      <ReportsView
        revenueByClient={revenueByClient}
        revenueByMonth={monthlyData}
        totalRevenue={totalRevenue}
        totalInvoices={totalInvoices}
      />
    </div>
  );
}
