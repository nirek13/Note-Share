import { kv } from "./kv";
import crypto from "crypto";

// Simple authentication utilities
export function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

export async function createUser(username) {
  const userId = crypto.randomUUID();
  const usernameLower = username.toLowerCase().trim();

  // Check if username already exists
  const existingUser = await kv.get(`user:username:${usernameLower}`);
  if (existingUser) {
    throw new Error('Username already taken');
  }

  const user = {
    id: userId,
    username: usernameLower,
    name: username, // Display name (with original casing)
    createdAt: new Date().toISOString(),
    totalLinks: 0,
    totalClicks: 0
  };

  // Store user data
  await kv.set(`user:${userId}`, user);
  await kv.set(`user:username:${usernameLower}`, userId);
  await kv.sadd("users:index", userId);

  return { id: userId, username: usernameLower, name: username, createdAt: user.createdAt };
}

export async function authenticateUser(username) {
  const usernameLower = username.toLowerCase().trim();
  const userId = await kv.get(`user:username:${usernameLower}`);
  if (!userId) {
    throw new Error('Username not found');
  }

  const user = await kv.get(`user:${userId}`);
  if (!user) {
    throw new Error('Username not found');
  }

  return { id: user.id, username: user.username, name: user.name };
}

export async function createSession(userId) {
  const sessionId = generateSessionId();
  const session = {
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };

  await kv.set(`session:${sessionId}`, session);
  return sessionId;
}

export async function getSessionUser(sessionId) {
  if (!sessionId) return null;

  const session = await kv.get(`session:${sessionId}`);
  if (!session) return null;

  // Check if session has expired
  if (new Date(session.expiresAt) < new Date()) {
    await kv.del(`session:${sessionId}`);
    return null;
  }

  const user = await kv.get(`user:${session.userId}`);
  if (!user) return null;

  return { id: user.id, username: user.username, name: user.name };
}

export async function destroySession(sessionId) {
  if (sessionId) {
    await kv.del(`session:${sessionId}`);
  }
}

export async function getUserById(userId) {
  const user = await kv.get(`user:${userId}`);
  if (!user) return null;

  return user;
}

export async function updateUserStats(userId, linksIncrement = 0, clicksIncrement = 0) {
  const user = await kv.get(`user:${userId}`);
  if (!user) return;

  user.totalLinks += linksIncrement;
  user.totalClicks += clicksIncrement;
  
  await kv.set(`user:${userId}`, user);
}