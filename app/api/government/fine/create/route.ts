import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uuid, username } = authResult.payload;

    // Check if user has president role
    const roleResponse = await fetch(`${MINECRAFT_SERVER_URL}/api/government/role?uuid=${uuid}`);
    if (!roleResponse.ok) {
      return NextResponse.json({ error: 'Failed to verify role' }, { status: 500 });
    }

    const roleData = await roleResponse.json();
    if (roleData.role !== 'president') {
      return NextResponse.json({ error: 'Недостаточно прав. Требуется роль Президента.' }, { status: 403 });
    }

    // Get fine data from request
    const body = await request.json();
    const { playerName, amount, reason } = body;

    if (!playerName || !amount || !reason) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Send to Minecraft API
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/fine/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        issuedBy: username,
        issuerUuid: uuid,
        playerName,
        amount,
        reason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to create fine' }, { status: response.status });
    }

    const fine = await response.json();
    return NextResponse.json(fine);
  } catch (error) {
    console.error('Error creating fine:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
