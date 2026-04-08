import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const title = searchParams.get('title') || '';

    const profiles = await prisma.profiles.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
        ],
        title: title
          ? { contains: title, mode: 'insensitive' }
          : undefined,
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const title = formData.get('title');
    const email = formData.get('email');
    const bio = formData.get('bio');
    const imgFile = formData.get('img');

    if (!name?.trim() || !title?.trim() || !email?.trim() || !bio?.trim()) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (!imgFile || !imgFile.size) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 });
    }

    if (imgFile.size > 1024 * 1024) {
      return NextResponse.json({ error: 'Image <1MB' }, { status: 400 });
    }

    const blob = await put(imgFile.name, imgFile, {
      access: 'public',
      addRandomSuffix: true,
    });

    const profile = await prisma.profiles.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        bio: bio.trim(),
        image_url: blob.url,
      },
    });

    return NextResponse.json({ data: profile }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}