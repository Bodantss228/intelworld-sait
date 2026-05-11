import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uuid, username } = authResult.payload;

    // Check if user has media role
    const roleResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/government/role?uuid=${uuid}`);
    if (!roleResponse.ok) {
      return NextResponse.json({ error: 'Failed to verify role' }, { status: 500 });
    }

    const roleData = await roleResponse.json();
    if (roleData.role !== 'media' && roleData.role !== 'president') {
      return NextResponse.json({ error: 'Недостаточно прав. Требуется роль СМИ.' }, { status: 403 });
    }

    // Get post data from request
    const body = await request.json();
    const { title, content, tags, imageUrl, videoUrl } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Send to Minecraft API
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/post/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: username,
        authorUuid: uuid,
        title,
        content,
        tags: tags || [],
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to create post' }, { status: response.status });
    }

    const post = await response.json();
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
