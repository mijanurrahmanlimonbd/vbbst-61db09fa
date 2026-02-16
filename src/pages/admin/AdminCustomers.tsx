import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Users, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CustomerProfile {
  id: string;
  full_name: string;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

interface OrderWithItems {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  currency: string;
  items: { product_title: string; quantity: number; unit_price: number }[];
}

const PER_PAGE = 15;

const AdminCustomers = () => {
  const [profiles, setProfiles] = useState<CustomerProfile[]>([]);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);

  // Detail modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [customerOrders, setCustomerOrders] = useState<OrderWithItems[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email, is_active, created_at")
        .order("created_at", { ascending: false });

      const allProfiles = profilesData || [];
      setProfiles(allProfiles);

      // Fetch order counts grouped by customer_email
      if (allProfiles.length > 0) {
        const emails = allProfiles.map((p) => p.email).filter(Boolean) as string[];
        if (emails.length > 0) {
          const { data: orders } = await supabase
            .from("orders")
            .select("customer_email")
            .in("customer_email", emails);
          const counts: Record<string, number> = {};
          (orders || []).forEach((o) => {
            const key = allProfiles.find((p) => p.email === o.customer_email)?.id;
            if (key) counts[key] = (counts[key] || 0) + 1;
          });
          setOrderCounts(counts);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = profiles;
    if (filter === "active") list = list.filter((p) => p.is_active);
    if (filter === "inactive") list = list.filter((p) => !p.is_active);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          (p.email && p.email.toLowerCase().includes(q))
      );
    }
    return list;
  }, [profiles, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const openCustomerDetail = async (customer: CustomerProfile) => {
    setSelectedCustomer(customer);
    setOrdersLoading(true);
    setCustomerOrders([]);

    if (!customer.email) {
      setOrdersLoading(false);
      return;
    }

    const { data: orders } = await supabase
      .from("orders")
      .select("id, total_amount, status, payment_method, created_at, currency")
      .eq("customer_email", customer.email)
      .order("created_at", { ascending: false });

    if (!orders || orders.length === 0) {
      setOrdersLoading(false);
      return;
    }

    const orderIds = orders.map((o) => o.id);
    const { data: items } = await supabase
      .from("order_items")
      .select("order_id, product_title, quantity, unit_price")
      .in("order_id", orderIds);

    const ordersWithItems: OrderWithItems[] = orders.map((o) => ({
      ...o,
      items: (items || []).filter((i) => i.order_id === o.id),
    }));

    setCustomerOrders(ordersWithItems);
    setOrdersLoading(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "pending": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" /> Customers
          </h2>
          <p className="text-sm text-muted-foreground">{filtered.length} customers found</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No customers found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Total Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => openCustomerDetail(c)}>
                  <TableCell className="font-medium text-primary hover:underline">
                    {c.full_name || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.email || "—"}</TableCell>
                  <TableCell className="text-center font-semibold">{orderCounts[c.id] || 0}</TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? "default" : "secondary"}>
                      {c.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(c.created_at), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 cursor-pointer" onClick={() => setSelectedCustomer(null)} />
              {selectedCustomer?.full_name || "Customer"} — Order History
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm mb-4">
            <p><span className="font-medium">Email:</span> {selectedCustomer?.email || "—"}</p>
            <p><span className="font-medium">Status:</span>{" "}
              <Badge variant={selectedCustomer?.is_active ? "default" : "secondary"}>
                {selectedCustomer?.is_active ? "Active" : "Inactive"}
              </Badge>
            </p>
            <p><span className="font-medium">Joined:</span> {selectedCustomer ? format(new Date(selectedCustomer.created_at), "PPP") : ""}</p>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : customerOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No orders found for this customer.</p>
          ) : (
            <div className="space-y-4">
              {customerOrders.map((order) => (
                <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">{order.id.slice(0, 8)}</span>
                    <Badge variant={statusColor(order.status)} className="capitalize">{order.status}</Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    {order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.product_title} <span className="text-muted-foreground">×{item.quantity}</span></span>
                          <span className="font-medium">${item.unit_price.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No line items</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border text-sm">
                    <span className="text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy")} · {order.payment_method}</span>
                    <span className="font-bold">{order.currency} ${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
