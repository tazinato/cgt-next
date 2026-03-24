let profiles = [
  { id: 1, name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
  { id: 2, name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
];

export async function GET(request, { params }) {
  const { id } = params;
  const profile = profiles.find((p) => p.id === Number(id));

  if (!profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  return Response.json(profile, { status: 200 });
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const index = profiles.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  const updates = await request.json();

  if (updates.year !== undefined && (updates.year < 1 || updates.year > 5)) {
    return Response.json(
      { error: "Year must be between 1 and 5" },
      { status: 400 }
    );
  }
  if (updates.gpa !== undefined && (updates.gpa < 0 || updates.gpa > 4)) {
    return Response.json(
      { error: "GPA must be between 0 and 4" },
      { status: 400 }
    );
  }

  profiles[index] = {
    ...profiles[index],
    ...updates,
  };

  return Response.json(profiles[index], { status: 200 });
}