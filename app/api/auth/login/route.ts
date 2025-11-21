import { NextRequest, NextResponse } from 'next/server';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { createServerClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from Supabase to find wallet address
    // Use service role client to bypass RLS (we're using Zero Connector, not Supabase Auth)
    const serverClient = createServerClient();
    const { data: user, error: userError } = await serverClient
      .from('users')
      .select('wallet_address')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Authenticate with Zero Connector
    const connector = await getZeroConnector();
    const authResult = await connector.authenticate({
      publicKey: user.wallet_address,
      password,
    });

    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Set session cookie with improved settings
    const cookieStore = await cookies();
    cookieStore.set('session', authResult.sessionToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      // Ensure cookie is set for all subdomains if needed
      // domain: undefined, // Let browser set default domain
    });

    return NextResponse.json({
      success: true,
      publicKey: user.wallet_address,
      sessionToken: authResult.sessionToken,
      balance: authResult.balance,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

