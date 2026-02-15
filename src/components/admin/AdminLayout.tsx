import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  FileText,
  File,
  Image,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Bell,
  Users,
  Lock,
  Package,
  MessageSquare,
  Mail,
  ShoppingCart,
  Search,
  Briefcase,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard, section: "dashboard" },
  { title: "Posts", path: "/admin/posts", icon: FileText, section: "posts" },
  { title: "Pages", path: "/admin/pages", icon: File, section: "pages" },
  { title: "Products", path: "/admin/products", icon: Package, section: "dashboard" },
  { title: "Orders", path: "/admin/orders", icon: ShoppingCart, section: "dashboard" },
  { title: "Comments", path: "/admin/comments", icon: MessageSquare, section: "posts", badge: true },
  { title: "Subscribers", path: "/admin/subscribers", icon: Mail, section: "dashboard" },
  { title: "Media", path: "/admin/media", icon: Image, section: "media" },
  { title: "Users", path: "/admin/users", icon: Users, section: "users" },
  { title: "Work Samples", path: "/admin/work-samples", icon: Briefcase, section: "dashboard" },
  { title: "Testimonials", path: "/admin/testimonials", icon: MessageCircle, section: "dashboard" },
  { title: "FAQs", path: "/admin/faqs", icon: HelpCircle, section: "dashboard" },
  { title: "SEO", path: "/admin/seo", icon: Search, section: "settings" },
  { title: "Settings", path: "/admin/settings", icon: Settings, section: "settings" },
];

const AdminLayout = () => {
  const { user, profile, role, loading, signOut, canAccess } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchPending = async () => {
      const { count } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      setPendingCount(count || 0);
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(210,20%,96%)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const displayName = profile?.full_name || user.email || "Admin";
  const initials = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
            VS
          </div>
          {sidebarOpen && (
            <span className="text-base font-bold text-foreground whitespace-nowrap">
              VBB Admin
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const accessible = canAccess(item.section);
          const active = isActive(item.path);

          if (!accessible) {
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        <Lock className="w-3.5 h-3.5" />
                      </>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Upgrade permissions to access
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="flex-1">{item.title}</span>
              )}
              {(item as any).badge && pendingCount > 0 && (
                <span className={cn(
                  "min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center",
                  active ? "bg-primary-foreground text-primary" : "bg-destructive text-destructive-foreground"
                )}>
                  {pendingCount > 99 ? "99+" : pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-1">
        {role && (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            {sidebarOpen && (
              <span className="capitalize">Role: <span className="font-medium text-foreground">{role}</span></span>
            )}
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(210,20%,96%)]">
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 hidden md:block",
          sidebarOpen ? "w-60" : "w-[68px]"
        )}
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-60 bg-background border-r border-border transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      <div className={cn("transition-all duration-300", sidebarOpen ? "md:ml-60" : "md:ml-[68px]")}>
        <header className="sticky top-0 z-30 h-16 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">
              {navItems.find((n) => isActive(n.path))?.title || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">
                  {displayName}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50 py-1">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{role}</p>
                    </div>
                    {canAccess("settings") && (
                      <Link
                        to="/admin/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                    )}
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={() => { setProfileOpen(false); handleSignOut(); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
