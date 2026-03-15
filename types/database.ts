export type ClientStatus = "active" | "paused" | "completed";
export type ProjectType = "retainer" | "fixed" | "hourly";
export type InvoiceStatus = "pending" | "paid" | "overdue";

export interface Client {
  id: string;
  name: string;
  email: string | null;
  status: ClientStatus;
  project_type: ProjectType | null;
  monthly_rate: number | null;
  start_date: string | null;
  end_date: string | null;
  clickup_url: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  status: string;
  total_value: number | null;
  deadline: string | null;
  clickup_url: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  project_id: string | null;
  invoice_number: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  paid_date: string | null;
  pdf_url: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
}

export type ClientInsert = Omit<Client, "id" | "created_by" | "created_at" | "updated_at">;
export type ClientUpdate = Partial<ClientInsert>;
