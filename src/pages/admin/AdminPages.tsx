import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, FileText, ExternalLink, Search, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
}

const AdminPages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pages")
      .select("id, title, slug, status, updated_at")
      .order("created_at", { ascending: true });
    if (error) toast.error(`Failed to load pages: ${error.message}`);
    else setPages((data || []) as Page[]);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return pages;
    const q = search.toLowerCase();
    return pages.filter(
      (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
    );
  }, [pages, search]);

  const deletePage = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) toast.error(`Failed to delete: ${error.message}`);
    else { toast.success("Page deleted."); fetchPages(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Pages</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchPages} className="gap-1.5" disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={() => navigate("/admin/pages/new")} className="gap-2">
            <Plus className="w-4 h-4" /> New Page
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pages by title, slug, or status…"
          className="pl-9"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {pages.length} pages (all statuses)
      </p>

      <div className="bg-background rounded-xl border border-border">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {pages.length === 0 ? "No pages yet" : "No pages match your search"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {pages.length === 0 ? "Create your first page to get started." : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((page) => (
              <div key={page.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm truncate">{page.title}</span>
                    <Badge variant={page.status === "published" ? "default" : "secondary"} className="text-xs capitalize">
                      {page.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">/{page.slug} · Updated {format(new Date(page.updated_at), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => navigate(`/admin/pages/${page.id}/edit`)}
                    className="p-2 rounded text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
                    title="Edit in Admin"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const knownRoutes: Record<string, string> = { home: "/", about: "/about", contact: "/contact", shop: "/shop", "terms-of-service": "/terms", "privacy-policy": "/privacy", "refund-policy": "/refund-policy", "replacement-guarantee": "/replacement-guarantee", faq: "/faq", blog: "/blog" };
                      const basePath = knownRoutes[page.slug] || `/page/${page.slug}`;
                      navigate(`${basePath}?edit=true`);
                    }}
                    className="p-2 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Visual Edit"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePage(page.id, page.title)}
                    className="p-2 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPages;
