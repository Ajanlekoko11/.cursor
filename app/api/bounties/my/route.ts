import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { createServerClient } from '@/lib/supabase/client';

// GET - List bounties created by the authenticated user
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Optional filter by status

    const serverClient = createServerClient();
    
    // Build query
    let query = serverClient
      .from('bounties')
      .select(`
        *,
        tips(count)
      `)
      .eq('creator_wallet', session.publicKey)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: bounties, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch bounties' },
        { status: 500 }
      );
    }

    // Get tip counts for each bounty
    const bountiesWithTipCounts = await Promise.all(
      (bounties || []).map(async (bounty) => {
        const { count } = await serverClient
          .from('tips')
          .select('*', { count: 'exact', head: true })
          .eq('bounty_id', bounty.id);
        
        return {
          ...bounty,
          tip_count: count || 0,
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      bounties: bountiesWithTipCounts 
    });
  } catch (error: any) {
    console.error('Get my bounties error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

