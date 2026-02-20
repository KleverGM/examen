import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Order = {
  id: number;
  table_id: number;
  table_id_name?: string;
  items_summary: string;
  total: number;
  status: string;
  created_at?: string;
};

export async function listOrdersPublicApi() {
  const { data } = await http.get<Paginated<Order>>("/api/orders/");
  return data; // { ... , results: [] }
}

export async function listOrdersAdminApi() {
  const { data } = await http.get<Paginated<Order>>("/api/orders/");
  return data;
}

export async function createOrderApi(
  payload: Omit<Order, "id" | "table_id_name" | "created_at">,
) {
  const { data } = await http.post<Order>("/api/orders/", payload);
  return data;
}

export async function updateOrderApi(id: number, payload: Partial<Order>) {
  const { data } = await http.put<Order>(`/api/orders/${id}/`, payload);
  return data;
}

export async function deleteOrderApi(id: number) {
  await http.delete(`/api/orders/${id}/`);
}
