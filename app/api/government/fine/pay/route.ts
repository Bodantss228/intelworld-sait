import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://white.fnode.me:8228';

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uuid } = authResult.payload;
    const body = await request.json();
    const { fineId } = body;

    if (!fineId) {
      return NextResponse.json({ error: 'Fine ID is required' }, { status: 400 });
    }

    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/fine/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fineId,
        playerUuid: uuid,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to pay fine' }));
      return NextResponse.json({ error: errorData.error || 'Ошибка при оплате штрафа' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error paying fine:', error);
    return NextResponse.json({ error: 'Ошибка сервера при оплате штрафа' }, { status: 500 });
  }
}
