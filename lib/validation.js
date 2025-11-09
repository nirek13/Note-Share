export function normalizeId(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Course ID or URL is required and must be a string");
  }
  
  const trimmed = input.trim();
  
  // Check if it's a full Penseum URL
  const penseumUrlMatch = trimmed.match(/^https:\/\/app\.penseum\.com\/course\/([^/?]+)(?:\?.*)?$/);
  if (penseumUrlMatch) {
    return penseumUrlMatch[1]; // Extract the course ID
  }
  
  // Otherwise treat as direct course ID (no validation)
  return trimmed;
}

export function normalizeTags(tags) {
  if (!tags || !Array.isArray(tags)) {
    return [];
  }
  
  // Lowercase, trim, deduplicate, filter empty
  const normalized = tags
    .map(tag => (typeof tag === "string" ? tag.toLowerCase().trim() : ""))
    .filter(tag => tag.length > 0);
  
  return [...new Set(normalized)];
}

export function validateUTMs(utm_source, utm_medium, utm_campaign) {
  const errors = [];
  
  if (!utm_source || typeof utm_source !== "string" || !utm_source.trim()) {
    errors.push("utm_source is required");
  }
  
  if (!utm_medium || typeof utm_medium !== "string" || !utm_medium.trim()) {
    errors.push("utm_medium is required");
  }
  
  if (!utm_campaign || typeof utm_campaign !== "string" || !utm_campaign.trim()) {
    errors.push("utm_campaign is required");
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }
  
  return {
    utm_source: utm_source.trim(),
    utm_medium: utm_medium.trim(),
    utm_campaign: utm_campaign.trim(),
  };
}
