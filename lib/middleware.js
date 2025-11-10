import { getSessionUser } from './auth';
import { NextResponse } from 'next/server';

export async function getAuthenticatedUser(request) {
  const sessionId = request.cookies.get('session_id')?.value;
  return await getSessionUser(sessionId);
}

export function requireAuth(handler) {
  return async (request, context) => {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user to the request context
    request.user = user;
    return handler(request, context);
  };
}

export function optionalAuth(handler) {
  return async (request, context) => {
    const user = await getAuthenticatedUser(request);
    request.user = user; // null if not authenticated
    return handler(request, context);
  };
}