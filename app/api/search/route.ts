import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query?.trim()) {
    return NextResponse.json({ users: [], stories: [] });
  }

  try {
    // Search users by name, username, or email
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true
      },
      take: 5
    });

    // Search published stories by title or content
    const stories = await prisma.post.findMany({
      where: {
        AND: [
          { status: 'PUBLISHED' },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 10
    });

    return NextResponse.json({ users, stories });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ users: [], stories: [] });
  }
}