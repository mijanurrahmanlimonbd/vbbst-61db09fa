import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Pencil, ArrowLeft, Search } from "lucide-react";
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

const AdminPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    if (!error && data) setPosts(data as unknown as BlogPost[]);
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

    if (editingPost.id) {
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
    const { error } = await supabase.from("blog_posts").delete().eq("id", deleteId);
    if (error) toast.error("Failed to delete post.");
    else toast.success("Post deleted.");
    setDeleteId(null);
    fetchPosts();
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No posts found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
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
