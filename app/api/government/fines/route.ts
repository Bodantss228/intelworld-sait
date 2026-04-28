import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://white.fnode.me:8228';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uuid = searchParams.get('uuid');

    let url = `${MINECRAFT_SERVER_URL}/api/government/fines`;
    if (uuid) {
      url += `?uuid=${uuid}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch fines' }, { status: response.status });
    }

    const fines = await response.json();
    return NextResponse.json(fines);
  } catch (error) {
    console.error('Error fetching fines:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
