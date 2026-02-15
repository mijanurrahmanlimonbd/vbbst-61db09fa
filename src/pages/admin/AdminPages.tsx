import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2, FileText } from "lucide-react";
import { format } from "date-fns";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

const emptyPage = (): Partial<Page> => ({
  title: "", slug: "", content: "", status: "draft", meta_title: "", meta_description: "",
});

const AdminPages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editPage, setEditPage] = useState<Partial<Page>>(emptyPage());
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      toast.error(`Failed to load pages: ${error.message}`);
    } else {
      setPages((data || []) as Page[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const openEditor = (page?: Page) => {
    if (page) {
      // Hydrate all fields from DB row
      setEditPage({
        id: page.id,
        title: page.title ?? "",
        slug: page.slug ?? "",
        content: page.content ?? "",
        status: page.status ?? "draft",
        meta_title: page.meta_title ?? "",
        meta_description: page.meta_description ?? "",
      });
    } else {
      setEditPage(emptyPage());
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!editPage.title?.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!editPage.slug?.trim()) {
      toast.error("Slug is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: editPage.title!.trim(),
        slug: editPage.slug!.trim(),
        content: editPage.content || null,
        status: editPage.status || "draft",
        meta_title: editPage.meta_title || null,
        meta_description: editPage.meta_description || null,
      };

      if (editPage.id) {
        // UPDATE existing page
        const { error } = await supabase
          .from("pages")
          .update(payload)
          .eq("id", editPage.id);
        if (error) throw error;
        toast.success("Page updated successfully!");
      } else {
        // INSERT new page
        const { error } = await supabase
          .from("pages")
          .insert(payload);
        if (error) {
          if (error.message?.includes("duplicate")) {
            toast.error("A page with this slug already exists.");
          } else {
            throw error;
          }
          setSaving(false);
          return;
        }
        toast.success("Page created successfully!");
      }
      setEditorOpen(false);
      fetchPages();
    } catch (error: any) {
      toast.error(`Failed to save page: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) {
      toast.error(`Failed to delete: ${error.message}`);
    } else {
      toast.success("Page deleted.");
      fetchPages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Pages</h2>
        <Button onClick={() => openEditor()} className="gap-2">
          <Plus className="w-4 h-4" /> New Page
        </Button>
      </div>

      <div className="bg-background rounded-xl border border-border">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : pages.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No pages yet</h3>
            <p className="text-sm text-muted-foreground">Create your first page to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {pages.map((page) => (
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
                    onClick={() => openEditor(page)}
                    className="p-2 rounded text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
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

      {/* Page Editor Modal */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editPage.id ? "Edit Page" : "New Page"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Title *</Label>
              <Input
                value={editPage.title ?? ""}
                onChange={(e) => setEditPage({ ...editPage, title: e.target.value })}
                placeholder="Page title"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                value={editPage.slug ?? ""}
                onChange={(e) => setEditPage({ ...editPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                placeholder="page-slug"
                className="mt-1.5 font-mono"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={editPage.content ?? ""}
                onChange={(e) => setEditPage({ ...editPage, content: e.target.value })}
                placeholder="Page content…"
                rows={8}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={editPage.status || "draft"} onValueChange={(v) => setEditPage({ ...editPage, status: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Meta Title</Label>
              <Input
                value={editPage.meta_title ?? ""}
                onChange={(e) => setEditPage({ ...editPage, meta_title: e.target.value })}
                placeholder="SEO title"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea
                value={editPage.meta_description ?? ""}
                onChange={(e) => setEditPage({ ...editPage, meta_description: e.target.value })}
                placeholder="SEO description"
                rows={3}
                className="mt-1.5"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editPage.id ? "Update Page" : "Create Page"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPages;
