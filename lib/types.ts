export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  is_available: boolean;
}

export interface OrderLineItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export type OrderStatus =
  | "Pending Kitchen"
  | "Preparing"
  | "Served"
  | "Archived"
  | `Paid via ${"UPI" | "Card" | "Cash"}`;

export interface Order {
  id: string;
  table_num: string;
  items: OrderLineItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface BillRequest {
  id: string;
  table_num: string;
  status: "Requested" | "Resolved";
  created_at: string;
  resolved_at: string | null;
}