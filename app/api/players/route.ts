import { NextResponse } from 'next/server';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://white.fnode.me:8228';

export async function GET() {
  try {
    // Получаем список игроков из мода
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/players`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({
        players: [],
        count: 0
      });
    }

    const players = await response.json();

    return NextResponse.json({
      players: players || [],
      count: players?.length || 0
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({
      players: [],
      count: 0
    });
  }
}
