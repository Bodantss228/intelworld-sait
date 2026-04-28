import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://white.fnode.me:8228';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bankerUuid = searchParams.get('bankerUuid');
    const rateId = searchParams.get('rateId');

    if (!bankerUuid || !rateId) {
      return NextResponse.json(
        { error: 'bankerUuid and rateId are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/api/bank/exchange/delete?bankerUuid=${bankerUuid}&rateId=${rateId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting exchange rate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
