import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { normalizeUrl } from "@/lib/validation";
import { shortUrl, resolveBaseUrl } from "@/lib/urls";

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate URL
    const normalizedUrl = normalizeUrl(url);
    
    // Generate a simple ID
    const id = Math.random().toString(36).substr(2, 9);

    // Create the record
    const record = {
      targetUrl: normalizedUrl,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    // Store in KV
    await kv.set(`link:${id}`, record);
    await kv.sadd("links:index", id);

    // Build and return short URL
    const baseUrl = resolveBaseUrl(request);
    const short = shortUrl(baseUrl, id);

    return NextResponse.json({ shortUrl: short });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create link" },
      { status: 400 }
    );
  }
}
