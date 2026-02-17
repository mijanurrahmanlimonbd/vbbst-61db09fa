import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_NAME, getSiteUrl, DEFAULT_DESCRIPTION } from "@/lib/config";
import { toBrandedUrl } from "@/lib/imageUtils";

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const SEOHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SEOHeadProps) => {
  const location = useLocation();
  const siteUrl = getSiteUrl();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = `${siteUrl}${location.pathname}`;
  const resolvedOgImage = toBrandedUrl(ogImage || `https://verifiedbmservices.com/favicon.png`);

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description.slice(0, 160)} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description.slice(0, 160)} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description.slice(0, 160)} />
      <meta name="twitter:image" content={resolvedOgImage} />
    </Helmet>
  );
};

export default SEOHead;
