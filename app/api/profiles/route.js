import sql from '@/app/db';

async function getProfiles(filters = {}) {
  let query = 'SELECT * FROM profiles';
  const params = [];

  const { major, year, name } = filters;

  if (major) {
    params.push(major);
    query += ` WHERE major = $${params.length}`;
  }

  if (year) {
    params.push(year);
    if (params.length === 1) {
      query += ` WHERE year = $${params.length}`;
    } else {
      query += ` AND year = $${params.length}`;
    }
  }

  if (name) {
    params.push(`%${name.toLowerCase()}%`);
    if (params.length === 1) {
      query += ` WHERE LOWER(name) LIKE $${params.length}`;
    } else {
      query += ` AND LOWER(name) LIKE $${params.length}`;
    }
  }

  const rows = await sql.unsafe(query, params);
  return rows.map(r => ({
    ...r,
    year: Number(r.year),
    gpa: Number(r.gpa),
  }));
}

async function createProfile(profile) {
  const { name, major, year, gpa } = profile;
  const [row] = await sql`
    INSERT INTO profiles (name, major, year, gpa)
    VALUES (${name}, ${major}, ${year}, ${gpa})
    RETURNING *
  `;
  return {
    ...row,
    year: Number(row.year),
    gpa: Number(row.gpa),
  };
}

async function getProfileById(id) {
  const [row] = await sql`
    SELECT * FROM profiles WHERE id = ${id}
  `;
  if (!row) return null;
  return {
    ...row,
    year: Number(row.year),
    gpa: Number(row.gpa),
  };
}

async function updateProfile(id, updates) {
  const { name, major, year, gpa } = updates;

  const fragments = [];
  const values = [];

  if (name !== undefined) {
    values.push(name);
    fragments.push(`name = $${values.length}`);
  }
  if (major !== undefined) {
    values.push(major);
    fragments.push(`major = $${values.length}`);
  }
  if (year !== undefined) {
    values.push(year);
    fragments.push(`year = $${values.length}`);
  }
  if (gpa !== undefined) {
    values.push(gpa);
    fragments.push(`gpa = $${values.length}`);
  }

  if (fragments.length === 0) return await getProfileById(id);

  values.push(id);
  const [row] = await sql.unsafe(`
    UPDATE profiles
    SET ${fragments.join(', ')}
    WHERE id = $${values.length}
    RETURNING *
  `, values);

  return {
    ...row,
    year: Number(row.year),
    gpa: Number(row.gpa),
  };
}

async function deleteProfile(id) {
  const [row] = await sql`
    DELETE FROM profiles
    WHERE id = ${id}
    RETURNING *
  `;
  return row;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const major = searchParams.get('major');
  const year = searchParams.get('year');
  const name = searchParams.get('name');

  const filtered = await getProfiles({ major, year, name });
  return Response.json(filtered, { status: 200 });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, major, year, gpa } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return Response.json({ error: 'Name must be a non‑empty string' }, { status: 400 });
  }
  if (typeof major !== 'string' || major.trim().length === 0) {
    return Response.json({ error: 'Major must be a non‑empty string' }, { status: 400 });
  }
  if (!Number.isInteger(year) || year < 1 || year > 4) {
    return Response.json({ error: 'Year must be an integer between 1 and 4' }, { status: 400 });
  }
  if (typeof gpa !== 'number' || gpa < 0 || gpa > 4) {
    return Response.json({ error: 'GPA must be a number between 0 and 4' }, { status: 400 });
  }

  try {
    const newProfile = await createProfile({ name, major, year, gpa });
    return Response.json(newProfile, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    return Response.json({ error: 'Invalid or missing id' }, { status: 400 });
  }

  const exists = await getProfileById(id);
  if (!exists) {
    return Response.json({ error: 'Profile not found' }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, major, year, gpa } = body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    return Response.json({ error: 'Name must be a non‑empty string' }, { status: 400 });
  }
  if (major !== undefined && (typeof major !== 'string' || major.trim().length === 0)) {
    return Response.json({ error: 'Major must be a non‑empty string' }, { status: 400 });
  }
  if (year !== undefined && (!Number.isInteger(year) || year < 1 || year > 4)) {
    return Response.json({ error: 'Year must be an integer between 1 and 4' }, { status: 400 });
  }
  if (gpa !== undefined && (typeof gpa !== 'number' || gpa < 0 || gpa > 4)) {
    return Response.json({ error: 'GPA must be a number between 0 and 4' }, { status: 400 });
  }

  try {
    const updated = await updateProfile(id, { name, major, year, gpa });
    return Response.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    return Response.json({ error: 'Invalid or missing id' }, { status: 400 });
  }

  const exists = await getProfileById(id);
  if (!exists) {
    return Response.json({ error: 'Profile not found' }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, major, year, gpa } = body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    return Response.json({ error: 'Name must be a non‑empty string' }, { status: 400 });
  }
  if (major !== undefined && (typeof major !== 'string' || major.trim().length === 0)) {
    return Response.json({ error: 'Major must be a non‑empty string' }, { status: 400 });
  }
  if (year !== undefined && (!Number.isInteger(year) || year < 1 || year > 4)) {
    return Response.json({ error: 'Year must be an integer between 1 and 4' }, { status: 400 });
  }
  if (gpa !== undefined && (typeof gpa !== 'number' || gpa < 0 || gpa > 4)) {
    return Response.json({ error: 'GPA must be a number between 0 and 4' }, { status: 400 });
  }

  try {
    const updated = await updateProfile(id, { name, major, year, gpa });
    return Response.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    return Response.json({ error: 'Invalid or missing id' }, { status: 400 });
  }

  const deleted = await deleteProfile(id);
  if (!deleted) {
    return Response.json({ error: 'Profile not found' }, { status: 404 });
  }

  return Response.json({ message: 'Profile deleted', data: deleted }, { status: 200 });
}