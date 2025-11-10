import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/middleware";

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get user data" },
      { status: 500 }
    );
  }
}