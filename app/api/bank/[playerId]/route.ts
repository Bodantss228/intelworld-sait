import { NextResponse } from 'next/server';
import bankData from '@/data/bank.json';

export async function GET(
  request: Request,
  { params }: { params: { playerId: string } }
) {
  const { playerId } = params;
  const account = (bankData as any)[playerId];

  if (!account) {
    return NextResponse.json(
      { error: 'Player not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    playerId,
    ...account
  });
}
