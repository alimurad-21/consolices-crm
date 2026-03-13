import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type InvoiceStatus } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RecentInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  created_at: string;
  clients: { name: string } | null;
}

const statusVariant: Record<InvoiceStatus, "default" | "secondary" | "destructive"> = {
  paid: "default",
  pending: "secondary",
  overdue: "destructive",
};

interface RecentInvoicesProps {
  invoices: RecentInvoice[];
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Invoices</CardTitle>
        <Link
          href="/dashboard/invoices"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No invoices yet.
          </p>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col gap-0.5">
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {invoice.invoice_number}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {invoice.clients?.name || "Unknown"} &middot;{" "}
                    {formatDate(invoice.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[invoice.status]} className="text-xs">
                    {invoice.status}
                  </Badge>
                  <span className="text-sm font-semibold w-24 text-right">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
