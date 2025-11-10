import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { normalizeUrl } from "@/lib/validation";
import { shortUrl, resolveBaseUrl } from "@/lib/urls";
import { requireAuth } from "@/lib/middleware";
import { updateUserStats } from "@/lib/auth";

async function handler(request) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate URL
    const normalizedUrl = normalizeUrl(url);

    // Generate a simple ID
    const id = Math.random().toString(36).substr(2, 9);

    // Create the record with creator info
    const record = {
      targetUrl: normalizedUrl,
      clicks: 0,
      createdAt: new Date().toISOString(),
      createdBy: request.user.id,
    };

    // Store in KV
    await kv.set(`link:${id}`, record);
    await kv.sadd("links:index", id);

    // Update user's total links count
    await updateUserStats(request.user.id, 1, 0);

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

export const POST = requireAuth(handler);
