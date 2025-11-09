import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";

export async function GET() {
  try {
    // Get all link IDs from the index
    const ids = await kv.smembers("links:index");

    if (!ids || ids.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch all records
    const links = [];
    for (const id of ids) {
      const record = await kv.get(`link:${id}`);
      if (record) {
        links.push({
          id,
          targetUrl: record.targetUrl,
          title: record.title || null,
          university: record.university || null,
          clicks: record.clicks || 0,
          createdAt: record.createdAt,
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
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
