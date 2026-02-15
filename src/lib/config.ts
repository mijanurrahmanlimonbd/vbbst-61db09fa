/**
 * Dynamic site configuration.
 * Automatically detects the current domain so all URLs work
 * in development, preview, and production.
 */

export const SITE_NAME = "Verified BM service";

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
  "Buy Verified Business Manager, WhatsApp API, Facebook Ads accounts. Instant delivery, 7-day guarantee, 24/7 support.";
