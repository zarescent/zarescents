/** Client-side image prep for product uploads. */

export const PRODUCT_IMAGE_RECOMMENDED = {
  width: 1200,
  height: 1600,
  aspect: "3:4 portrait",
  maxUploadBytes: 5 * 1024 * 1024,
  maxEdge: 1600,
  webpQuality: 0.82,
} as const;

/**
 * Convert any browser-decodable image (PNG/JPEG/GIF/WebP) to WebP.
 * Resizes so the longest edge is at most `maxEdge` while keeping aspect ratio.
 * Falls back to the original file if WebP encoding is unavailable.
 */
export async function convertImageToWebp(
  file: File,
  options?: { maxEdge?: number; quality?: number }
): Promise<File> {
  const maxEdge = options?.maxEdge ?? PRODUCT_IMAGE_RECOMMENDED.maxEdge;
  const quality = options?.quality ?? PRODUCT_IMAGE_RECOMMENDED.webpQuality;

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  // Already small WebP — still re-encode to normalize size
  const bitmap = await createImageBitmap(file);
  try {
    let { width, height } = bitmap;
    const longest = Math.max(width, height);
    if (longest > maxEdge) {
      const scale = maxEdge / longest;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process image.");

    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/webp", quality);
    });

    if (!blob) {
      // Safari / older browsers without WebP encode support
      return file;
    }

    const base = file.name.replace(/\.[^.]+$/, "") || "product";
    return new File([blob], `${base}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}
