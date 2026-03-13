import { createServerSupabaseClient as createServerClient } from "@/lib/supabase";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const supabase = createServerClient();

  const [{ data: clients }, { data: projects }, { count }] = await Promise.all([
    supabase.from("clients").select("id, name").order("name"),
    supabase.from("projects").select("id, name, client_id").order("name"),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
  ]);

  const nextNumber = `INV-${String((count || 0) + 1).padStart(3, "0")}`;

  return (
    <InvoiceForm
      clients={clients || []}
      projects={projects || []}
      nextInvoiceNumber={nextNumber}
    />
  );
}
