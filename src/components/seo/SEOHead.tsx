import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_NAME, getSiteUrl, DEFAULT_DESCRIPTION } from "@/lib/config";
import { toBrandedUrl } from "@/lib/imageUtils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBranding } from "@/hooks/useBranding";

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  keywords?: string;
}

const SEOHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage,
  ogType = "website",
  noIndex = false,
  keywords,
}: SEOHeadProps) => {
  const location = useLocation();
  const siteUrl = getSiteUrl();
  const { branding } = useBranding();
  const dynamicSiteName = branding.site_title || SITE_NAME;
  const fullTitle = title ? `${title} | ${dynamicSiteName}` : dynamicSiteName;
  const canonicalUrl = `${siteUrl}${location.pathname}`;
  const defaultOgImage = `${siteUrl}/og-image.webp`;
  const resolvedOgImage = toBrandedUrl(ogImage || defaultOgImage);

  const [googleVerification, setGoogleVerification] = useState("");
  const [bingVerification, setBingVerification] = useState("");

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["seo_search_console_tag", "seo_bing_verification_tag"])
      .then(({ data }) => {
        data?.forEach((r) => {
          if (r.key === "seo_search_console_tag" && r.value) {
            // Extract content value from full meta tag or plain value
            const match = r.value.match(/content="([^"]+)"/);
            setGoogleVerification(match ? match[1] : r.value);
          }
          if (r.key === "seo_bing_verification_tag" && r.value) {
            setBingVerification(r.value);
          }
        });
      });
  }, []);

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description.slice(0, 160)} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Search engine verification */}
      {googleVerification && <meta name="google-site-verification" content={googleVerification} />}
      {bingVerification && <meta name="msvalidate.01" content={bingVerification} />}

      {/* Hreflang — English only */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <meta name="language" content="en" />

      {/* Open Graph (Facebook, LinkedIn, WhatsApp, Telegram, Discord) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description.slice(0, 160)} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={dynamicSiteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@VerifiedBMStore" />
      <meta name="twitter:creator" content="@VerifiedBMStore" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description.slice(0, 160)} />
      <meta name="twitter:image" content={resolvedOgImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Pinterest */}
      <meta property="pin:media" content={resolvedOgImage} />
      <meta property="pin:description" content={description.slice(0, 160)} />

      {/* Dynamic favicon from branding settings */}
      {branding.favicon && <link rel="icon" href={branding.favicon} type="image/webp" />}
    </Helmet>
  );
};

export default SEOHead;
