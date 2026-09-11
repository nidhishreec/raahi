// Add this interface to your existing lib/types.ts (don't replace the
// whole file -- just append this at the end).

export interface BillRequest {
  id: string;
  table_num: string;
  status: "Requested" | "Resolved";
  created_at: string;
  resolved_at: string | null;
}
