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

    const { uuid } = authResult.payload;

    // Get vote data from request
    const body = await request.json();
    const { votingId, optionId } = body;

    if (!votingId || !optionId) {
      return NextResponse.json({ error: 'Voting ID and option ID are required' }, { status: 400 });
    }

    // Send to Minecraft API
    const response = await fetch(`${MINECRAFT_SERVER_URL}/api/government/voting/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        votingId,
        playerUuid: uuid,
        optionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to vote' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
