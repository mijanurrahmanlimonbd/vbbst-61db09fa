import { FileText, Users, Eye, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Posts", value: "24", icon: FileText, change: "+3 this week", color: "bg-primary/10 text-primary" },
  { label: "Total Pages", value: "8", icon: Users, change: "+1 this month", color: "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)]" },
  { label: "Total Views", value: "12.4K", icon: Eye, change: "+18% vs last month", color: "bg-[hsl(280,60%,50%)]/10 text-[hsl(280,60%,50%)]" },
  { label: "Growth", value: "+24%", icon: TrendingUp, change: "Compared to last month", color: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back, Admin</h2>
        <p className="text-muted-foreground mt-1">Here's what's happening with your site today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-background rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-background rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: "Published new blog post", detail: "What is WhatsApp API", time: "2 hours ago" },
            { action: "Updated product pricing", detail: "Verified BM 3", time: "5 hours ago" },
            { action: "New contact message", detail: "From john@example.com", time: "1 day ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
