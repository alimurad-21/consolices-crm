import { notFound } from "next/navigation";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";
import { InvoiceDetail } from "@/components/invoices/InvoiceDetail";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, clients(name, email), projects(name)")
    .eq("id", params.id)
    .single();

  if (error || !invoice) {
    notFound();
  }

  return <InvoiceDetail invoice={invoice} />;
}
