"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, CheckCircle } from "lucide-react";
import { type InvoiceStatus } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { InvoicePDF } from "./InvoicePDF";

const statusVariant: Record<InvoiceStatus, "default" | "secondary" | "destructive"> = {
  paid: "default",
  pending: "secondary",
  overdue: "destructive",
};

interface InvoiceDetailProps {
  invoice: {
    id: string;
    invoice_number: string;
    amount: number;
    status: InvoiceStatus;
    due_date: string;
    paid_date: string | null;
    notes: string | null;
    created_at: string;
    client_id: string;
    project_id: string | null;
    clients: { name: string; email: string | null } | null;
    projects: { name: string } | null;
  };
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const blob = await pdf(
        <InvoicePDF
          invoice={invoice}
          clientName={invoice.clients?.name || "Unknown Client"}
          clientEmail={invoice.clients?.email || ""}
          projectName={invoice.projects?.name || null}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  }

  async function handleMarkPaid() {
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "paid",
          paid_date: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error("Failed to update invoice");
      toast({ title: "Invoice marked as paid" });
      router.refresh();
    } catch {
      toast({ title: "Failed to update invoice", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{invoice.invoice_number}</h2>
          <Badge variant={statusVariant[invoice.status]}>
            {invoice.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status !== "paid" && (
            <Button variant="outline" onClick={handleMarkPaid}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          )}
          <Button onClick={handleDownloadPDF} disabled={downloading}>
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">
                {formatCurrency(invoice.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p>{formatDate(invoice.due_date)}</p>
            </div>
            {invoice.paid_date && (
              <div>
                <p className="text-sm text-muted-foreground">Paid Date</p>
                <p>{formatDate(invoice.paid_date)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p>{formatDate(invoice.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client & Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <Link
                href={`/dashboard/clients/${invoice.client_id}`}
                className="text-primary hover:underline"
              >
                {invoice.clients?.name || "—"}
              </Link>
            </div>
            {invoice.clients?.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{invoice.clients.email}</p>
              </div>
            )}
            {invoice.projects && (
              <div>
                <p className="text-sm text-muted-foreground">Project</p>
                <p>{invoice.projects.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {invoice.notes && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{invoice.notes}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
