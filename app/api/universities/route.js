import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { requireAuth } from "@/lib/middleware";

async function handler(request) {
  try {
    if (request.method === "GET") {
      // Auto-initialize legacy universities if not already done
      await autoInitializeLegacyUniversities();
      
      // Get all universities
      const universityIds = await kv.smembers("universities:index") || [];
      const universities = [];

      for (const id of universityIds) {
        const university = await kv.get(`university:${id}`);
        if (university) {
          universities.push({
            id,
            ...university
          });
        }
      }

      return NextResponse.json(universities);
    }

    if (request.method === "POST") {
      const body = await request.json();
      const { name, password } = body;

      // Check password for manual operations
      if (password !== "penseum123") {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 403 }
        );
      }

      if (!name) {
        return NextResponse.json(
          { error: "University name is required" },
          { status: 400 }
        );
      }

      // Check if university already exists (case insensitive)
      const existingUniversity = await findUniversityByName(name);
      if (existingUniversity) {
        return NextResponse.json(
          { error: "University already exists", university: existingUniversity },
          { status: 409 }
        );
      }

      // Create new university
      const id = generateUniversityId(name);
      const university = {
        name: name.trim(),
        linkCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: request.user.id,
        lastLinkCreated: null
      };

      await kv.set(`university:${id}`, university);
      await kv.sadd("universities:index", id);

      return NextResponse.json({ id, ...university });
    }

    if (request.method === "DELETE") {
      const body = await request.json();
      const { id, password } = body;

      // Check password for manual operations
      if (password !== "penseum123") {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 403 }
        );
      }

      if (!id) {
        return NextResponse.json(
          { error: "University ID is required" },
          { status: 400 }
        );
      }

      // Check if university exists
      const university = await kv.get(`university:${id}`);
      if (!university) {
        return NextResponse.json(
          { error: "University not found" },
          { status: 404 }
        );
      }

      // Delete university
      await kv.del(`university:${id}`);
      await kv.srem("universities:index", id);

      return NextResponse.json({ message: "University deleted successfully" });
    }

    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
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

async function autoInitializeLegacyUniversities() {
  // Check if already initialized
  const initFlag = await kv.get("legacy_universities_initialized");
  if (initFlag) {
    return;
  }

  try {
    for (const universityName of LEGACY_UNIVERSITIES) {
      // Check if university already exists
      const existingUniversity = await findUniversityByName(universityName);
      
      if (!existingUniversity) {
        // Create new university
        const id = generateUniversityId(universityName);
        const university = {
          name: universityName.trim(),
          linkCount: 0,
          createdAt: new Date().toISOString(),
          createdBy: "system",
          lastLinkCreated: null,
          isLegacy: true
        };

        await kv.set(`university:${id}`, university);
        await kv.sadd("universities:index", id);
      }
    }

    // Set initialization flag
    await kv.set("legacy_universities_initialized", true);
  } catch (error) {
    console.error("Failed to auto-initialize legacy universities:", error);
  }
}

export const GET = requireAuth(handler);
export const POST = requireAuth(handler);
export const DELETE = requireAuth(handler);