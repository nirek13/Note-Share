import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Check if the link exists
    const record = await kv.get(`link:${id}`);
    if (!record) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Delete the link record
    await kv.del(`link:${id}`);
    
    // Remove from the index
    await kv.srem("links:index", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}