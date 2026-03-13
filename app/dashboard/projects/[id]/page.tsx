import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, ExternalLink } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*, clients(id, name, email)")
    .eq("id", params.id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <Badge variant={statusVariant[project.status] || "outline"}>
            {project.status}
          </Badge>
        </div>
        <Button asChild>
          <Link href={`/dashboard/projects/${project.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <Link
                href={`/dashboard/clients/${project.clients?.id}`}
                className="text-primary hover:underline"
              >
                {project.clients?.name || "—"}
              </Link>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p>{formatCurrency(project.total_value)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deadline</p>
              <p>{formatDate(project.deadline)}</p>
            </div>
            {project.clickup_url && (
              <div>
                <p className="text-sm text-muted-foreground">ClickUp</p>
                <a
                  href={project.clickup_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Open in ClickUp
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {project.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{project.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
