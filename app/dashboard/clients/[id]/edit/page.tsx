import { notFound } from "next/navigation";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";
import { ClientForm } from "@/components/clients/ClientForm";
import { type Client } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !client) {
    notFound();
  }

  return <ClientForm client={client as Client} />;
}
