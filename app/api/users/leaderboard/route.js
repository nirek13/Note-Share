import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { getAuthenticatedUser } from "@/lib/middleware";

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get all user IDs
    const userIds = await kv.smembers("users:index");
    
    // Fetch all users and their stats
    const users = [];
    for (const userId of userIds) {
      const userData = await kv.get(`user:${userId}`);
      if (userData) {
        users.push({
          id: userData.id,
          name: userData.name,
          username: userData.username,
          totalLinks: userData.totalLinks || 0,
          totalClicks: userData.totalClicks || 0,
          createdAt: userData.createdAt,
          avgClicksPerLink: userData.totalLinks > 0 ? Math.round(userData.totalClicks / userData.totalLinks * 100) / 100 : 0
        });
      }
    }

    // Sort by total clicks (performance metric)
    const topPerformers = users
      .sort((a, b) => b.totalClicks - a.totalClicks)
      .slice(0, 20); // Top 20 performers

    // Also provide different ranking options
    const mostActive = users
      .sort((a, b) => b.totalLinks - a.totalLinks)
      .slice(0, 10);

    const bestConversion = users
      .filter(u => u.totalLinks >= 5) // Only users with at least 5 links
      .sort((a, b) => b.avgClicksPerLink - a.avgClicksPerLink)
      .slice(0, 10);

    return NextResponse.json({
      topPerformers,
      mostActive,
      bestConversion,
      totalUsers: users.length,
      totalLinks: users.reduce((sum, u) => sum + u.totalLinks, 0),
      totalClicks: users.reduce((sum, u) => sum + u.totalClicks, 0)
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to get leaderboard data" },
      { status: 500 }
    );
  }
}