export function shortUrl(base, id) {
  // Remove trailing slash from base to avoid double slashes
  const cleanBase = base.replace(/\/$/, '');
  return `${cleanBase}/${id}`;
}

export function resolveBaseUrl(request) {
  // Prefer environment variable, fallback to request origin
  return process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
}
