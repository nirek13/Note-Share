import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { processBatchInput } from "@/lib/validation";
import { shortUrl, resolveBaseUrl } from "@/lib/urls";

export async function POST(request) {
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

      // Create the record
      const record = {
        targetUrl: course.url,
        title: course.title,
        university: university || null,
        clicks: 0,
        createdAt: new Date().toISOString(),
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

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create links" },
      { status: 400 }
    );
  }
}