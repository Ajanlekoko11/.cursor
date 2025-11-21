import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { createServerClient } from '@/lib/supabase/client';

// GET - List all bounties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'open';

    const serverClient = createServerClient();
    const { data: bounties, error } = await serverClient
      .from('bounties')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch bounties' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, bounties });
  } catch (error: any) {
    console.error('Get bounties error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new bounty
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

    const { title, description, amount, tokenType, attachments } = await request.json();

    if (!title || !description || !amount || !tokenType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['SOL', 'USDC'].includes(tokenType)) {
      return NextResponse.json(
        { error: 'Invalid token type. Must be SOL or USDC' },
        { status: 400 }
      );
    }

    // Create bounty in database
    // Note: On-chain creation will be handled separately via Anchor program
    // Store attachments as JSON in description or a separate field
    const serverClient = createServerClient();
    const { data: bounty, error } = await serverClient
      .from('bounties')
      .insert({
        title,
        description: attachments && attachments.length > 0
          ? `${description}\n\n[Attachments: ${attachments.map(a => a.filename).join(', ')}]`
          : description,
        amount_sol: tokenType === 'SOL' ? amount : null,
        amount_usdc: tokenType === 'USDC' ? amount : null,
        token_type: tokenType,
        creator_wallet: session.publicKey,
        status: 'open',
        // Store attachments metadata (we'll add a JSONB column for this later if needed)
        // For now, we can store it in a text field or extend the schema
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create bounty' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bounty,
      message: 'Bounty created. Please complete on-chain transaction to fund it.',
    });
  } catch (error: any) {
    console.error('Create bounty error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

