import { NextRequest, NextResponse } from 'next/server';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://white.fnode.me:8228';

export async function GET(request: NextRequest) {
  try {
    console.log('[Votings API] Fetching from:', `${MINECRAFT_SERVER_URL}/api/government/votings`);

    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/votings`, {
      cache: 'no-store',
    });

    console.log('[Votings API] Response status:', response.status);

    if (!response.ok) {
      console.error('[Votings API] Failed to fetch votings:', response.status);
      return NextResponse.json([], { status: 200 }); // Возвращаем пустой массив вместо ошибки
    }

    const votings = await response.json();
    console.log('[Votings API] Received votings:', votings?.length || 0);

    // Убедимся что возвращаем массив
    const votingsArray = Array.isArray(votings) ? votings : [];

    return NextResponse.json(votingsArray);
  } catch (error) {
    console.error('[Votings API] Error fetching votings:', error);
    return NextResponse.json([], { status: 200 }); // Возвращаем пустой массив при ошибке
  }
}
