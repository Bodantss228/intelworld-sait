import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

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
    let recipientLabel = recipient;

    if (transferType === 'account') {
      // Перевод по номеру счета
      toType = 'account';
      toValue = recipient;
      // Пытаемся получить имя владельца счета, чтобы корректно отображать "Кому" в истории.
      try {
        const accountResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/account?accountNumber=${encodeURIComponent(recipient)}`);
        if (accountResponse.ok) {
          const accountData = await accountResponse.json();
          if (accountData?.ownerName) {
            recipientLabel = accountData.ownerName;
          } else {
            recipientLabel = `счет ${recipient}`;
          }
        } else {
          recipientLabel = `счет ${recipient}`;
        }
      } catch {
        recipientLabel = `счет ${recipient}`;
      }
    } else if (transferType === 'nickname') {
      // Перевод по нику - получаем UUID
      try {
        const accountResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/account?playerName=${encodeURIComponent(recipient)}`);
        if (!accountResponse.ok) {
          return NextResponse.json({ error: 'Получатель не найден' }, { status: 404 });
        }
        const accountData = await accountResponse.json();
        toValue = accountData.ownerUuid;
        recipientLabel = recipient;
      } catch (err) {
        return NextResponse.json({ error: 'Не удалось найти получателя' }, { status: 404 });
      }
    }

    // Всегда вшиваем получателя в description, чтобы UI мог показать "Кому" корректно.
    const baseDescription = description ? String(description) : 'Перевод';
    const finalDescription = `${baseDescription} → ${recipientLabel}`;
    const amountInt = Math.round(Number(amount));

    if (!Number.isFinite(amountInt) || amountInt <= 0) {
      return NextResponse.json({ error: 'Некорректная сумма' }, { status: 400 });
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
        amount: amountInt,
        description: finalDescription,
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
