"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Mail, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface OutstandingInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  notes: string | null;
  created_at: string;
  clients: { id: string; name: string; email: string | null } | null;
  projects: { name: string } | null;
}

interface PaymentsViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoices: any[];
}

function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

function exportPaymentsCSV(invoices: OutstandingInvoice[]) {
  const headers = [
    "Invoice #",
    "Client",
    "Email",
    "Project",
    "Amount",
    "Due Date",
    "Days Overdue",
    "Status",
  ];
  const rows = invoices.map((inv) => {
    const days = getDaysOverdue(inv.due_date);
    return [
      inv.invoice_number,
      inv.clients?.name || "",
      inv.clients?.email || "",
      inv.projects?.name || "",
      inv.amount.toFixed(2),
      inv.due_date,
      days > 0 ? String(days) : "0",
      days > 0 ? "overdue" : "pending",
    ];
  });

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "outstanding-payments.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function PaymentsView({ invoices }: PaymentsViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const typed = invoices as OutstandingInvoice[];

  const totalOutstanding = typed.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = typed.filter(
    (inv) => getDaysOverdue(inv.due_date) > 0
  ).length;

  const filtered = typed.filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.invoice_number.toLowerCase().includes(q) ||
      (inv.clients?.name.toLowerCase().includes(q) ?? false)
    );
  });

  async function handleMarkPaid(invoiceId: string) {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "paid",
          paid_date: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast({ title: "Invoice marked as paid" });
      router.refresh();
    } catch {
      toast({ title: "Failed to update invoice", variant: "destructive" });
    }
  }

  function handleSendReminder(invoice: OutstandingInvoice) {
    const email = invoice.clients?.email;
    if (!email) {
      toast({
        title: "No email address for this client",
        variant: "destructive",
      });
      return;
    }
    const subject = encodeURIComponent(
      `Payment Reminder: ${invoice.invoice_number}`
    );
    const body = encodeURIComponent(
      `Hi ${invoice.clients?.name},\n\nThis is a friendly reminder that invoice ${invoice.invoice_number} for ${formatCurrency(invoice.amount)} was due on ${formatDate(invoice.due_date)}.\n\nPlease let us know if you have any questions.\n\nBest regards,\nConsolices`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(totalOutstanding)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unpaid Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{typed.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {overdueCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Export */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by invoice # or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={() => exportPaymentsCSV(typed)}
          disabled={typed.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  {typed.length === 0
                    ? "No outstanding payments. All caught up!"
                    : "No results match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((invoice) => {
                const daysOverdue = getDaysOverdue(invoice.due_date);
                const isOverdue = daysOverdue > 0;

                return (
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
                      {invoice.clients ? (
                        <Link
                          href={`/dashboard/clients/${invoice.clients.id}`}
                          className="hover:underline"
                        >
                          {invoice.clients.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{invoice.projects?.name || "—"}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <div>
                        {formatDate(invoice.due_date)}
                        {isOverdue && (
                          <span className="block text-xs text-destructive">
                            {daysOverdue} day{daysOverdue !== 1 ? "s" : ""}{" "}
                            overdue
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isOverdue ? "destructive" : "secondary"}>
                        {isOverdue ? "overdue" : "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkPaid(invoice.id)}
                          title="Mark as paid"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendReminder(invoice)}
                          title="Send payment reminder"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
