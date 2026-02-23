import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Megaphone } from "lucide-react";

const AnnouncementBar = () => {
  useEffect(() => {
    const fetchNotice = async () => {
      const { data } = await supabase
        .from("site_notices")
        .select("id, message")
        .eq("is_active", true)
        .eq("type", "bar")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        const dismissedId = sessionStorage.getItem("dismissed_notice");
        if (dismissedId !== data.id) {
          toast(data.message, {
            icon: <Megaphone className="w-4 h-4 text-primary" />,
            duration: 10000,
            onDismiss: () => {
              sessionStorage.setItem("dismissed_notice", data.id);
            },
            onAutoClose: () => {
              sessionStorage.setItem("dismissed_notice", data.id);
            },
          });
        }
      }
    };
    fetchNotice();
  }, []);

  return null;
};

export default AnnouncementBar;
