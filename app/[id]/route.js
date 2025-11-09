import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Fetch the record
    const record = await kv.get(`link:${id}`);

    if (!record) {
      return new NextResponse("Link not found", { status: 404 });
    }

    // Increment clicks
    record.clicks = (record.clicks || 0) + 1;
    await kv.set(`link:${id}`, record);

    // Return 302 redirect to the stored target URL
    return NextResponse.redirect(record.targetUrl, { status: 302 });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
