import prisma from "../../lib/prisma";

function isValidString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidYear(year) {
  const n = Number(year);
  return Number.isInteger(n) && n >= 1 && n <= 4;
}

function isValidGpa(gpa) {
  const n = Number(gpa);
  return !isNaN(n) && n >= 0 && n <= 4;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const major = searchParams.get("major");
  const year = searchParams.get("year");
  const name = searchParams.get("name");

  const where = {};

  if (major) where.major = major;
  if (year) where.year = Number(year);
  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  const profiles = await prisma.profile.findMany({
    where,
    orderBy: { id: "asc" },
  });

  return Response.json(profiles, { status: 200 });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, major, year, gpa } = body;

  if (!isValidString(name)) {
    return Response.json({ error: "Name must be a non-empty string" }, { status: 400 });
  }
  if (!isValidString(major)) {
    return Response.json({ error: "Major must be a non-empty string" }, { status: 400 });
  }
  if (!isValidYear(year)) {
    return Response.json({ error: "Year must be an integer between 1 and 4" }, { status: 400 });
  }
  if (!isValidGpa(gpa)) {
    return Response.json({ error: "GPA must be a number between 0 and 4" }, { status: 400 });
  }

  const newProfile = await prisma.profile.create({
    data: {
      name,
      major,
      year: Number(year),
      gpa: Number(gpa),
    },
  });

  return Response.json(newProfile, { status: 201 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get("id");
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    return Response.json({ error: "Invalid or missing id" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await prisma.profile.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  const { name, major, year, gpa } = body;

  if (name !== undefined && !isValidString(name)) {
    return Response.json({ error: "Name must be a non-empty string" }, { status: 400 });
  }
  if (major !== undefined && !isValidString(major)) {
    return Response.json({ error: "Major must be a non-empty string" }, { status: 400 });
  }
  if (year !== undefined && !isValidYear(year)) {
    return Response.json({ error: "Year must be an integer between 1 and 4" }, { status: 400 });
  }
  if (gpa !== undefined && !isValidGpa(gpa)) {
    return Response.json({ error: "GPA must be a number between 0 and 4" }, { status: 400 });
  }

  const updated = await prisma.profile.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(major !== undefined ? { major } : {}),
      ...(year !== undefined ? { year: Number(year) } : {}),
      ...(gpa !== undefined ? { gpa: Number(gpa) } : {}),
    },
  });

  return Response.json(updated, { status: 200 });
}

export async function PATCH(request) {
  return PUT(request);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get("id");
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    return Response.json({ error: "Invalid or missing id" }, { status: 400 });
  }

  const existing = await prisma.profile.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  const deleted = await prisma.profile.delete({
    where: { id },
  });

  return Response.json({ message: "Profile deleted", data: deleted }, { status: 200 });
}