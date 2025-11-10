import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { updateUserStats } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Fetch the record
    const record = await kv.get(`link:${id}`);

    if (!record) {
      return new NextResponse("Link not found", { status: 404 });
    }

    // Increment clicks and track timestamp
    record.clicks = (record.clicks || 0) + 1;

    // Track individual click timestamps
    if (!record.clickHistory) {
      record.clickHistory = [];
    }
    record.clickHistory.push({
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'Unknown',
      ip: request.headers.get('x-forwarded-for') || 'Unknown'
    });

    // Keep only last 100 clicks to prevent storage bloat
    if (record.clickHistory.length > 100) {
      record.clickHistory = record.clickHistory.slice(-100);
    }

    await kv.set(`link:${id}`, record);

    // Update creator's total clicks count
    if (record.createdBy) {
      await updateUserStats(record.createdBy, 0, 1);
    }

    // Return 302 redirect to the stored target URL
    return NextResponse.redirect(record.targetUrl, { status: 302 });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
