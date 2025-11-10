import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { processBatchInput } from "@/lib/validation";
import { shortUrl, resolveBaseUrl } from "@/lib/urls";
import { requireAuth } from "@/lib/middleware";
import { updateUserStats } from "@/lib/auth";

async function handler(request) {
  try {
    const body = await request.json();
    const { input, university } = body;

    // Parse batch input
    const courses = processBatchInput(input);

    const results = [];
    const baseUrl = resolveBaseUrl(request);

    // Process each course
    for (const course of courses) {
      // Generate a simple ID
      const id = Math.random().toString(36).substr(2, 9);

      // Create the record with creator info
      const record = {
        targetUrl: course.url,
        title: course.title,
        university: university || null,
        clicks: 0,
        createdAt: new Date().toISOString(),
        createdBy: request.user.id,
      };

      // Store in KV
      await kv.set(`link:${id}`, record);
      await kv.sadd("links:index", id);

      // Build short URL
      const short = shortUrl(baseUrl, id);

      results.push({
        title: course.title,
        shortUrl: short,
      });
    }

    // Update user's total links count
    await updateUserStats(request.user.id, courses.length, 0);

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create links" },
      { status: 400 }
    );
  }
}

export const POST = requireAuth(handler);