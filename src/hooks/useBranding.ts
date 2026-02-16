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

/** Ensure a branding URL uses the public endpoint and has cache-busting */
const ensurePublicUrl = (url: string): string => {
  if (!url) return "";
  const base = url.split("?")[0];
  if (!base.startsWith("http")) {
    const { data } = supabase.storage.from("branding").getPublicUrl(base);
    return `${data.publicUrl}?v=${Date.now()}`;
  }
  const fixed = base.includes("/object/public/") ? base : base.replace("/object/", "/object/public/");
  return `${fixed}?v=${Date.now()}`;
};

export const useBranding = () => {
  const [branding, setBranding] = useState<BrandingSettings>({
    header_logo: "",
    footer_logo: "",
    favicon: "",
    invoice_logo: "",
    site_title: "Verified BM services",
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
        setBranding({
          header_logo: ensurePublicUrl(map.header_logo || ""),
          footer_logo: ensurePublicUrl(map.footer_logo || ""),
          favicon: ensurePublicUrl(map.favicon || ""),
          invoice_logo: ensurePublicUrl(map.invoice_logo || ""),
          site_title: map.site_title || "Verified BM services",
        });
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
