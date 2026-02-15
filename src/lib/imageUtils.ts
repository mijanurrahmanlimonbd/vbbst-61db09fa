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
