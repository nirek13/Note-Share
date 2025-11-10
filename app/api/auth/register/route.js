import { NextResponse } from "next/server";
import { createUser, createSession } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username } = await request.json();

    // Basic validation
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (username.length < 2) {
      return NextResponse.json(
        { error: "Username must be at least 2 characters long" },
        { status: 400 }
      );
    }

    if (username.length > 30) {
      return NextResponse.json(
        { error: "Username must be less than 30 characters" },
        { status: 400 }
      );
    }

    // Allow only alphanumeric, spaces, underscores, and hyphens
    if (!/^[a-zA-Z0-9 _-]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, spaces, underscores, and hyphens" },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(username);

    // Create session
    const sessionId = await createSession(user.id);

    // Set cookie and return user data
    const response = NextResponse.json({
      user: user,
      message: "Registration successful"
    });

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}