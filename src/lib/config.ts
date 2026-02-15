/**
 * Dynamic site configuration.
 * Automatically detects the current domain so all URLs work
 * in development, preview, and production.
 */

export const SITE_NAME = "Verified BM services";

/**
 * Returns the base URL of the site.
 * - In the browser: uses window.location.origin (works on any domain).
 * - During SSR/build: falls back to VITE_SITE_URL env var or a sensible default.
 */
export const getSiteUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return import.meta.env.VITE_SITE_URL || "https://verifiedbmservices.com";
};

export const DEFAULT_DESCRIPTION =
  "Secure, high-limit Verified Business Managers and WhatsApp Business API solutions for your advertising needs. Instant delivery at Verified BM services.";
