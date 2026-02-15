import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ArrowLeft, Search, FileText, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  category: string;
  read_time: string | null;
  published_at: string | null;
  created_at: string;
  author: string;
  status: string;
}

const mockPosts: BlogPost[] = [
  { id: "mock-1", title: "How to Get a Verified Business Manager in 2026", slug: "get-verified-bm-2026", content: "Complete guide to obtaining a verified BM…", excerpt: "Step-by-step guide for advertisers.", featured_image: null, category: "Verified BM", read_time: "8 min read", published_at: "2026-02-10T12:00:00Z", created_at: "2026-02-10T12:00:00Z", author: "Sarah Johnson", status: "published" },
  { id: "mock-2", title: "WhatsApp API: Everything You Need to Know", slug: "whatsapp-api-guide", content: "The WhatsApp Business API allows…", excerpt: "A deep dive into WhatsApp API features.", featured_image: null, category: "WhatsApp API", read_time: "12 min read", published_at: "2026-02-08T09:00:00Z", created_at: "2026-02-08T09:00:00Z", author: "Mike Chen", status: "published" },
  { id: "mock-3", title: "5 Common Reasons BMs Get Restricted", slug: "bm-restriction-reasons", content: "Business Managers can be restricted for…", excerpt: "Avoid these mistakes to keep your BM safe.", featured_image: null, category: "Tips & Guides", read_time: "6 min read", published_at: null, created_at: "2026-02-05T14:30:00Z", author: "Admin", status: "draft" },
  { id: "mock-4", title: "Scaling Facebook Ads with Verified BMs", slug: "scaling-ads-verified-bm", content: "Verified Business Managers unlock higher…", excerpt: "Learn how verified BMs boost your ad performance.", featured_image: null, category: "Verified BM", read_time: "10 min read", published_at: "2026-01-28T11:00:00Z", created_at: "2026-01-28T11:00:00Z", author: "Sarah Johnson", status: "published" },
  { id: "mock-5", title: "TikTok Ads vs Facebook Ads: 2026 Comparison", slug: "tiktok-vs-facebook-2026", content: "Both platforms offer unique advantages…", excerpt: "Which platform delivers better ROI?", featured_image: null, category: "Guides", read_time: "15 min read", published_at: "2026-01-20T08:00:00Z", created_at: "2026-01-20T08:00:00Z", author: "Mike Chen", status: "published" },
  { id: "mock-6", title: "Setting Up WhatsApp API for E-Commerce", slug: "whatsapp-ecommerce-setup", content: "E-commerce businesses can leverage…", excerpt: "Integrate WhatsApp into your online store.", featured_image: null, category: "WhatsApp API", read_time: "9 min read", published_at: null, created_at: "2026-01-15T16:00:00Z", author: "Admin", status: "draft" },
];

const emptyPost: Omit<BlogPost, "id" | "created_at"> = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featured_image: "",
  category: "Verified BM",
  read_time: "5 min read",
  published_at: null,
  author: "Admin",
  status: "draft",
};

type SortField = "title" | "author" | "status" | "created_at";
type SortDir = "asc" | "desc";

const AdminPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      setPosts(data as unknown as BlogPost[]);
    } else {
      // Use mock data as fallback for testing
      setPosts(mockPosts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openNewPost = () => {
    setEditingPost({ ...emptyPost });
    setEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!editingPost?.title || !editingPost?.slug) {
      toast.error("Title and slug are required.");
      return;
    }
    setSaving(true);

    const payload = {
      title: editingPost.title,
      slug: editingPost.slug,
      content: editingPost.content || null,
      excerpt: editingPost.excerpt || null,
      featured_image: editingPost.featured_image || null,
      category: editingPost.category || "Verified BM",
      read_time: editingPost.read_time || "5 min read",
      author: editingPost.author || "Admin",
      status: editingPost.status || "draft",
      published_at: editingPost.status === "published" ? new Date().toISOString() : null,
    };

    if (editingPost.id && !editingPost.id.startsWith("mock-")) {
      const { error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", editingPost.id);
      if (error) toast.error("Failed to update post.");
      else toast.success("Post updated.");
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) toast.error("Failed to create post.");
      else toast.success("Post created.");
    }

    setSaving(false);
    setEditorOpen(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (deleteId.startsWith("mock-")) {
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Post deleted.");
      setDeleteId(null);
      return;
    }
    const { error } = await supabase.from("blog_posts").delete().eq("id", deleteId);
    if (error) toast.error("Failed to delete post.");
    else toast.success("Post deleted.");
    setDeleteId(null);
    fetchPosts();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filteredPosts = posts
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .sort((a, b) => {
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const updateField = (field: string, value: string | null) => {
    setEditingPost((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Full-screen editor
  if (editorOpen && editingPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setEditorOpen(false);
              setEditingPost(null);
            }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </button>
          <div className="flex items-center gap-3">
            <Select
              value={editingPost.status || "draft"}
              onValueChange={(v) => updateField("status", v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editingPost.id ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-background rounded-xl border border-border p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
                <Input
                  value={editingPost.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Post title"
                  className="text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Slug</label>
                <Input
                  value={editingPost.slug || ""}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="post-slug"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Excerpt</label>
                <Textarea
                  value={editingPost.excerpt || ""}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  placeholder="Short description…"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Content</label>
                <Textarea
                  value={editingPost.content || ""}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="Write your post content here…"
                  rows={16}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-background rounded-xl border border-border p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Author</label>
                <Input
                  value={editingPost.author || ""}
                  onChange={(e) => updateField("author", e.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                <Select
                  value={editingPost.category || "Verified BM"}
                  onValueChange={(v) => updateField("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified BM">Verified BM</SelectItem>
                    <SelectItem value="WhatsApp API">WhatsApp API</SelectItem>
                    <SelectItem value="Tips & Guides">Tips & Guides</SelectItem>
                    <SelectItem value="Guides">Guides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Read Time</label>
                <Input
                  value={editingPost.read_time || ""}
                  onChange={(e) => updateField("read_time", e.target.value)}
                  placeholder="5 min read"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Featured Image URL</label>
                <Input
                  value={editingPost.featured_image || ""}
                  onChange={(e) => updateField("featured_image", e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Posts</h2>
        <Button onClick={openNewPost} className="gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No posts found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filter."
                : "Get started by creating your first blog post."}
            </p>
            {!search && statusFilter === "all" && (
              <Button onClick={openNewPost} className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button onClick={() => toggleSort("title")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Title <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <button onClick={() => toggleSort("author")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Author <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Status <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button onClick={() => toggleSort("created_at")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="cursor-pointer"
                  onClick={() => openEditPost(post)}
                >
                  <TableCell className="font-medium text-foreground">
                    <div>
                      {post.title}
                      <span className="block text-xs text-muted-foreground mt-0.5 sm:hidden">
                        {post.author}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {post.author}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={post.status === "published" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(post.id);
                      }}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPosts;
