"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 10,
    color: "#666",
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    flexDirection: "column",
    width: "48%",
  },
  label: {
    fontSize: 9,
    color: "#666",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 11,
    marginBottom: 8,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  descCol: {
    width: "70%",
  },
  amountCol: {
    width: "30%",
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#666",
    textTransform: "uppercase",
  },
  totalRow: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#1a1a1a",
  },
  totalLabel: {
    width: "70%",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  totalAmount: {
    width: "30%",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 15,
  },
  footerTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    color: "#666",
  },
  footerText: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.4,
  },
  statusBadge: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    padding: "3 8",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
});

interface InvoicePDFProps {
  invoice: {
    invoice_number: string;
    amount: number;
    status: string;
    due_date: string;
    paid_date: string | null;
    notes: string | null;
    created_at: string;
  };
  clientName: string;
  clientEmail: string;
  projectName: string | null;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function InvoicePDF({
  invoice,
  clientName,
  clientEmail,
  projectName,
}: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>CONSOLICES</Text>
          <Text style={styles.companyAddress}>Lahore, Pakistan</Text>
        </View>

        <Text style={styles.invoiceTitle}>
          INVOICE {invoice.invoice_number}
        </Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.value}>{clientName}</Text>
            {clientEmail && (
              <Text style={[styles.value, { color: "#666", fontSize: 10 }]}>
                {clientEmail}
              </Text>
            )}
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Invoice Date</Text>
            <Text style={styles.value}>
              {formatDate(invoice.created_at)}
            </Text>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>{formatDate(invoice.due_date)}</Text>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    invoice.status === "paid"
                      ? "#dcfce7"
                      : invoice.status === "overdue"
                      ? "#fef2f2"
                      : "#fef9c3",
                  color:
                    invoice.status === "paid"
                      ? "#166534"
                      : invoice.status === "overdue"
                      ? "#991b1b"
                      : "#854d0e",
                },
              ]}
            >
              {invoice.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.descCol]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderText, styles.amountCol]}>
              Amount
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.descCol}>
              {projectName || "Professional Services"}
            </Text>
            <Text style={styles.amountCol}>
              {formatCurrency(invoice.amount)}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(invoice.amount)}
            </Text>
          </View>
        </View>

        {invoice.notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Notes</Text>
            <Text style={[styles.value, { color: "#666" }]}>
              {invoice.notes}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Payment Information</Text>
          <Text style={styles.footerText}>
            Please make payment by the due date. For questions about this
            invoice, contact us at billing@consolices.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
