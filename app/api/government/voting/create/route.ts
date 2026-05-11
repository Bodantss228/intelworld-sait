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

    // Get voting data from request
    const body = await request.json();
    const { title, description, durationHours, options, imageUrl, anonymous } = body;

    if (!title || !description || !options || options.length < 2) {
      return NextResponse.json({ error: 'Title, description and at least 2 options are required' }, { status: 400 });
    }

    // Send to Minecraft API
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/voting/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        createdBy: username,
        creatorUuid: uuid,
        title,
        description,
        durationHours: durationHours || 48,
        options,
        imageUrl: imageUrl || null,
        anonymous: anonymous || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to create voting' }, { status: response.status });
    }

    const voting = await response.json();
    return NextResponse.json(voting);
  } catch (error) {
    console.error('Error creating voting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
