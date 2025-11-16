import { kv } from "./kv";
import crypto from "crypto";

// Simple authentication utilities
export function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password, hashedPassword) {
  const inputHash = hashPassword(password);
  return inputHash === hashedPassword;
}

export async function createUser(username, password) {
  const userId = crypto.randomUUID();
  const usernameLower = username.toLowerCase().trim();

  // Check if username already exists
  const existingUser = await kv.get(`user:username:${usernameLower}`);
  if (existingUser) {
    throw new Error('Username already taken');
  }

  // Hash the password
  const hashedPassword = hashPassword(password);

  const user = {
    id: userId,
    username: usernameLower,
    name: username, // Display name (with original casing)
    passwordHash: hashedPassword,
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

export async function authenticateUser(username, password) {
  const usernameLower = username.toLowerCase().trim();
  const userId = await kv.get(`user:username:${usernameLower}`);
  if (!userId) {
    throw new Error('Invalid username or password');
  }

  const user = await kv.get(`user:${userId}`);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Verify password
  if (!verifyPassword(password, user.passwordHash)) {
    throw new Error('Invalid username or password');
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

export async function setDefaultPasswordsForLegacyUsers() {
  try {
    const userIds = await kv.smembers("users:index") || [];
    const defaultPassword = "penseum123";
    const hashedDefaultPassword = hashPassword(defaultPassword);
    
    for (const userId of userIds) {
      const user = await kv.get(`user:${userId}`);
      if (user && !user.passwordHash) {
        user.passwordHash = hashedDefaultPassword;
        await kv.set(`user:${userId}`, user);
      }
    }
    
    // Set flag to indicate passwords have been set
    await kv.set("legacy_passwords_set", true);
  } catch (error) {
    console.error("Failed to set default passwords:", error);
  }
}