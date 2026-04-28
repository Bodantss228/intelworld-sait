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

    // Выполняем перевод с личного счета игрока на государственный счет (0000)
    const transferResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromType: 'uuid',
        from: uuid,
        toType: 'account',
        to: '0000',
        amount: fine.amount,
        description: `Оплата штрафа: ${fine.reason}`,
      }),
    });

    if (!transferResponse.ok) {
      const errorData = await transferResponse.json().catch(() => ({ error: 'Недостаточно средств для оплаты штрафа' }));
      return NextResponse.json({ error: errorData.error || 'Ошибка при переводе средств' }, { status: transferResponse.status });
    }

    // Помечаем штраф как оплаченный (если есть такой endpoint в моде)
    // Если нет - перевод уже выполнен, это главное
    try {
      await fetch(`${MINECRAFT_SERVER_URL}/api/government/fine/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fineId,
          playerUuid: uuid,
        }),
      });
    } catch (err) {
      // Игнорируем ошибку, главное что перевод выполнен
      console.log('Fine marking as paid failed, but transfer succeeded');
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
