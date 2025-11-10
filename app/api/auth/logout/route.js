import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST(request) {
  try {
    const sessionId = request.cookies.get('session_id')?.value;
    
    if (sessionId) {
      await destroySession(sessionId);
    }

    const response = NextResponse.json({ message: "Logout successful" });
    
    // Clear the session cookie
    response.cookies.set('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}