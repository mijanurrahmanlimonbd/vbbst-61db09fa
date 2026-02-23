import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

const AnnouncementBar = () => {
  const [notice, setNotice] = useState<{ id: string; message: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

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
        if (dismissedId !== data.id) setNotice(data);
      }
    };
    fetchNotice();
  }, []);

  if (!notice || dismissed) return null;

  return (
    <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4 relative z-50">
      <span>{notice.message}</span>
      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem("dismissed_notice", notice.id);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
