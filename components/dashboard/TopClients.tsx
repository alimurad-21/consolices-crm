import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface TopClient {
  id: string;
  name: string;
  totalRevenue: number;
  invoiceCount: number;
}

interface TopClientsProps {
  clients: TopClient[];
}

export function TopClients({ clients }: TopClientsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Clients by Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No client revenue data yet.
          </p>
        ) : (
          <div className="space-y-4">
            {clients.map((client, index) => (
              <div key={client.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="text-sm font-medium hover:underline truncate block"
                  >
                    {client.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {client.invoiceCount} invoice{client.invoiceCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  {formatCurrency(client.totalRevenue)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
