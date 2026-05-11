import { NextRequest, NextResponse } from 'next/server';

const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL || 'http://purple.fnode.me:8118';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');
    const accountNumber = searchParams.get('accountNumber');

    let url = `${MINECRAFT_SERVER_URL}/api/bank/balance`;

    if (uuid) {
      url += `?uuid=${uuid}`;
    } else if (accountNumber) {
      url += `?accountNumber=${accountNumber}`;
    } else {
      return NextResponse.json({ error: 'UUID or account number is required' }, { status: 400 });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ balance: 0 }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ balance: 0 }, { status: 200 });
  }
}
