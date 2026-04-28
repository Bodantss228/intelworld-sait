import { NextRequest, NextResponse } from 'next/server';
import { setLiveData, getLiveData } from '@/lib/serverData';

export async function GET() {
  try {
    const data = getLiveData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting server data:', error);
    return NextResponse.json(
      { error: 'Failed to get server data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('[Server Update] Received data:', JSON.stringify(data));

    // Update live data with timestamp
    setLiveData({
      ...data,
      timestamp: Date.now()
    });

    console.log('[Server Update] Data saved successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating server data:', error);
    return NextResponse.json(
      { error: 'Failed to update server data' },
      { status: 500 }
    );
  }
}
