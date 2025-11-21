import { NextRequest, NextResponse } from 'next/server';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { createServerClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const MAX_TIMEOUT = 60000; // 60 seconds
  
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get Zero Connector with error handling and retry logic
    let connector;
    let retryCount = 0;
    const maxRetries = 5;
    
    while (retryCount < maxRetries) {
      try {
        connector = await getZeroConnector();
        break; // Success, exit retry loop
      } catch (connectorError: any) {
        retryCount++;
        const elapsed = Date.now() - startTime;
        
        // If we've exceeded timeout, return error
        if (elapsed >= MAX_TIMEOUT) {
          console.error('[API /auth/me] Zero Connector initialization timeout after', elapsed, 'ms');
          return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.' },
            { status: 503 }
          );
        }
        
        // If this is the last retry, return error
        if (retryCount >= maxRetries) {
          console.error('[API /auth/me] Zero Connector initialization error after', retryCount, 'retries:', connectorError);
          return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.' },
            { status: 503 }
          );
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`[API /auth/me] Retrying Zero Connector initialization (attempt ${retryCount + 1}/${maxRetries})...`);
      }
    }

    const session = connector.verifySession(sessionToken);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get user data from Supabase with retry logic
    let user;
    retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const serverClient = createServerClient();
        const { data: userData, error: userError } = await serverClient
          .from('users')
          .select('email, wallet_address, is_admin, created_at')
          .eq('wallet_address', session.publicKey)
          .single();

        if (userError || !userData) {
          // If user not found but session is valid, return 404
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        user = userData;
        break; // Success, exit retry loop
      } catch (dbError: any) {
        retryCount++;
        const elapsed = Date.now() - startTime;
        
        // If we've exceeded timeout, return error
        if (elapsed >= MAX_TIMEOUT) {
          console.error('[API /auth/me] Database timeout after', elapsed, 'ms');
          return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.' },
            { status: 503 }
          );
        }
        
        // If this is the last retry, return error
        if (retryCount >= maxRetries) {
          console.error('[API /auth/me] Database error after', retryCount, 'retries:', dbError);
          return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.' },
            { status: 503 }
          );
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`[API /auth/me] Retrying database query (attempt ${retryCount + 1}/${maxRetries})...`);
      }
    }

    // Get balance (with 60 second timeout)
    let balance = { solBalance: 0 };
    try {
      const balancePromise = connector.getBalance(session.publicKey);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Balance fetch timeout')), 60000)
      );
      
      const balanceResult = await Promise.race([balancePromise, timeoutPromise]);
      balance = (balanceResult as any).balance || { solBalance: 0 };
    } catch (error) {
      console.warn('Balance fetch failed or timed out:', error);
      // Continue with default balance - don't block the request
    }

    // Ensure user is defined (TypeScript guard)
    if (!user) {
      return NextResponse.json(
        { error: 'User data not available' },
        { status: 500 }
      );
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
    const elapsed = Date.now() - startTime;
    console.error('Get user error after', elapsed, 'ms:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

