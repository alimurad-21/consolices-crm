import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";
import { ProjectForm } from "@/components/projects/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const supabase = createServerClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  return <ProjectForm clients={clients || []} />;
}
