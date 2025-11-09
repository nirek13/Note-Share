import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { penseumUrl } from "@/lib/urls";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Fetch the record
    const record = await kv.get(`link:${id}`);

    if (!record) {
      return new NextResponse("Link not found", { status: 404 });
    }

    // Extract UTM parameters from query string
    const { searchParams } = request.nextUrl;
    const effectiveUtms = {
      utm_source: searchParams.get("utm_source") || record.utm_source,
      utm_medium: searchParams.get("utm_medium") || record.utm_medium,
      utm_campaign: searchParams.get("utm_campaign") || record.utm_campaign,
    };

    // Increment clicks
    record.clicks = (record.clicks || 0) + 1;
    await kv.set(`link:${id}`, record);

    // Build redirect URL
    const targetUrl = penseumUrl(id, effectiveUtms);

    // Return 302 redirect
    return NextResponse.redirect(targetUrl, { status: 302 });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
