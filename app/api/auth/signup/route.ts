import { NextRequest, NextResponse } from 'next/server';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { supabase, createServerClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';
import { PostgresAdapter } from 'zero-connector';
import CryptoJS from 'crypto-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Initialize Zero Connector
    const connector = await getZeroConnector();

    // Create wallet with Zero Connector
    const walletResult = await connector.createWallet({ password });

    // Remove the success check - createWallet returns { publicKey, encryptedPrivateKey } directly
    if (!walletResult.publicKey) {
      return NextResponse.json(
        { error: 'Failed to create wallet' },
        { status: 500 }
      );
    }

    // Create user record in Supabase
    const serverClient = createServerClient();
    const { data: user, error: userError } = await serverClient
      .from('users')
      .insert({
        email,
        wallet_address: walletResult.publicKey,
        is_admin: false,
      })
      .select()
      .single();

    if (userError) {
      // If user already exists, return error
      if (userError.code === '23505') {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Authenticate to get session token
    // Note: This may fetch balance from Solana which can be slow
    // We'll add a timeout to prevent hanging
    let authResult;
    try {
      const authPromise = connector.authenticate({
        publicKey: walletResult.publicKey,
        password,
      });
      
      // Add 20 second timeout for authentication (includes balance fetch)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout - Solana RPC may be slow')), 20000)
      );
      
      authResult = await Promise.race([authPromise, timeoutPromise]) as any;
    } catch (error: any) {
      console.error('Authentication error (may be timeout):', error.message);
      // If it's a timeout, we can still proceed - balance will be fetched later
      if (error.message?.includes('timeout')) {
        // Try to create a basic session without balance
        // Fallback: create session manually if authenticate times out
        return NextResponse.json(
          { 
            error: 'Wallet created but authentication timed out. Please try logging in.',
            publicKey: walletResult.publicKey,
            fallback: true
          },
          { status: 202 } // Accepted but incomplete
        );
      }
      throw error;
    }

    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Failed to authenticate' },
        { status: 500 }
      );
    }

    // Retrieve and decrypt private key to get base58 format
    let privateKeyBase58: string | null = null;
    try {
      // Access the storage adapter to get encrypted private key
      const storage = (connector as any).storage as PostgresAdapter;
      const walletData = await storage.getWallet(walletResult.publicKey);

      if (walletData && walletData.encryptedPrivateKey) {
        // Decrypt private key using password
        const decryptedPrivateKey = CryptoJS.AES.decrypt(
          walletData.encryptedPrivateKey,
          password
        ).toString(CryptoJS.enc.Utf8);

        if (decryptedPrivateKey) {
          // The decrypted key is already in base58 format (as stored by Zero Connector)
          privateKeyBase58 = decryptedPrivateKey;
        }
      }
    } catch (error: any) {
      // Log error but don't fail signup if private key retrieval fails
      console.error('Error retrieving private key:', error.message);
      // Continue without private key - user can still use the wallet
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', authResult.sessionToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      publicKey: walletResult.publicKey,
      privateKeyBase58: privateKeyBase58,
      sessionToken: authResult.sessionToken,
      balance: authResult.balance || { solBalance: 0 },
      warning: privateKeyBase58 
        ? 'Save your private key securely. It cannot be recovered if lost. Never share it with anyone.'
        : 'Private key could not be retrieved. Your wallet is still functional.',
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

