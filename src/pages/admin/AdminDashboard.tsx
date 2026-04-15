import { useAuth } from "@/contexts/AuthContext";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import RecentActivityTable from "@/components/admin/dashboard/RecentActivityTable";
import QuickDraftWidget from "@/components/admin/dashboard/QuickDraftWidget";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import SEOHealthWidget from "@/components/admin/SEOHealthWidget";
import SalesAnalyticsWidget from "@/components/admin/SalesAnalyticsWidget";

const AdminDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your site today.</p>
      </div>

      {/* Stats Cards with Sparklines */}
      <StatsCards />

      {/* Main Grid: Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table - 2 cols */}
        <div className="lg:col-span-2">
          <RecentActivityTable />
        </div>

        {/* Right Sidebar: Quick Draft + Activity Feed */}
        <div className="space-y-6">
          <QuickDraftWidget />
          <ActivityFeed />
        </div>
      </div>

      {/* Sales & Analytics */}
      <SalesAnalyticsWidget />

      {/* SEO Health */}
      <SEOHealthWidget />
    </div>
  );
};

export default AdminDashboard;
