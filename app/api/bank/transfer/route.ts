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
    const { recipient, amount, description, transferType, fromAccount } = body;

    if (!recipient || !amount) {
      return NextResponse.json({ error: 'Recipient and amount are required' }, { status: 400 });
    }

    // Определяем тип отправителя
    const fromType = fromAccount === '0000' ? 'account' : 'uuid';
    const fromValue = fromAccount === '0000' ? '0000' : uuid;

    // Определяем тип получателя
    let toType = 'uuid';
    let toValue = recipient;

    if (transferType === 'account') {
      // Перевод по номеру счета
      toType = 'account';
      toValue = recipient;
    } else if (transferType === 'nickname') {
      // Перевод по нику - получаем UUID
      try {
        const accountResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/account?playerName=${encodeURIComponent(recipient)}`);
        if (!accountResponse.ok) {
          return NextResponse.json({ error: 'Получатель не найден' }, { status: 404 });
        }
        const accountData = await accountResponse.json();
        toValue = accountData.ownerUuid;
      } catch (err) {
        return NextResponse.json({ error: 'Не удалось найти получателя' }, { status: 404 });
      }
    }

    // Отправляем запрос на мод
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromType: fromType,
        from: fromValue,
        toType: toType,
        to: toValue,
        amount: parseInt(amount),
        description: description || 'Перевод',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Transfer failed' }));
      return NextResponse.json({ error: errorData.error || 'Ошибка при переводе' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing transfer:', error);
    return NextResponse.json({ error: 'Ошибка сервера при выполнении перевода' }, { status: 500 });
  }
}
