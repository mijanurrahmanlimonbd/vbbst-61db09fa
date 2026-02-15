import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const CommentSection = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, author_name, content, created_at")
      .eq("post_id", postId)
      .eq("status", "approved")
      .order("created_at", { ascending: true });
    if (data) setComments(data);
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      toast.error("All fields are required.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_name: name.trim(),
      author_email: email.trim(),
      content: content.trim(),
    });
    if (error) {
      toast.error("Failed to submit comment.");
    } else {
      toast.success("Comment submitted! It will appear after approval.");
      setName(""); setEmail(""); setContent("");
    }
    setSubmitting(false);
  };

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5" /> Comments ({comments.length})
      </h2>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading comments…</p>
      ) : comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="bg-secondary/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground text-sm">{c.author_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <p className="text-sm text-foreground/80">{c.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-8">No comments yet. Be the first to share your thoughts!</p>
      )}

      <div className="bg-background border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Leave a Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name *" />
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email *" />
          </div>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your comment…" rows={4} />
          <Button type="submit" disabled={submitting} className="gap-2">
            <Send className="w-4 h-4" /> {submitting ? "Submitting…" : "Submit Comment"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CommentSection;
