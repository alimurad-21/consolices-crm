import { NextResponse } from "next/server";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerClient();

  const [
    { count: totalClients },
    { count: activeClients },
    { data: retainerClients },
    { data: paidInvoices },
    { data: pendingInvoices },
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
    supabase.from("invoices").select("amount").eq("status", "paid"),
    supabase.from("invoices").select("amount").eq("status", "pending"),
  ]);

  const mrr = (retainerClients || []).reduce(
    (sum, c) => sum + (c.monthly_rate || 0),
    0
  );
  const totalRevenue = (paidInvoices || []).reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );
  const totalOutstanding = (pendingInvoices || []).reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );

  return NextResponse.json({
    totalClients: totalClients || 0,
    activeClients: activeClients || 0,
    mrr,
    totalRevenue,
    totalOutstanding,
  });
}
