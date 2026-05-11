import { NextRequest, NextResponse } from 'next/server';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uuid = searchParams.get('uuid');

    if (!uuid) {
      return NextResponse.json({ error: 'UUID required' }, { status: 400 });
    }

    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/role?uuid=${uuid}`);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch role' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
