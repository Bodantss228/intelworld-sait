import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateAccount } from '@/lib/dataManager';
import { createToken, setAuthCookie } from '@/lib/auth';

const RATE_LIMIT = new Map<string, number[]>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const requests = RATE_LIMIT.get(identifier) || [];

  const recentRequests = requests.filter(time => now - time < WINDOW_MS);

  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  RATE_LIMIT.set(identifier, recentRequests);

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, code } = body;

    if (!username || !code) {
      return NextResponse.json(
        { error: 'Ник и код обязательны' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Слишком много попыток. Попробуйте позже.' },
        { status: 429 }
      );
    }

    // Проверяем код через API сервера Minecraft
    const serverUrl = process.env.MINECRAFT_SERVER_URL || 'http://localhost:8080';

    try {
      const response = await fetch(`${serverUrl}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, code }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { error: error.error || 'Неверный код или истек срок действия' },
          { status: 401 }
        );
      }

      const data = await response.json();

      // Получаем роль игрока
      let role = 'player';
      let roles: string[] = [];
      try {
        const roleResponse = await fetch(`${serverUrl}/api/government/role?uuid=${data.uuid}`);
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          role = roleData.role || 'player';
          roles = roleData.roles || [];
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }

      // Не используем createOrUpdateAccount - он пытается писать в файлы на Vercel
      const token = await createToken({
        uuid: data.uuid,
        username: data.username,
        role,
        roles,
      });

      await setAuthCookie(token);

      return NextResponse.json({
        success: true,
        user: {
          uuid: data.uuid,
          username: data.username,
          role,
          roles,
        },
      });
    } catch (error) {
      console.error('Error connecting to Minecraft server:', error);
      return NextResponse.json(
        { error: 'Не удалось подключиться к серверу. Попробуйте позже.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
