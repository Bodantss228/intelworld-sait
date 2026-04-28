import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const event = await request.json();
    console.log('[IntelWorld Bridge] Server event:', event.event);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process event' }, { status: 500 });
  }
}
