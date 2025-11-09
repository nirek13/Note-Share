import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const record = await kv.get(`link:${id}`);
    
    if (!record) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: record.id,
      title: record.title,
      targetUrl: record.targetUrl,
      university: record.university,
      clicks: record.clicks || 0,
      createdAt: record.createdAt,
      clickHistory: record.clickHistory || []
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch link details" },
      { status: 500 }
    );
  }
}