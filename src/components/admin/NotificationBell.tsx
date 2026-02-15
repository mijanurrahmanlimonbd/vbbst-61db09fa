import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ShoppingCart, Users, HeadphonesIcon, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const typeIcons: Record<string, typeof ShoppingCart> = {
  order: ShoppingCart,
  user: Users,
  support: HeadphonesIcon,
};

const typeColors: Record<string, string> = {
  order: "bg-primary/10 text-primary",
  user: "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)]",
  support: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
};

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setNotifications(data as Notification[]);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime listener
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => {
          fetchNotifications();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  const markAllRead = async () => {
    if (!user || unreadCount === 0) return;
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleClick = async (notif: Notification) => {
    if (!notif.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
    }
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 bg-background border border-border shadow-xl rounded-xl z-[100]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              const color = typeColors[notif.type] || "bg-accent text-muted-foreground";
              return (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={cn(
                    "flex items-start gap-3 w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border last:border-0",
                    !notif.is_read && "bg-primary/[0.03]"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm truncate", !notif.is_read ? "font-semibold text-foreground" : "text-foreground")}>
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{notif.message}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{timeAgo(notif.created_at)}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
