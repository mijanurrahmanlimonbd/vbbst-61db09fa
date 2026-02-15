import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Search, Package, ArrowUpDown, Edit } from "lucide-react";
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
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CATEGORIES = ["Verified BM", "WhatsApp API", "Facebook Accounts", "TikTok Ads", "Agency Accounts"];

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  category: string;
  badge: string | null;
  image_url: string | null;
  rating: number | null;
  sort_order: number | null;
  is_featured: boolean | null;
  created_at: string;
}

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const emptyProduct = (): Partial<Product> => ({
  title: "", slug: "", description: "", short_description: "", price: 0,
  sale_price: null, category: "Verified BM", badge: null, image_url: "",
  rating: 5, sort_order: 0, is_featured: false,
});

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product>>(emptyProduct());
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openNew = () => { setEditProduct(emptyProduct()); setEditorOpen(true); };
  const openEdit = (p: Product) => { setEditProduct({ ...p }); setEditorOpen(true); };

  const handleSave = async () => {
    if (!editProduct.title?.trim()) { toast.error("Title is required."); return; }
    if (!editProduct.price && editProduct.price !== 0) { toast.error("Price is required."); return; }
    setSaving(true);

    const slug = editProduct.slug?.trim() || generateSlug(editProduct.title);
    const payload = {
      title: editProduct.title,
      slug,
      description: editProduct.description || null,
      short_description: editProduct.short_description || null,
      price: Number(editProduct.price),
      sale_price: editProduct.sale_price ? Number(editProduct.sale_price) : null,
      category: editProduct.category || "Verified BM",
      badge: editProduct.badge || null,
      image_url: editProduct.image_url || null,
      rating: editProduct.rating ? Number(editProduct.rating) : 5,
      sort_order: editProduct.sort_order ? Number(editProduct.sort_order) : 0,
      is_featured: editProduct.is_featured || false,
    };

    if (editProduct.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", editProduct.id);
      if (error) { toast.error("Failed to update product."); setSaving(false); return; }
      toast.success("Product updated.");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error("Failed to create product."); setSaving(false); return; }
      toast.success("Product created.");
    }
    setSaving(false);
    setEditorOpen(false);
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("products").delete().eq("id", deleteId);
    if (error) toast.error("Failed to delete.");
    else toast.success("Product deleted.");
    setDeleteId(null);
    fetchProducts();
  };

  const filtered = products
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => catFilter === "all" || p.category === catFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Products</h2>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> New Product</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No products found</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first product to get started.</p>
            <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Create Product</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">Featured</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-10 h-10 rounded object-cover" loading="lazy" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                      )}
                      <div>
                        <span className="block">{p.title}</span>
                        <span className="text-xs text-muted-foreground sm:hidden">{p.category}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{p.category}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-foreground">
                    {p.sale_price ? (
                      <span><span className="line-through text-muted-foreground mr-1">${p.price}</span>${p.sale_price}</span>
                    ) : `$${p.price}`}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {p.is_featured && <Badge variant="default" className="text-xs">Featured</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Product Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProduct.id ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Title *</label>
              <Input value={editProduct.title || ""} onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value, slug: editProduct.id ? editProduct.slug : generateSlug(e.target.value) })} placeholder="Product title" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Slug</label>
              <Input value={editProduct.slug || ""} onChange={(e) => setEditProduct({ ...editProduct, slug: e.target.value })} placeholder="product-slug" className="font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Price *</label>
                <Input type="number" value={editProduct.price || ""} onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })} placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Sale Price</label>
                <Input type="number" value={editProduct.sale_price || ""} onChange={(e) => setEditProduct({ ...editProduct, sale_price: e.target.value ? Number(e.target.value) : null })} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                <Select value={editProduct.category || "Verified BM"} onValueChange={(v) => setEditProduct({ ...editProduct, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Badge</label>
                <Select value={editProduct.badge || "none"} onValueChange={(v) => setEditProduct({ ...editProduct, badge: v === "none" ? null : v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Best Seller">Best Seller</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Short Description</label>
              <Input value={editProduct.short_description || ""} onChange={(e) => setEditProduct({ ...editProduct, short_description: e.target.value })} placeholder="Brief product summary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Description</label>
              <Textarea value={editProduct.description || ""} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} placeholder="Detailed description…" rows={4} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Image URL</label>
              <Input value={editProduct.image_url || ""} onChange={(e) => setEditProduct({ ...editProduct, image_url: e.target.value })} placeholder="https://…" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Rating</label>
                <Input type="number" step="0.1" min="0" max="5" value={editProduct.rating ?? 5} onChange={(e) => setEditProduct({ ...editProduct, rating: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Sort Order</label>
                <Input type="number" value={editProduct.sort_order ?? 0} onChange={(e) => setEditProduct({ ...editProduct, sort_order: Number(e.target.value) })} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editProduct.is_featured || false} onChange={(e) => setEditProduct({ ...editProduct, is_featured: e.target.checked })} className="rounded border-border" />
                  <span className="text-foreground">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editProduct.id ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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

export default AdminProducts;
