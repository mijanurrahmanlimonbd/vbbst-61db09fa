import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Mail, MessageSquare, Image, Clock, ArrowRight, Save, Trash2, Loader2, Star } from "lucide-react";
import SEOHealthWidget from "@/components/admin/SEOHealthWidget";
import SalesAnalyticsWidget from "@/components/admin/SalesAnalyticsWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ActivityItem {
  type: "comment" | "subscriber" | "post";
  text: string;
  link: string;
  time: Date;
}

const AdminDashboard = () => {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [pendingComments, setPendingComments] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [totalMedia, setTotalMedia] = useState(0);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  // Quick draft
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [savingDraft, setSavingDraft] = useState(false);
  const [purging, setPurging] = useState(false);

  const handlePurgeCache = async () => {
    setPurging(true);
    try {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/purge-cache`, {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Purge failed");
      toast.success("Cache Cleared! Your changes are now live.");
    } catch {
      toast.error("Failed to clear cache. Please try again.");
    } finally {
      setPurging(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      const [postsRes, subsRes, commentsRes, reviewsRes, mediaRes, recentCommentsRes, recentSubsRes, recentPostsRes] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("product_reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("media_files").select("id", { count: "exact", head: true }),
        supabase.from("comments").select("author_name, created_at, blog_posts(title)").order("created_at", { ascending: false }).limit(5),
        supabase.from("newsletter_subscribers").select("email, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("blog_posts").select("title, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      setTotalPosts(postsRes.count || 0);
      setTotalSubscribers(subsRes.count || 0);
      setPendingComments(commentsRes.count || 0);
      setPendingReviews(reviewsRes.count || 0);
      setTotalMedia(mediaRes.count || 0);

      const items: ActivityItem[] = [];

      (recentCommentsRes.data || []).forEach((c: any) => {
        items.push({
          type: "comment",
          text: `New comment by ${c.author_name} on "${(c.blog_posts as any)?.title || "a post"}"`,
          link: "/admin/comments",
          time: new Date(c.created_at),
        });
      });

      (recentSubsRes.data || []).forEach((s: any) => {
        items.push({
          type: "subscriber",
          text: `New subscriber: ${s.email}`,
          link: "/admin/subscribers",
          time: new Date(s.created_at),
        });
      });

      (recentPostsRes.data || []).forEach((p: any) => {
        items.push({
          type: "post",
          text: `Post created: "${p.title}"`,
          link: "/admin/posts",
          time: new Date(p.created_at),
        });
      });

      items.sort((a, b) => b.time.getTime() - a.time.getTime());
      setActivity(items.slice(0, 5));
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveDraft = async () => {
    if (!draftTitle.trim()) {
      toast.error("Title is required.");
      return;
    }
    setSavingDraft(true);
    const slug = draftTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const { error } = await supabase.from("blog_posts").insert({
      title: draftTitle.trim(),
      slug,
      content: draftContent.trim() || null,
      status: "draft",
      user_id: user?.id || null,
    });
    if (error) {
      toast.error("Failed to save draft.");
    } else {
      toast.success("Draft saved!");
      setDraftTitle("");
      setDraftContent("");
    }
    setSavingDraft(false);
  };

  const timeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const statCards = [
    { label: "Total Posts", value: totalPosts, icon: FileText, color: "bg-primary/10 text-primary", link: "/admin/posts" },
    { label: "Total Subscribers", value: totalSubscribers, icon: Mail, color: "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)]", link: "/admin/subscribers" },
    { label: "Pending Comments", value: pendingComments, icon: MessageSquare, color: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]", link: "/admin/comments", glow: true },
    { label: "Pending Reviews", value: pendingReviews, icon: Star, color: "bg-[hsl(25,90%,50%)]/10 text-[hsl(25,90%,50%)]", link: "/admin/reviews", glow: true },
    { label: "Total Media", value: totalMedia, icon: Image, color: "bg-[hsl(280,60%,50%)]/10 text-[hsl(280,60%,50%)]", link: "/admin/media" },
  ];

  const activityIcons: Record<string, typeof FileText> = {
    comment: MessageSquare,
    subscriber: Mail,
    post: FileText,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your site.</p>
        </div>
        <Button
          variant="destructive"
          onClick={handlePurgeCache}
          disabled={purging}
          className="shrink-0"
        >
          {purging ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
          {purging ? "Purging…" : "Clear Website Cache"}
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <Link
            key={i}
            to={stat.link}
            className={cn(
              "bg-background rounded-xl border border-border p-6 hover:shadow-md transition-all group",
              stat.glow && !loading && stat.value > 0 && "ring-2 ring-[hsl(45,93%,47%)]/30 shadow-[0_0_15px_-3px_hsl(45,93%,47%,0.2)]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-9 w-16 mt-2" />
            ) : (
              <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </p>
          </Link>
        ))}
      </div>

      {/* 3-column layout: Activity + Quick Draft */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - spans 2 cols */}
        <div className="lg:col-span-2 bg-background rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" /> Recent Activity
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No recent activity yet. Start by creating your first post!</p>
          ) : (
            <div className="space-y-1">
              {activity.map((item, i) => {
                const Icon = activityIcons[item.type] || FileText;
                return (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground truncate">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(item.time)}</p>
                      </div>
                    </div>
                    <Link
                      to={item.link}
                      className="text-xs text-primary hover:underline shrink-0 ml-3"
                    >
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Draft Widget */}
        <div className="bg-background rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" /> Quick Draft
          </h3>
          <div className="space-y-3">
            <Input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Post title…"
              maxLength={200}
            />
            <Textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder="Write a quick draft…"
              rows={5}
              maxLength={5000}
            />
            <Button
              onClick={handleSaveDraft}
              disabled={savingDraft || !draftTitle.trim()}
              className="w-full gap-2"
            >
              <Save className="w-4 h-4" />
              {savingDraft ? "Saving…" : "Save Draft"}
            </Button>
          </div>
        </div>
      </div>
      {/* Sales & Analytics */}
      <SalesAnalyticsWidget />

      {/* SEO Health Report */}
      <SEOHealthWidget />
    </div>
  );
};

export default AdminDashboard;
