import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { getUserById } from "@/lib/auth";

export async function GET() {
  try {
    // Get all link IDs from the index
    const ids = await kv.smembers("links:index");

    if (!ids || ids.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch all records
    const links = [];
    const userCache = {}; // Cache user data to avoid duplicate fetches

    for (const id of ids) {
      const record = await kv.get(`link:${id}`);
      if (record && record.targetUrl) {
        // Fetch creator info if available
        let creatorName = null;
        let creatorUsername = null;

        if (record.createdBy) {
          if (!userCache[record.createdBy]) {
            const user = await getUserById(record.createdBy);
            userCache[record.createdBy] = user;
          }
          const creator = userCache[record.createdBy];
          if (creator) {
            creatorName = creator.name;
            creatorUsername = creator.username;
          }
        }

        // Only include records with valid targetUrl
        links.push({
          id,
          targetUrl: record.targetUrl,
          title: record.title || null,
          university: record.university || null,
          clicks: record.clicks || 0,
          createdAt: record.createdAt || null,
          createdBy: record.createdBy || null,
          creatorName,
          creatorUsername,
        });
      } else if (record) {
        // Clean up malformed records
        await kv.del(`link:${id}`);
        await kv.srem("links:index", id);
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
