import { useState, useEffect, useCallback } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useBranding } from "@/hooks/useBranding";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
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
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/admin/NotificationBell";

const navItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard, section: "dashboard" },
  { title: "Messages", path: "/admin/messages", icon: MessageSquare, section: "dashboard" },
  { title: "Posts", path: "/admin/posts", icon: FileText, section: "posts" },
  { title: "Pages", path: "/admin/pages", icon: File, section: "pages" },
  { title: "Products", path: "/admin/products", icon: Package, section: "dashboard" },
  { title: "Orders", path: "/admin/orders", icon: ShoppingCart, section: "dashboard" },
  { title: "Comments", path: "/admin/comments", icon: MessageCircle, section: "posts", badge: true },
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
  const { branding } = useBranding();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const location = useLocation();

  const handleSyncSite = useCallback(async () => {
    setSyncing(true);
    try {
      // 1. Update site_version timestamp in settings
      await supabase.from("site_settings").upsert(
        { key: "site_version", value: new Date().toISOString() },
        { onConflict: "key" }
      );

      // 2. Invalidate all React Query caches
      await queryClient.invalidateQueries();

      // 3. Clear localStorage caches (page content etc.)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("page_") || k.startsWith("cache_") || k.startsWith("content_"))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // 4. Fetch with no-cache to bust Hostinger/CDN cache
      await fetch(window.location.origin, {
        method: "HEAD",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      }).catch(() => {});

      toast({
        title: "Site Cache Cleared & Data Synced!",
        description: "All caches have been invalidated and data refreshed.",
      });
    } catch (err) {
      toast({
        title: "Sync failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  }, [queryClient]);

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
    <div className="flex flex-col h-full bg-[hsl(220,20%,14%)] text-white">
      <div className="h-16 flex items-center justify-center px-4 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-2 min-w-0">
          {branding.header_logo ? (
            <img
              src={branding.header_logo}
              alt={branding.site_title || "Admin"}
              className="max-h-[50px] w-auto object-contain"
            />
          ) : (
            sidebarOpen ? (
              <span className="text-lg font-bold text-white whitespace-nowrap truncate">
                {branding.site_title || "VBB Admin"}
              </span>
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                {(branding.site_title || "VS").substring(0, 2).toUpperCase()}
              </div>
            )
          )}
        </Link>
      </div>

      {sidebarOpen && (
        <a
          href={window.location.origin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mx-3 mt-3 mb-1 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          <span>View Site</span>
        </a>
      )}

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const accessible = canAccess(item.section);
          const active = isActive(item.path);

          if (!accessible) {
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/20 cursor-not-allowed">
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
                  : "text-white/70 hover:bg-white/10 hover:text-white"
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

      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        {role && sidebarOpen && (
          <div className="px-3 py-1.5 text-xs text-white/40">
            <span className="capitalize">Role: <span className="font-medium text-white/70">{role}</span></span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(210,20%,96%)]">
      {branding.favicon && (
        <Helmet>
          <link rel="icon" href={branding.favicon} type="image/png" />
        </Helmet>
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-[hsl(220,20%,14%)] border-r border-white/10 transition-all duration-300 hidden md:block",
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
          "fixed top-0 left-0 z-50 h-screen w-60 bg-[hsl(220,20%,14%)] border-r border-white/10 transition-transform duration-300 md:hidden",
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

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSyncSite}
                  disabled={syncing}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors relative disabled:opacity-50"
                >
                  <RefreshCw className={cn("w-5 h-5", syncing && "animate-spin")} />
                </button>
              </TooltipTrigger>
              <TooltipContent>{syncing ? "Syncing..." : "Clear Cache & Sync Site"}</TooltipContent>
            </Tooltip>

            <NotificationBell />

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
