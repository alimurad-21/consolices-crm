import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientTable } from "@/components/clients/ClientTable";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase";
import { type Client } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = createServerClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

    console.log("Fetched clients in page clients:", clients);

  if (error) {
    return (
      <div className="text-destructive">
        Failed to load clients: {error.message}
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage your client relationships
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>
      <ClientTable clients={(clients as Client[]) || []} />
    </div>
  );
}
