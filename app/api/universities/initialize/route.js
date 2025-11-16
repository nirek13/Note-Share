import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { requireAuth } from "@/lib/middleware";

const LEGACY_UNIVERSITIES = [
  "Texas A&M University",
  "Arizona State University", 
  "Brown University",
  "California State Polytechnic University Pomona",
  "Clemson University",
  "Columbia University",
  "City University of New York",
  "California State University Northridge",
  "Drexel University",
  "University of Edinburgh",
  "Emory University",
  "George Mason University",
  "Indiana University Bloomington",
  "Iowa State University",
  "Kansas State University",
  "Macquarie University",
  "Monash University",
  "University of Notre Dame",
  "Nanyang Technological University",
  "Queensland University of Technology",
  "RMIT University",
  "Rutgers University",
  "Technische Universität Berlin",
  "University of California Irvine",
  "University College Dublin",
  "University of California Davis",
  "University College London",
  "University of Central Florida",
  "University of Chicago",
  "University of Florida",
  "University of Massachusetts Amherst",
  "University of North Carolina at Charlotte",
  "University of New South Wales",
  "University of Guelph",
  "University of Toronto",
  "Ontario Tech University",
  "University of Queensland",
  "University of Sydney",
  "University of São Paulo",
  "University of Western Australia",
  "University at Buffalo",
  "University of Illinois Urbana–Champaign"
];

async function handler(request) {
  try {
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    let created = 0;
    let skipped = 0;
    const results = [];

    for (const universityName of LEGACY_UNIVERSITIES) {
      // Check if university already exists
      const existingUniversity = await findUniversityByName(universityName);
      
      if (existingUniversity) {
        skipped++;
        results.push({
          name: universityName,
          status: "skipped",
          reason: "already exists"
        });
        continue;
      }

      // Create new university
      const id = generateUniversityId(universityName);
      const university = {
        name: universityName.trim(),
        linkCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: "system", // Mark as system-created
        lastLinkCreated: null,
        isLegacy: true // Mark as legacy data
      };

      await kv.set(`university:${id}`, university);
      await kv.sadd("universities:index", id);
      
      created++;
      results.push({
        name: universityName,
        status: "created",
        id: id
      });
    }

    return NextResponse.json({
      message: `Initialization complete. Created ${created} universities, skipped ${skipped} existing ones.`,
      created,
      skipped,
      total: LEGACY_UNIVERSITIES.length,
      results
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to initialize universities" },
      { status: 500 }
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

function generateUniversityId(name) {
  // Create a simple ID based on university name
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50)
    + '_' + Math.random().toString(36).substr(2, 6);
}

export const POST = requireAuth(handler);