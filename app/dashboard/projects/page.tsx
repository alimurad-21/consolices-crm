import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = createServerClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-destructive">
        Failed to load projects: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage your project portfolio
        </p>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>
      <ProjectTable projects={projects || []} />
    </div>
  );
}
