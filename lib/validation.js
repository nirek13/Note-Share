export function normalizeUrl(input) {
  if (!input || typeof input !== "string") {
    throw new Error("URL is required and must be a string");
  }
  
  const trimmed = input.trim();
  
  // Check if it's a Penseum URL (course or shared)
  const penseumUrlMatch = trimmed.match(/^https:\/\/app\.penseum\.com\/(course|shared\/shared-course)\/([^/?]+)(?:\?.*)?$/);
  if (penseumUrlMatch) {
    return trimmed; // Return full URL
  }
  
  throw new Error("Please provide a valid Penseum URL");
}

export function processBatchInput(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Input is required and must be a string");
  }
  
  const lines = input.trim().split('\n');
  const courses = [];
  
  for (let i = 0; i < lines.length; i += 2) {
    const title = lines[i]?.trim();
    const url = lines[i + 1]?.trim();
    
    if (title && url) {
      try {
        const normalizedUrl = normalizeUrl(url);
        courses.push({ title, url: normalizedUrl });
      } catch (error) {
        throw new Error(`Invalid URL on line ${i + 2}: ${error.message}`);
      }
    }
  }
  
  if (courses.length === 0) {
    throw new Error("No valid course/URL pairs found");
  }
  
  return courses;
}
