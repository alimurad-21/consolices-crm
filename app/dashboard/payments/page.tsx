import { createServerSupabaseClient as createServerClient } from "@/lib/supabase";
import { PaymentsView } from "@/components/reports/PaymentsView";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const supabase = createServerClient();

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*, clients(id, name, email), projects(name)")
    .in("status", ["pending", "overdue"])
    .order("due_date", { ascending: true });

  if (error) {
    return (
      <div className="text-destructive">
        Failed to load payments: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Track and manage outstanding payments
      </p>
      <PaymentsView invoices={invoices || []} />
    </div>
  );
}
