let profiles = [
  { id: 1, name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
  { id: 2, name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
];

function isValidGpa(gpa) {
  const n = Number(gpa);
  return !isNaN(n) && n >= 0 && n <= 4;
}

function isValidYear(year) {
  const n = Number(year);
  return !isNaN(n) && n >= 1 && n <= 4;
}

function isValidString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const major = searchParams.get("major");
  const year = searchParams.get("year");
  const name = searchParams.get("name");

  let filtered = profiles;

  if (major) {
    filtered = filtered.filter((p) => p.major === major);
  }
  if (year && !isNaN(year)) {
    filtered = filtered.filter((p) => p.year === Number(year));
  }
  if (name) {
    const lowerName = name.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(lowerName));
  }

  return Response.json(filtered, { status: 200 });
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
    return Response.json({ error: "Name must be a non‑empty string" }, { status: 400 });
  }
  if (!isValidString(major)) {
    return Response.json({ error: "Major must be a non‑empty string" }, { status: 400 });
  }
  if (!isValidYear(year)) {
    return Response.json({ error: "Year must be a number between 1 and 4" }, { status: 400 });
  }
  if (!isValidGpa(gpa)) {
    return Response.json({ error: "GPA must be a number between 0 and 4" }, { status: 400 });
  }

  const newProfile = {
    id: Date.now(),
    name,
    major,
    year,
    gpa,
  };

  profiles.push(newProfile);

  return Response.json(newProfile, { status: 201 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get("id");
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    return Response.json({ error: "Invalid or missing id" }, { status: 400 });
  }

  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, major, year, gpa } = body;

  if (name !== undefined && !isValidString(name)) {
    return Response.json({ error: "Name must be a non‑empty string" }, { status: 400 });
  }
  if (major !== undefined && !isValidString(major)) {
    return Response.json({ error: "Major must be a non‑empty string" }, { status: 400 });
  }
  if (year !== undefined && !isValidYear(year)) {
    return Response.json({ error: "Year must be a number between 1 and 4" }, { status: 400 });
  }
  if (gpa !== undefined && !isValidGpa(gpa)) {
    return Response.json({ error: "GPA must be a number between 0 and 4" }, { status: 400 });
  }

  profiles[index] = {
    ...profiles[index],
    name,
    major,
    year,
    gpa,
  };

  return Response.json(profiles[index], { status: 200 });
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get("id");
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    return Response.json({ error: "Invalid or missing id" }, { status: 400 });
  }

  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, major, year, gpa } = body;

  if (name !== undefined && !isValidString(name)) {
    return Response.json({ error: "Name must be a non‑empty string" }, { status: 400 });
  }
  if (major !== undefined && !isValidString(major)) {
    return Response.json({ error: "Major must be a non‑empty string" }, { status: 400 });
  }
  if (year !== undefined && !isValidYear(year)) {
    return Response.json({ error: "Year must be a number between 1 and 4" }, { status: 400 });
  }
  if (gpa !== undefined && !isValidGpa(gpa)) {
    return Response.json({ error: "GPA must be a number between 0 and 4" }, { status: 400 });
  }

  profiles[index] = {
    ...profiles[index],
    name,
    major,
    year,
    gpa,
  };

  return Response.json(profiles[index], { status: 200 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get("id");
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    return Response.json({ error: "Invalid or missing id" }, { status: 400 });
  }

  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  const deleted = profiles.splice(index, 1)[0];

  return Response.json({ message: "Profile deleted", data: deleted }, { status: 200 });
}