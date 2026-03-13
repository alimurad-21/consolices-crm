"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, DollarSign, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ClientRevenue {
  id: string;
  name: string;
  totalRevenue: number;
  invoiceCount: number;
}

interface MonthRevenue {
  month: string;
  label: string;
  revenue: number;
}

interface ReportsViewProps {
  revenueByClient: ClientRevenue[];
  revenueByMonth: MonthRevenue[];
  totalRevenue: number;
  totalInvoices: number;
}

function formatCurrencyShort(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          Revenue:{" "}
          <span className="font-semibold text-foreground">
            ${payload[0].value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </p>
      </div>
    );
  }
  return null;
}

function exportRevenueByClientCSV(clients: ClientRevenue[]) {
  const headers = ["Client", "Total Revenue", "Paid Invoices"];
  const rows = clients.map((c) => [
    `"${c.name}"`,
    c.totalRevenue.toFixed(2),
    String(c.invoiceCount),
  ]);
  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  downloadCSV(csv, "revenue-by-client.csv");
}

function exportRevenueByMonthCSV(months: MonthRevenue[]) {
  const headers = ["Month", "Revenue"];
  const rows = months.map((m) => [m.label, m.revenue.toFixed(2)]);
  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  downloadCSV(csv, "revenue-by-month.csv");
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ReportsView({
  revenueByClient,
  revenueByMonth,
  totalRevenue,
  totalInvoices,
}: ReportsViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue (All Time)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Paid Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalInvoices}</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Month Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Revenue by Month</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportRevenueByMonthCSV(revenueByMonth)}
          >
            <Download className="mr-2 h-3 w-3" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {revenueByMonth.every((m) => m.revenue === 0) ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No revenue data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatCurrencyShort}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Client */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Revenue by Client</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportRevenueByClientCSV(revenueByClient)}
            disabled={revenueByClient.length === 0}
          >
            <Download className="mr-2 h-3 w-3" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {revenueByClient.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No client revenue data yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Paid Invoices</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueByClient.map((client, index) => (
                  <TableRow key={client.id}>
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell>{client.invoiceCount}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(client.totalRevenue)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {totalRevenue > 0
                        ? `${((client.totalRevenue / totalRevenue) * 100).toFixed(1)}%`
                        : "0%"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
