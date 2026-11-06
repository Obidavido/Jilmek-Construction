const configuredApiBase = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const configuredMediaBase = (import.meta.env.VITE_MEDIA_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Resolve a bundled image path through the cPanel API media directory when a
 * live API base is configured. Local `/images` remains the development fallback.
 */
export function mediaUrl(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  const mediaBase = configuredMediaBase || configuredApiBase.replace(/\/api\/v1$/, "");
  return mediaBase ? `${mediaBase}/media/${cleanPath}` : `/images/${cleanPath}`;
}

export function isApiMediaConfigured(): boolean {
  return Boolean(configuredMediaBase || configuredApiBase);
}
