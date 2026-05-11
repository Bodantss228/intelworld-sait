import { NextRequest, NextResponse } from 'next/server';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '10';

    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/posts?limit=${limit}`);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: response.status });
    }

    const posts = await response.json();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
