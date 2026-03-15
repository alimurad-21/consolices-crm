import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, ExternalLink, Plus } from "lucide-react";
import { type Client, type ClientStatus, type InvoiceStatus } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusVariant: Record<ClientStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
};

const invoiceStatusVariant: Record<InvoiceStatus, "default" | "secondary" | "destructive"> = {
  paid: "default",
  pending: "secondary",
  overdue: "destructive",
};

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  const [
    { data: client, error },
    { data: projects },
    { data: invoices },
  ] = await Promise.all([
    supabase.from("clients").select("*").eq("id", params.id).single(),
    supabase
      .from("projects")
      .select("*")
      .eq("client_id", params.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("*, projects(name)")
      .eq("client_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (error || !client) {
    notFound();
  }

  const typedClient = client as Client;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{typedClient.name}</h2>
          <Badge variant={statusVariant[typedClient.status]}>
            {typedClient.status}
          </Badge>
        </div>
        <Button asChild>
          <Link href={`/dashboard/clients/${typedClient.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{typedClient.email || "—"}</p>
            </div>
            {typedClient.clickup_url && (
              <div>
                <p className="text-sm text-muted-foreground">ClickUp</p>
                <a
                  href={typedClient.clickup_url}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Project Type</p>
              <p className="capitalize">{typedClient.project_type || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Rate</p>
              <p>{formatCurrency(typedClient.monthly_rate)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p>{formatDate(typedClient.start_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p>{formatDate(typedClient.end_date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {typedClient.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{typedClient.notes}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Projects</h3>
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-3 w-3" />
              Add Project
            </Link>
          </Button>
        </div>
        {projects && projects.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          (statusVariant as Record<string, "default" | "secondary" | "outline">)[
                            project.status
                          ] || "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(project.total_value)}</TableCell>
                    <TableCell>{formatDate(project.deadline)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No projects yet.
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Invoices</h3>
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/invoices/new">
              <Plus className="mr-2 h-3 w-3" />
              Create Invoice
            </Link>
          </Button>
        </div>
        {invoices && invoices.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {invoice.invoice_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {(invoice.projects as { name: string } | null)?.name || "—"}
                    </TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoiceStatusVariant[
                            invoice.status as InvoiceStatus
                          ]
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(invoice.due_date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No invoices yet.
          </p>
        )}
      </div>
    </div>
  );
}
