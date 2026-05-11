import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Получаем данные через API мода
    const serverUrl = process.env.MINECRAFT_SERVER_URL || 'http://localhost:8118';
    let balance = 0;
    let role = '';

    try {
      // Получаем баланс
      const balanceResponse = await fetch(`${serverUrl}/api/bank/balance?uuid=${session.uuid}`);
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        balance = balanceData.balance || 0;
      }

      // Получаем роль
      const roleResponse = await fetch(`${serverUrl}/api/government/role?uuid=${session.uuid}`);
      if (roleResponse.ok) {
        const roleData = await roleResponse.json();
        role = roleData.role || '';

        // Добавляем массив всех ролей
        const roles = roleData.roles || [];

        return NextResponse.json({
          uuid: session.uuid,
          username: session.username,
          balance,
          role,
          roles, // Массив всех ролей
          isBanker: roles.includes('banker') || role === 'banker',
          isPresident: roles.includes('president') || role === 'president',
          isMedia: roles.includes('media') || role === 'media',
          createdAt: Date.now(),
          lastLogin: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error fetching data from Minecraft server:', error);
    }

    return NextResponse.json({
      uuid: session.uuid,
      username: session.username,
      balance,
      role,
      roles: [],
      isBanker: false,
      isPresident: false,
      isMedia: false,
      createdAt: Date.now(),
      lastLogin: Date.now(),
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
