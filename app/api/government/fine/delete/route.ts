import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uuid, role, roles } = authResult.payload;
    const isPresident = role === 'president' || (Array.isArray(roles) && roles.includes('president'));
    if (!isPresident) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    const body = await request.json();
    const { fineId } = body;

    if (!fineId) {
      return NextResponse.json({ error: 'Fine ID is required' }, { status: 400 });
    }

    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/fine/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fineId,
        issuerUuid: uuid,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Ошибка при удалении штрафа' }));
      return NextResponse.json({ error: errorData.error || 'Ошибка при удалении штрафа' }, { status: response.status });
    }

    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting fine:', error);
    return NextResponse.json({ error: 'Ошибка сервера при удалении штрафа' }, { status: 500 });
  }
}

