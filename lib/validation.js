export function normalizeUrl(input) {
  if (!input || typeof input !== "string") {
    throw new Error("URL is required and must be a string");
  }
  
  const trimmed = input.trim();
  
  // Check if it's a full Penseum URL
  const penseumUrlMatch = trimmed.match(/^https:\/\/app\.penseum\.com\/course\/([^/?]+)(?:\?.*)?$/);
  if (penseumUrlMatch) {
    return trimmed; // Return full URL
  }
  
  throw new Error("Please provide a valid Penseum course URL");
}
