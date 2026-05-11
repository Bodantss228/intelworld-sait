import { NextRequest, NextResponse } from 'next/server';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');

    if (!uuid) {
      return NextResponse.json({ error: 'UUID is required' }, { status: 400 });
    }

    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/account/government?uuid=${uuid}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Government account not found' }, { status: response.status });
    }

    const account = await response.json();
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error fetching government account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { presidentUuid, presidentName } = body;

    if (!presidentUuid || !presidentName) {
      return NextResponse.json({ error: 'President UUID and name are required' }, { status: 400 });
    }

    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/account/government`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        presidentUuid,
        presidentName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to create government account' }, { status: response.status });
    }

    const account = await response.json();
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error creating government account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
