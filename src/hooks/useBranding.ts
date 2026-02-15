import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BrandingSettings {
  header_logo: string;
  footer_logo: string;
  favicon: string;
  invoice_logo: string;
  site_title: string;
}

const BRANDING_KEYS = ["header_logo", "footer_logo", "favicon", "invoice_logo", "site_title"];

export const useBranding = () => {
  const [branding, setBranding] = useState<BrandingSettings>({
    header_logo: "",
    footer_logo: "",
    favicon: "",
    invoice_logo: "",
    site_title: "VBB STORE",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", BRANDING_KEYS);

      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.key] = r.value; });
        setBranding((prev) => ({
          ...prev,
          header_logo: map.header_logo || "",
          footer_logo: map.footer_logo || "",
          favicon: map.favicon || "",
          invoice_logo: map.invoice_logo || "",
          site_title: map.site_title || "VBB STORE",
        }));
      }
      setLoading(false);
    };
    load();
  }, []);

  return { branding, loading };
};

/** Convert absolute Supabase URL to relative path for portability */
export const toRelativePath = (url: string): string => {
  if (!url) return url;
  try {
    const u = new URL(url);
    return u.pathname;
  } catch {
    return url;
  }
};
