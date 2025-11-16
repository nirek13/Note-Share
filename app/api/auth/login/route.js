import { NextResponse } from "next/server";
import { authenticateUser, createSession, setDefaultPasswordsForLegacyUsers } from "@/lib/auth";

export async function POST(request) {
  try {
    // Auto-set default passwords for legacy users
    await setDefaultPasswordsForLegacyUsers();
    
    const { username, password } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await authenticateUser(username, password);

    // Create session
    const sessionId = await createSession(user.id);

    // Set cookie and return user data
    const response = NextResponse.json({
      user: user,
      message: "Login successful"
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
      { error: error.message || "Login failed" },
      { status: 400 }
    );
  }
}