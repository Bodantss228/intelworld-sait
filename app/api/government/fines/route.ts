import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uuid: sessionUuid, role, roles } = authResult.payload;
    const isPresident = role === 'president' || (Array.isArray(roles) && roles.includes('president'));

    const searchParams = request.nextUrl.searchParams;
    const requestedUuid = searchParams.get('uuid');

    // Только президент может видеть штрафы других игроков / все штрафы.
    // Для остальных всегда возвращаем только их штрафы, независимо от query-параметра.
    const effectiveUuid = isPresident ? requestedUuid : sessionUuid;

    let url = `${MINECRAFT_SERVER_URL}/api/government/fines`;
    if (effectiveUuid) {
      url += `?uuid=${effectiveUuid}`;
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
