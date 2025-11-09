export function shortUrl(base, id, utms) {
  const params = new URLSearchParams({
    utm_source: utms.utm_source,
    utm_medium: utms.utm_medium,
    utm_campaign: utms.utm_campaign,
  });
  
  // Remove trailing slash from base to avoid double slashes
  const cleanBase = base.replace(/\/$/, '');
  return `${cleanBase}/${id}?${params.toString()}`;
}

export function penseumUrl(id, utms) {
  const params = new URLSearchParams({
    utm_source: utms.utm_source,
    utm_medium: utms.utm_medium,
    utm_campaign: utms.utm_campaign,
  });
  
  return `https://app.penseum.com/course/${id}?${params.toString()}`;
}

export function resolveBaseUrl(request) {
  // Prefer environment variable, fallback to request origin
  return process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
}
