/**
 * Single source of truth for turning whatever shape the API sends
 * (Cloudinary sub-document, plain string, nested field, array of
 * either) into a usable <img src>.
 *
 * The backend stores images as { public_id, secure_url, width, ... }
 * (see Backend/src/models/*.js) — there is NO `.url` field once the
 * document is saved (mongoose strips it, schema only declares
 * secure_url). A lot of the frontend was written checking `.url`
 * first, which is why cards showed text/data but no picture.
 *
 * Always resolve images through `pickImageUrl(...)` instead of
 * hand-rolled `?.url || ?.secure_url` chains.
 */

function fromObject(candidate) {
  if (!candidate || typeof candidate !== "object") return "";

  return (
    candidate.secure_url ||
    candidate.url ||
    candidate.src ||
    ""
  );
}

/**
 * Accepts any number of possible image sources in priority order.
 * Each source can be a string URL, a Cloudinary-style object, or an
 * array (first item is used). Returns the first usable URL, or "".
 */
export function pickImageUrl(...candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;

    if (typeof candidate === "string") {
      if (candidate.trim()) return candidate;
      continue;
    }

    if (Array.isArray(candidate)) {
      const nested = pickImageUrl(...candidate);
      if (nested) return nested;
      continue;
    }

    if (typeof candidate === "object") {
      const url = fromObject(candidate);
      if (url) return url;
    }
  }

  return "";
}

/** Convenience: resolve the cover/featured image off a blog/initiative/gallery item. */
export function getItemImage(item) {
  if (!item) return "";

  return pickImageUrl(
    item.featuredImage,
    item.coverImage,
    item.image,
    item.imageUrl,
    item.url,
    item.asset
  );
}
