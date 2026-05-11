import { NextRequest, NextResponse } from 'next/server';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');
    const accountNumber = searchParams.get('accountNumber');
    const playerName = searchParams.get('playerName');

    let url = `${MINECRAFT_SERVER_URL}/api/bank/account`;

    if (uuid) {
      url += `?uuid=${uuid}`;
    } else if (accountNumber) {
      url += `?accountNumber=${accountNumber}`;
    } else if (playerName) {
      url += `?playerName=${encodeURIComponent(playerName)}`;
    } else {
      return NextResponse.json({ error: 'UUID, account number, or player name is required' }, { status: 400 });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: 'Account not found' }, { status: response.status });
    }

    const account = await response.json();
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
