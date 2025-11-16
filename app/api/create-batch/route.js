import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { processBatchInput } from "@/lib/validation";
import { shortUrl, resolveBaseUrl } from "@/lib/urls";
import { requireAuth } from "@/lib/middleware";
import { updateUserStats } from "@/lib/auth";

async function handler(request) {
  try {
    const body = await request.json();
    const { input, university, confirmDuplicate = false } = body;

    // Parse batch input
    const courses = processBatchInput(input);

    // Check if university already exists (if provided)
    let universityRecord = null;
    if (university && university.trim()) {
      universityRecord = await findUniversityByName(university.trim());
      
      if (universityRecord && !confirmDuplicate) {
        // University exists and user hasn't confirmed to proceed
        return NextResponse.json({ 
          error: "UNIVERSITY_EXISTS",
          message: `Links for "${university}" have already been created. Do you want to proceed anyway?`,
          existingUniversity: universityRecord,
          requiresConfirmation: true
        }, { status: 409 });
      }
      
      // If university doesn't exist, create it
      if (!universityRecord) {
        universityRecord = await createUniversity(university.trim(), request.user.id);
      }
    }

    const results = [];
    const baseUrl = resolveBaseUrl(request);

    // Process each course
    for (const course of courses) {
      // Generate a simple ID
      const id = Math.random().toString(36).substr(2, 9);

      // Create the record with creator info
      const record = {
        targetUrl: course.url,
        title: course.title,
        university: university || null,
        universityId: universityRecord?.id || null,
        clicks: 0,
        createdAt: new Date().toISOString(),
        createdBy: request.user.id,
      };

      // Store in KV
      await kv.set(`link:${id}`, record);
      await kv.sadd("links:index", id);

      // Build short URL
      const short = shortUrl(baseUrl, id);

      results.push({
        title: course.title,
        shortUrl: short,
      });
    }

    // Update university stats if applicable
    if (universityRecord) {
      await updateUniversityStats(universityRecord.id, courses.length);
    }

    // Update user's total links count
    await updateUserStats(request.user.id, courses.length, 0);

    return NextResponse.json({ 
      results,
      university: universityRecord 
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create links" },
      { status: 400 }
    );
  }
}

async function findUniversityByName(name) {
  const universityIds = await kv.smembers("universities:index") || [];
  const nameLower = name.toLowerCase().trim();

  for (const id of universityIds) {
    const university = await kv.get(`university:${id}`);
    if (university && university.name.toLowerCase() === nameLower) {
      return { id, ...university };
    }
  }

  return null;
}

async function createUniversity(name, userId) {
  const id = generateUniversityId(name);
  const university = {
    name: name.trim(),
    linkCount: 0,
    createdAt: new Date().toISOString(),
    createdBy: userId,
    lastLinkCreated: null
  };

  await kv.set(`university:${id}`, university);
  await kv.sadd("universities:index", id);

  return { id, ...university };
}

async function updateUniversityStats(universityId, linkCount) {
  const university = await kv.get(`university:${universityId}`);
  if (university) {
    university.linkCount = (university.linkCount || 0) + linkCount;
    university.lastLinkCreated = new Date().toISOString();
    await kv.set(`university:${universityId}`, university);
  }
}

function generateUniversityId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50)
    + '_' + Math.random().toString(36).substr(2, 6);
}

export const POST = requireAuth(handler);