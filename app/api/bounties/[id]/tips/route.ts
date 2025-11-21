import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { createServerClient } from '@/lib/supabase/client';

// GET - Fetch all tips for a specific bounty (only accessible by bounty creator)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: bountyId } = await params;

    // Verify user is the creator of this bounty
    const serverClient = createServerClient();
    const { data: bounty, error: bountyError } = await serverClient
      .from('bounties')
      .select('id, creator_wallet')
      .eq('id', bountyId)
      .single();

    if (bountyError || !bounty) {
      return NextResponse.json(
        { error: 'Bounty not found' },
        { status: 404 }
      );
    }

    if (bounty.creator_wallet !== session.publicKey) {
      return NextResponse.json(
        { error: 'Unauthorized - you are not the creator of this bounty' },
        { status: 403 }
      );
    }

    // Fetch all tips for this bounty
    const { data: tips, error: tipsError } = await serverClient
      .from('tips')
      .select('id, submitter_wallet, ipfs_hash, encrypted_data, status, created_at')
      .eq('bounty_id', bountyId)
      .order('created_at', { ascending: false });

    if (tipsError) {
      return NextResponse.json(
        { error: 'Failed to fetch tips' },
        { status: 500 }
      );
    }

    // Return tips with both anonymized display and full wallet for creator
    const tipsWithDisplay = (tips || []).map(tip => ({
      ...tip,
      submitter_wallet_display: `${tip.submitter_wallet.slice(0, 4)}...${tip.submitter_wallet.slice(-4)}`,
      // Keep full wallet for creator to use in payments
      submitter_wallet: tip.submitter_wallet,
    }));

    return NextResponse.json({
      success: true,
      tips: tipsWithDisplay,
    });
  } catch (error: any) {
    console.error('Get bounty tips error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

