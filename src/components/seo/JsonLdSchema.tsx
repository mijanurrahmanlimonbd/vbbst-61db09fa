/**
 * JsonLdSchema — Injects JSON-LD structured data into <head>.
 * Respects admin toggles from site_settings.schema_config.
 */

import { Helmet } from "react-helmet-async";
import { useSchemaConfig } from "@/hooks/useSchemaConfig";
import { useBranding } from "@/hooks/useBranding";
import {
  combineSchemas,
  generateOrganization,
  generateLocalBusiness,
  generateWebSite,
  generateWebPage,
  generateBreadcrumbs,
  generateProduct,
  generateArticle,
  generateFAQPage,
  type BrandingData,
} from "@/lib/jsonLdSchemas";
import { getSiteUrl } from "@/lib/config";
import { useLocation } from "react-router-dom";

interface JsonLdSchemaProps {
  /** Page-level overrides */
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;
  datePublished?: string;
  dateModified?: string;
  /** Breadcrumb items (auto-generated from URL if not provided) */
  breadcrumbs?: { name: string; url: string }[];
  /** Product data for product pages */
  product?: any;
  /** Blog post data for article pages */
  article?: any;
  /** FAQ data for pages with FAQs */
  faqs?: { question: string; answer: string }[];
}

const JsonLdSchema = ({
  pageTitle,
  pageDescription,
  pageImage,
  datePublished,
  dateModified,
  breadcrumbs,
  product,
  article,
  faqs,
}: JsonLdSchemaProps) => {
  const { config, loading } = useSchemaConfig();
  const { branding } = useBranding();
  const location = useLocation();
  const siteUrl = getSiteUrl();

  if (loading) return null;

  const brandingData: BrandingData = {
    header_logo: branding.header_logo,
    site_title: branding.site_title,
  };

  const schemas: any[] = [];

  // 1. Organization (global)
  if (config.organization) {
    schemas.push(generateOrganization(brandingData));
  }

  // 2. LocalBusiness (global, if enabled)
  if (config.localBusiness) {
    schemas.push(generateLocalBusiness(brandingData));
  }

  // 3. WebSite + SearchAction (global)
  if (config.website) {
    schemas.push(generateWebSite(brandingData));
  }

  // 4. WebPage (every page)
  if (config.webPage && pageTitle) {
    schemas.push(
      generateWebPage({
        title: pageTitle,
        description: pageDescription || "",
        url: `${siteUrl}${location.pathname}`,
        image: pageImage,
        datePublished,
        dateModified,
      })
    );
  }

  // 5. BreadcrumbList
  if (config.breadcrumbList) {
    const crumbs = breadcrumbs || autoBreadcrumbs(location.pathname);
    if (crumbs.length > 0) {
      schemas.push(generateBreadcrumbs(crumbs));
    }
  }

  // 6. Product + Offer
  if (config.product && product) {
    schemas.push(generateProduct(product, brandingData));
  }

  // 7. Article
  if (config.article && article) {
    schemas.push(generateArticle(article, brandingData));
  }

  // 8. FAQPage
  if (config.faqPage && faqs && faqs.length > 0) {
    schemas.push(generateFAQPage(faqs));
  }

  const combined = combineSchemas(...schemas);
  if (!combined) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(combined)}
      </script>
    </Helmet>
  );
};

/** Auto-generate breadcrumbs from URL path */
function autoBreadcrumbs(pathname: string): { name: string; url: string }[] {
  const items: { name: string; url: string }[] = [{ name: "Home", url: "/" }];
  const parts = pathname.split("/").filter(Boolean);

  let path = "";
  for (const part of parts) {
    path += `/${part}`;
    const name = part
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ name, url: path });
  }

  return items;
}

export default JsonLdSchema;
