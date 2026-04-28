import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://white.fnode.me:8228';

export async function GET() {
  try {
    // Получаем список всех игроков из мода через government API
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/players`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch players:', response.status, response.statusText);
      return NextResponse.json({
        players: [],
        count: 0
      });
    }

    const data = await response.json();

    // Преобразуем данные в нужный формат
    const players = Array.isArray(data) ? data.map((player: any) => ({
      uuid: player.uuid,
      name: player.name,
      addedBy: player.addedBy,
      description: player.description,
      addedAt: player.addedAt
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
