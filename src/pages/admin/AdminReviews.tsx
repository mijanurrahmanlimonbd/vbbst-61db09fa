import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Star, Trash2, CheckCircle, MessageCircle } from "lucide-react";

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  rating: number;
  review_text: string;
  status: string;
  created_at: string;
  product_title?: string;
  customer_name?: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    // Fetch reviews
    const { data: revData, error } = await supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load reviews");
      setLoading(false);
      return;
    }

    if (!revData || revData.length === 0) {
      setReviews([]);
      setLoading(false);
      return;
    }

    // Enrich with product titles and customer names
    const productIds = [...new Set(revData.map((r) => r.product_id))];
    const userIds = [...new Set(revData.map((r) => r.user_id))];

    const [{ data: products }, { data: profiles }] = await Promise.all([
      supabase.from("products").select("id, title").in("id", productIds),
      supabase.from("profiles").select("id, full_name").in("id", userIds),
    ]);

    const productMap = new Map((products || []).map((p) => [p.id, p.title]));
    const profileMap = new Map((profiles || []).map((p) => [p.id, p.full_name]));

    setReviews(
      revData.map((r) => ({
        ...r,
        product_title: productMap.get(r.product_id) || "Unknown Product",
        customer_name: profileMap.get(r.user_id) || "Unknown User",
      }))
    );
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (review: Review) => {
    setActionId(review.id);
    try {
      // 1. Update review status
      const { error: updateErr } = await supabase
        .from("product_reviews")
        .update({ status: "approved" })
        .eq("id", review.id);
      if (updateErr) throw updateErr;

      // 2. Copy to testimonials table
      const { error: insertErr } = await supabase.from("testimonials").insert({
        client_name: review.customer_name || "Verified Buyer",
        job_title: `Verified Buyer of ${review.product_title || "Product"}`,
        rating: review.rating,
        testimonial_text: review.review_text,
        status: "approved",
        sort_order: 0,
      });
      if (insertErr) throw insertErr;

      toast.success("Review approved & added to testimonials!");
      fetchReviews();
    } catch (e: any) {
      toast.error(e.message || "Failed to approve review");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("product_reviews").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Review deleted."); fetchReviews(); }
    setDeleteId(null);
  };

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/20"}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Product Reviews</h2>
        <Badge variant="secondary" className="text-xs">
          {reviews.length} total
        </Badge>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : reviews.length === 0 ? (
          <div className="p-16 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No reviews yet</h3>
            <p className="text-sm text-muted-foreground">Product reviews from customers will appear here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="max-w-[300px]">Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-sm">{r.customer_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.product_title}</TableCell>
                  <TableCell><RatingStars rating={r.rating} /></TableCell>
                  <TableCell className="max-w-[300px] text-sm text-muted-foreground truncate">{r.review_text}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "approved" ? "default" : "secondary"} className="capitalize text-xs">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {r.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-primary hover:text-primary"
                          disabled={actionId === r.id}
                          onClick={() => handleApprove(r)}
                        >
                          {actionId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteId(r.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this review. This action cannot be undone.</AlertDialogDescription>
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

export default AdminReviews;
