import { NextResponse } from 'next/server';

// In-memory storage for events
let events: any[] = [];

export async function POST(request: Request) {
  try {
    const event = await request.json();

    // Add to memory
    events.unshift(event);

    // Keep only last 100 events
    if (events.length > 100) {
      events = events.slice(0, 100);
    }

    console.log('[IntelWorld Bridge] Player event:', event.event, event.player);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[IntelWorld Bridge] Error:', error);
    return NextResponse.json({ error: 'Failed to process event' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(events);
}
