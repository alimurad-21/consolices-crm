import { notFound } from "next/navigation";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { type Project } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  const [{ data: project, error }, { data: clients }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", params.id).single(),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  if (error || !project) {
    notFound();
  }

  return <ProjectForm project={project as Project} clients={clients || []} />;
}
