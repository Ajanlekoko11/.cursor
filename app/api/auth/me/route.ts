import { NextRequest, NextResponse } from 'next/server';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { createServerClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get Zero Connector with error handling
    let connector;
    try {
      connector = await getZeroConnector();
    } catch (connectorError: any) {
      // If Zero Connector initialization fails, return 500 (temporary error)
      // This allows retries instead of immediate logout
      console.error('[API /auth/me] Zero Connector initialization error:', connectorError);
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again.' },
        { status: 503 } // Service Unavailable - indicates temporary issue
      );
    }

    const session = connector.verifySession(sessionToken);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get user data from Supabase
    // Use service role client to bypass RLS (we're using Zero Connector, not Supabase Auth)
    let user;
    try {
      const serverClient = createServerClient();
      const { data: userData, error: userError } = await serverClient
        .from('users')
        .select('email, wallet_address, is_admin, created_at')
        .eq('wallet_address', session.publicKey)
        .single();

      if (userError || !userData) {
        // If user not found but session is valid, return 404
        // This is a data inconsistency issue, not an auth issue
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      user = userData;
    } catch (dbError: any) {
      // Database connection errors should return 503 (temporary)
      console.error('[API /auth/me] Database error:', dbError);
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    // Get balance (with timeout to prevent hanging)
    let balance = { solBalance: 0 };
    try {
      const balancePromise = connector.getBalance(session.publicKey);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Balance fetch timeout')), 10000)
      );
      
      const balanceResult = await Promise.race([balancePromise, timeoutPromise]);
      balance = (balanceResult as any).balance || { solBalance: 0 };
    } catch (error) {
      console.warn('Balance fetch failed or timed out:', error);
      // Continue with default balance - don't block the request
    }

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        walletAddress: user.wallet_address,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
      },
      balance: balance,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

