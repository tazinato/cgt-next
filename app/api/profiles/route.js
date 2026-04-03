import { NextResponse } from 'next/server';
import prisma from '../../../app/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title') || '';
  const search = searchParams.get('search') || '';

  const profiles = await prisma.profiles.findMany({
    where: {
      AND: [
        ...(title ? [{ title: { contains: title, mode: 'insensitive' } }] : []),
        ...(search ? [{ name: { contains: search, mode: 'insensitive' } }] : []),
      ],
    },
  });

  return NextResponse.json({ data: profiles }, { status: 200 });
}

export async function POST(request) {
  try {
    const jsonData = await request.json();
    const { name, title, email, bio, image_url } = jsonData;

    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    if (!bio?.trim()) return NextResponse.json({ error: 'Bio required' }, { status: 400 });

    const created = await prisma.profiles.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        bio: bio.trim(),
        image_url: image_url || null,
      },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}