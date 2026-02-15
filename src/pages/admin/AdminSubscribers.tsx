import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Search, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setSubscribers(data as Subscriber[]);
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", deleteId);
    if (error) toast.error("Failed to delete.");
    else toast.success("Subscriber removed.");
    setDeleteId(null);
    fetchSubscribers();
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "subscribed" ? "unsubscribed" : "subscribed";
    const { error } = await supabase.from("newsletter_subscribers").update({ status: newStatus }).eq("id", id);
    if (error) toast.error("Failed to update.");
    else toast.success(`Status changed to ${newStatus}.`);
    fetchSubscribers();
  };

  const exportCSV = () => {
    const rows = [["Email", "Status", "Date Joined"]];
    filtered.forEach((s) => {
      rows.push([
        s.email,
        s.status,
        new Date(s.created_at).toLocaleDateString("en-US"),
      ]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const filtered = subscribers
    .filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => statusFilter === "all" || s.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Subscribers</h2>
        <Button onClick={exportCSV} variant="outline" className="gap-2" disabled={filtered.length === 0}>
          <Download className="w-4 h-4" /> Export as CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subscribers…" className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="subscribed">Subscribed</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Mail className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No subscribers yet</h3>
            <p className="text-sm text-muted-foreground">Subscribers will appear here when users sign up via the newsletter form.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date Joined</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-foreground">{s.email}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleStatus(s.id, s.status)}>
                      <Badge
                        variant={s.status === "subscribed" ? "default" : "secondary"}
                        className="text-xs cursor-pointer capitalize"
                      >
                        {s.status}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setDeleteId(s.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {filtered.length} subscriber{filtered.length !== 1 ? "s" : ""} 
        {statusFilter !== "all" && ` (${statusFilter})`}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove subscriber?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this subscriber from your list.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSubscribers;
