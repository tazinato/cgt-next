let profiles = [
  { id: 1, name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
  { id: 2, name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
];

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get("year") || "";
  const name = searchParams.get("name") || "";
  const major = searchParams.get("major") || "";

  let filteredProfiles = [...profiles];

  if (year) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.year === year
    );
  }

  if (name) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.name.includes(name)
    );
  }

  if (major) {
    filteredProfiles = filteredProfiles.filter(
      (profile) => profile.major.toLowerCase() === major
    );
  }
  return Response.json(filteredProfiles);

}

export async function POST(request) {
  const newProfile = await request.json();

  try {
    if (!newProfile.name || typeof newProfile.name !== "string") {
      return Response.json({ error: "Invalid name" }, { status: 400 });
    }

    if (!newProfile.major || typeof newProfile.major !== "string") {
      return Response.json({ error: "Invalid major" }, { status: 400 });
    }

    if (newProfile.year < 1 || newProfile.year > 4) {
      return Response.json({ error: "Invalid year" }, { status: 400 });
    }

    if (newProfile.gpa < 0 || newProfile.gpa > 4) {
      return Response.json({ error: "Invalid GPA" }, { status: 400 });
    }

    const createdProfile = {
      id: Date.now(),
      name: newProfile.name.trim(),
      major: newProfile.major,
      year: Number(newProfile.year),
      gpa: Number(newProfile.gpa),
    };

    profiles.push(createdProfile);

    return Response.json(createdProfile, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  const index = profiles.findIndex((profile) => profile.id === Number(id));

  if (index === -1) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  profiles.splice(index, 1);

  return Response.json({ message: "Profile deleted" }, { status: 200 });
}