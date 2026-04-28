import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Получаем транзакции через API мода
    const serverUrl = process.env.MINECRAFT_SERVER_URL || 'http://localhost:8228';
    let transactions = [];

    try {
      const txResponse = await fetch(`${serverUrl}/api/bank/transactions?uuid=${session.uuid}&limit=${limit}`);
      if (txResponse.ok) {
        const txData = await txResponse.json();
        transactions = txData.transactions || [];
      }
    } catch (error) {
      console.error('Error fetching transactions from Minecraft server:', error);
    }

    return NextResponse.json({
      transactions,
      total: transactions.length,
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
