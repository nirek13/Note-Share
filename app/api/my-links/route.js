import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { requireAuth } from "@/lib/middleware";

async function handler(request) {
  try {
    // Get all link IDs from the index
    const ids = await kv.smembers("links:index");

    if (!ids || ids.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch all records and filter by creator
    const links = [];
    for (const id of ids) {
      const record = await kv.get(`link:${id}`);
      if (record && record.targetUrl && record.createdBy === request.user.id) {
        // Only include records created by this user
        links.push({
          id,
          targetUrl: record.targetUrl,
          title: record.title || null,
          university: record.university || null,
          clicks: record.clicks || 0,
          createdAt: record.createdAt || null,
          createdBy: record.createdBy,
        });
      }
    }

    return NextResponse.json(links, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch your links" },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
