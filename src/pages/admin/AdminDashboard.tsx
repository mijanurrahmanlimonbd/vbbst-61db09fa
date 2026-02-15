import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Package, MessageSquare, Mail, Eye, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalProducts: number;
  totalComments: number;
  pendingComments: number;
  totalMessages: number;
}

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 70%, 45%)",
  "hsl(45, 93%, 47%)",
  "hsl(280, 60%, 50%)",
  "hsl(15, 90%, 55%)",
];

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalProducts: 0, totalComments: 0, pendingComments: 0, totalMessages: 0 });
  const [postsByCategory, setPostsByCategory] = useState<{ name: string; count: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ action: string; detail: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [postsRes, productsRes, commentsRes, messagesRes] = await Promise.all([
        supabase.from("blog_posts").select("id, status, category, created_at, title"),
        supabase.from("products").select("id"),
        supabase.from("comments").select("id, status, created_at, author_name"),
        supabase.from("contact_messages").select("id, created_at, name, email"),
      ]);

      const posts = postsRes.data || [];
      const products = productsRes.data || [];
      const comments = commentsRes.data || [];
      const messages = messagesRes.data || [];

      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.status === "published").length,
        draftPosts: posts.filter((p) => p.status === "draft").length,
        totalProducts: products.length,
        totalComments: comments.length,
        pendingComments: comments.filter((c) => c.status === "pending").length,
        totalMessages: messages.length,
      });

      // Posts by category for chart
      const catMap: Record<string, number> = {};
      posts.forEach((p) => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
      setPostsByCategory(Object.entries(catMap).map(([name, count]) => ({ name, count })));

      // Recent activity
      const activity: { action: string; detail: string; time: string; date: Date }[] = [];
      posts.slice(0, 3).forEach((p) => activity.push({ action: "Blog post", detail: p.title, time: "", date: new Date(p.created_at) }));
      comments.slice(0, 3).forEach((c) => activity.push({ action: "New comment", detail: `By ${c.author_name}`, time: "", date: new Date(c.created_at) }));
      messages.slice(0, 3).forEach((m) => activity.push({ action: "Contact message", detail: `From ${m.email}`, time: "", date: new Date(m.created_at) }));
      activity.sort((a, b) => b.date.getTime() - a.date.getTime());
      setRecentActivity(activity.slice(0, 6).map((a) => ({
        ...a,
        time: a.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      })));

      setLoading(false);
    };
    load();
  }, []);

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts, sub: `${stats.publishedPosts} published, ${stats.draftPosts} drafts`, icon: FileText, color: "bg-primary/10 text-primary" },
    { label: "Products", value: stats.totalProducts, sub: "Active listings", icon: Package, color: "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)]" },
    { label: "Comments", value: stats.totalComments, sub: `${stats.pendingComments} pending review`, icon: MessageSquare, color: "bg-[hsl(280,60%,50%)]/10 text-[hsl(280,60%,50%)]" },
    { label: "Messages", value: stats.totalMessages, sub: "Contact form submissions", icon: Mail, color: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}</h2>
        <p className="text-muted-foreground mt-1">Here's what's happening with your site.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-background rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Posts by Category */}
        {postsByCategory.length > 0 && (
          <div className="bg-background rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Posts by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={postsByCategory}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart - Content Distribution */}
        <div className="bg-background rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Content Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Published", value: stats.publishedPosts },
                  { name: "Drafts", value: stats.draftPosts },
                  { name: "Products", value: stats.totalProducts },
                  { name: "Comments", value: stats.totalComments },
                ].filter((d) => d.value > 0)}
                cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}
              >
                {[0, 1, 2, 3].map((i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-background rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
