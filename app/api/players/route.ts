import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://white.fnode.me:8228';

export async function GET() {
  try {
    // Получаем список всех аккаунтов (игроков) из мода
    // Используем фиктивный UUID для получения списка всех аккаунтов
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/accounts/all?bankerUuid=00000000-0000-0000-0000-000000000000`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({
        players: [],
        count: 0
      });
    }

    const accounts = await response.json();

    // Преобразуем аккаунты в формат игроков
    const players = Array.isArray(accounts) ? accounts.map((account: any) => ({
      uuid: account.ownerUuid,
      username: account.ownerName,
      accountNumber: account.accountNumber,
      createdAt: account.createdAt
    })) : [];

    return NextResponse.json({
      players: players,
      count: players.length
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({
      players: [],
      count: 0
    });
  }
}
