import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const supabase = createServerClient();
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*, clients(name, email), projects(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-destructive">
        Failed to load invoices: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage and track your invoices
        </p>
        <Button asChild>
          <Link href="/dashboard/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>
      <InvoiceTable invoices={invoices || []} />
    </div>
  );
}
