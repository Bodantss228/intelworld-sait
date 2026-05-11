import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bankerUuid = searchParams.get('bankerUuid');
    const limit = searchParams.get('limit') || '50';

    if (!bankerUuid) {
      return NextResponse.json({ error: 'Banker UUID is required' }, { status: 400 });
    }

    // Проверяем что пользователь - банкир
    const roleResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/government/role?uuid=${bankerUuid}`);
    if (!roleResponse.ok) {
      return NextResponse.json({ error: 'Not authorized as banker' }, { status: 403 });
    }

    const roleData = await roleResponse.json();
    if (!roleData.roles || !roleData.roles.includes('banker')) {
      return NextResponse.json({ error: 'Not authorized as banker' }, { status: 403 });
    }

    // Получаем все транзакции
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/bank/transactions/all?bankerUuid=${bankerUuid}&limit=${limit}`);

    if (!response.ok) {
      return NextResponse.json({ transactions: [] }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    return NextResponse.json({ transactions: [] }, { status: 200 });
  }
}
