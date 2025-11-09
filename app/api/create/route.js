import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { normalizeId, normalizeTags, validateUTMs } from "@/lib/validation";
import { shortUrl, resolveBaseUrl } from "@/lib/urls";

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, utm_source, utm_medium, utm_campaign, tags } = body;

    // Validate and normalize inputs
    const normalizedId = normalizeId(id);
    const utms = validateUTMs(utm_source, utm_medium, utm_campaign);
    const normalizedTags = normalizeTags(tags);

    // Create the record
    const record = {
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      clicks: 0,
      tags: normalizedTags,
    };

    // Store in KV with indexes
    await kv.set(`link:${normalizedId}`, record);
    await kv.sadd("links:index", normalizedId);

    // Add tag indexes
    for (const tag of normalizedTags) {
      await kv.sadd(`tag:${tag}`, normalizedId);
      await kv.sadd("tags:all", tag);
    }

    // Build and return short URL
    const baseUrl = resolveBaseUrl(request);
    const short = shortUrl(baseUrl, normalizedId, utms);

    return NextResponse.json({ shortUrl: short });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create link" },
      { status: 400 }
    );
  }
}
