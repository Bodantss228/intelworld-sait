import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { playerUuid, playerName } = body;

    // Отправляем запрос на мод для создания счета
    const serverUrl = process.env.MINECRAFT_SERVER_URL || 'http://localhost:8118';

    try {
      const response = await fetch(`${serverUrl}/api/bank/account/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerUuid,
          playerName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { error: error.error || 'Ошибка при создании счета' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error creating account on Minecraft server:', error);
      return NextResponse.json(
        { error: 'Не удалось связаться с сервером Minecraft' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in account create API:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
