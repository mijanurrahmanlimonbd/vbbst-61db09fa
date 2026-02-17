/**
 * Dynamic site configuration.
 * Automatically detects the current domain so all URLs work
 * in development, preview, and production.
 */

export const SITE_NAME = "Verified BM Services";

/** Production domain — always used for canonical URLs, OG tags, invoices, etc. */
const PRODUCTION_URL = "https://verifiedbmservices.com";

/**
 * Returns the canonical site URL.
 * Always returns the production domain so that SEO tags, invoices, and
 * sitemaps never reference preview/staging URLs.
 */
export const getSiteUrl = (): string => {
  return PRODUCTION_URL;
};

export const DEFAULT_DESCRIPTION =
  "Secure, high-limit Verified Business Managers and WhatsApp Business API solutions for your advertising needs. Instant delivery at Verified BM Services.";
