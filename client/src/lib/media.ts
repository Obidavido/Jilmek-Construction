const configuredApiBase = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const configuredProjectMediaBase = (import.meta.env.VITE_MEDIA_BASE_URL ?? configuredApiBase.replace(/\/api$/, "")).replace(/\/$/, "");

/**
 * Resolve normal site assets from the Vercel frontend bundle.
 * Logos, hero images, service images, and UI imagery must not depend on the API.
 */
export function mediaUrl(path: string): string {
  return `/images/${path.replace(/^\/+/, "")}`;
}

/**
 * Resolve project/gallery images from the cPanel API media directory.
 * When the API is not configured, local project files remain a development fallback.
 */
export function projectMediaUrl(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  return configuredProjectMediaBase ? `${configuredProjectMediaBase}/media/${cleanPath}` : `/images/${cleanPath}`;
}

export function isApiMediaConfigured(): boolean {
  return Boolean(configuredProjectMediaBase);
}
