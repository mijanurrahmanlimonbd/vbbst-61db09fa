const SUPABASE_STORAGE_BASE = "https://xukkejkvcgixogvbllmf.supabase.co/storage/v1/object/public/media/";
const BRANDED_DOMAIN = "https://verifiedbm.shop";
const BRANDED_MEDIA_PATH = `${BRANDED_DOMAIN}/media/`;

/**
 * Convert a Supabase storage URL to a branded domain URL.
 * e.g. https://xukkej...supabase.co/storage/v1/object/public/media/image.webp
 *   → https://verifiedbm.shop/media/image.webp
 */
export const toBrandedUrl = (url: string): string => {
  if (!url) return url;
  // Only apply branded URLs on the production domain
  const isProduction = typeof window !== "undefined" && window.location.hostname === "verifiedbm.shop";
  if (!isProduction) return url;
  if (url.startsWith(SUPABASE_STORAGE_BASE)) {
    const path = url.substring(SUPABASE_STORAGE_BASE.length).split("?")[0];
    return `${BRANDED_MEDIA_PATH}${path}`;
  }
  // Also handle branding bucket
  const brandingBase = "https://xukkejkvcgixogvbllmf.supabase.co/storage/v1/object/public/branding/";
  if (url.startsWith(brandingBase)) {
    const path = url.substring(brandingBase.length).split("?")[0];
    return `${BRANDED_DOMAIN}/branding/${path}`;
  }
  return url;
};

/**
 * Convert an image File to WebP format at specified quality using Canvas API.
 * Returns the original file if conversion fails or file is already WebP.
 */
export const convertToWebP = async (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  // Already WebP — skip
  if (file.type === "image/webp") return file;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            // Build new filename with .webp extension
            const baseName = file.name.replace(/\.[^.]+$/, "");
            const webpFile = new File([blob], `${baseName}.webp`, {
              type: "image/webp",
            });
            resolve(webpFile);
          },
          "image/webp",
          quality
        );
      } catch {
        resolve(file);
      }
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};
