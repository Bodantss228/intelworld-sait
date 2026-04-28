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

    // Получаем информацию о штрафе
    const finesResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/government/fines?uuid=${uuid}`);
    if (!finesResponse.ok) {
      return NextResponse.json({ error: 'Не удалось получить информацию о штрафе' }, { status: 500 });
    }

    const fines = await finesResponse.json();
    const fine = Array.isArray(fines) ? fines.find((f: any) => f.id === fineId) : null;

    if (!fine) {
      return NextResponse.json({ error: 'Штраф не найден' }, { status: 404 });
    }

    if (fine.paid) {
      return NextResponse.json({ error: 'Штраф уже оплачен' }, { status: 400 });
    }

    // Оплачиваем штраф через новый endpoint мода
    const payResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/government/fine/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fineId,
        playerUuid: uuid,
      }),
    });

    if (!payResponse.ok) {
      const errorData = await payResponse.json().catch(() => ({ error: 'Ошибка при оплате штрафа' }));
      return NextResponse.json({ error: errorData.error || 'Ошибка при оплате штрафа' }, { status: payResponse.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Штраф успешно оплачен',
      amount: fine.amount
    });
  } catch (error) {
    console.error('Error paying fine:', error);
    return NextResponse.json({ error: 'Ошибка сервера при оплате штрафа' }, { status: 500 });
  }
}
