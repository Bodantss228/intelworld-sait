import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://purple.fnode.me:8118';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/bank/exchange/rates`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch exchange rates' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
