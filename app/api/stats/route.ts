import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Получаем статистику напрямую от мода
    const serverUrl = process.env.MINECRAFT_SERVER_URL || 'http://localhost:8228';

    try {
      const response = await fetch(`${serverUrl}/api/server/stats`, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      if (response.ok) {
        const data = await response.json();

        return NextResponse.json({
          online: data.online || 0,
          maxPlayers: data.maxPlayers || 100,
          version: data.version || '1.21.8',
          tps: data.tps || 20.0,
          players: data.players || [],
          uptime: 'Live',
          source: 'live'
        });
      }
    } catch (error) {
      console.error('Error fetching stats from Minecraft server:', error);
    }

    // Default offline response
    return NextResponse.json({
      online: 0,
      maxPlayers: 100,
      uptime: 'Offline',
      version: '1.21.8',
      tps: 0,
      players: [],
      source: 'offline'
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      online: 0,
      maxPlayers: 100,
      uptime: 'Offline',
      version: '1.21.8',
      tps: 0,
      players: [],
      source: 'error'
    });
  }
}
