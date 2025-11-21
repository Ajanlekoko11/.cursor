import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { createServerClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // Verify session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const connector = await getZeroConnector();
    const session = connector.verifySession(sessionToken);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { bountyId, ipfsHash, description } = await request.json();

    if (!bountyId || !ipfsHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify bounty exists
    const serverClient = createServerClient();
    const { data: bounty, error: bountyError } = await serverClient
      .from('bounties')
      .select('id, status')
      .eq('id', bountyId)
      .single();

    if (bountyError || !bounty) {
      return NextResponse.json(
        { error: 'Bounty not found' },
        { status: 404 }
      );
    }

    if (bounty.status !== 'open') {
      return NextResponse.json(
        { error: 'Bounty is not open for submissions' },
        { status: 400 }
      );
    }

    // Create tip record
    // Note: On-chain submission will be handled separately via Anchor program
    const { data: tip, error: tipError } = await serverClient
      .from('tips')
      .insert({
        bounty_id: bountyId,
        submitter_wallet: session.publicKey,
        ipfs_hash: ipfsHash,
        encrypted_data: description || '',
        status: 'pending',
      })
      .select()
      .single();

    if (tipError) {
      return NextResponse.json(
        { error: 'Failed to submit tip' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tip,
      message: 'Tip submitted successfully. Please complete on-chain transaction.',
    });
  } catch (error: any) {
    console.error('Submit tip error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

