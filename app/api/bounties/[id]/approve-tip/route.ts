import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { createServerClient } from '@/lib/supabase/client';
import { buildSolTransferTransaction, buildUsdcTransferTransaction, isValidSolanaAddress } from '@/lib/solana/transaction-builder';
import { connection } from '@/lib/solana/connection';
import { sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { PostgresAdapter } from 'zero-connector';
import CryptoJS from 'crypto-js';
import bs58 from 'bs58';

// POST - Approve a tip and send payment
export async function POST(
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
    const { tipId, recipientWallet, recipientType, password } = await request.json();

    if (!tipId || !recipientWallet || !recipientType || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: tipId, recipientWallet, recipientType, password' },
        { status: 400 }
      );
    }

    if (!['tipper', 'external'].includes(recipientType)) {
      return NextResponse.json(
        { error: 'Invalid recipientType. Must be "tipper" or "external"' },
        { status: 400 }
      );
    }

    // Validate external wallet address if provided
    if (recipientType === 'external' && !isValidSolanaAddress(recipientWallet)) {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    const serverClient = createServerClient();

    // Verify user is the creator of this bounty
    const { data: bounty, error: bountyError } = await serverClient
      .from('bounties')
      .select('id, creator_wallet, token_type, amount_sol, amount_usdc, escrow_account, status')
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

    if (bounty.status !== 'open') {
      return NextResponse.json(
        { error: 'Bounty is not open. It may have already been claimed or closed.' },
        { status: 400 }
      );
    }

    // Verify tip exists and belongs to this bounty
    const { data: tip, error: tipError } = await serverClient
      .from('tips')
      .select('id, submitter_wallet, bounty_id, status')
      .eq('id', tipId)
      .eq('bounty_id', bountyId)
      .single();

    if (tipError || !tip) {
      return NextResponse.json(
        { error: 'Tip not found or does not belong to this bounty' },
        { status: 404 }
      );
    }

    if (tip.status === 'approved') {
      return NextResponse.json(
        { error: 'This tip has already been approved' },
        { status: 400 }
      );
    }

    // Determine recipient wallet
    let finalRecipientWallet: string;
    if (recipientType === 'tipper') {
      // Get the full submitter wallet (not anonymized)
      const { data: fullTip } = await serverClient
        .from('tips')
        .select('submitter_wallet')
        .eq('id', tipId)
        .single();
      
      if (!fullTip) {
        return NextResponse.json(
          { error: 'Failed to get tip submitter wallet' },
          { status: 500 }
        );
      }
      finalRecipientWallet = fullTip.submitter_wallet;
    } else {
      finalRecipientWallet = recipientWallet;
    }

    // Verify password by authenticating
    const authResult = await connector.authenticate({
      publicKey: session.publicKey,
      password,
    });

    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Get amount and token type
    const amount = bounty.token_type === 'SOL' 
      ? Number(bounty.amount_sol) 
      : Number(bounty.amount_usdc);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Bounty has no amount set' },
        { status: 400 }
      );
    }

    // Build transaction
    let transaction;
    if (bounty.token_type === 'SOL') {
      transaction = await buildSolTransferTransaction(
        bounty.creator_wallet, // From creator's wallet (escrow will be handled later)
        finalRecipientWallet,
        amount
      );
    } else {
      transaction = await buildUsdcTransferTransaction(
        bounty.creator_wallet,
        finalRecipientWallet,
        amount
      );
    }

    // Get wallet keypair from Zero Connector storage
    // Access the storage adapter to get encrypted private key
    const storage = (connector as any).storage as PostgresAdapter;
    const walletData = await storage.getWallet(session.publicKey);

    if (!walletData) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Decrypt private key using password
    const decryptedPrivateKey = CryptoJS.AES.decrypt(
      walletData.encryptedPrivateKey,
      password
    ).toString(CryptoJS.enc.Utf8);

    if (!decryptedPrivateKey) {
      return NextResponse.json(
        { error: 'Failed to decrypt wallet. Invalid password.' },
        { status: 401 }
      );
    }

    // Convert to keypair
    const secretKey = bs58.decode(decryptedPrivateKey);
    const keypair = Keypair.fromSecretKey(secretKey);

    // Sign and send transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [keypair],
      { commitment: 'confirmed' }
    );

    // Update database
    // 1. Update bounty
    const { error: updateBountyError } = await serverClient
      .from('bounties')
      .update({
        winner_tip_id: tipId,
        winner_wallet: finalRecipientWallet,
        payment_tx_signature: signature,
        payment_sent_at: new Date().toISOString(),
        status: 'claimed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bountyId);

    if (updateBountyError) {
      console.error('Failed to update bounty:', updateBountyError);
      // Transaction was sent but DB update failed - this is a problem
      // In production, you might want to implement a retry mechanism
    }

    // 2. Update tip status
    await serverClient
      .from('tips')
      .update({ status: 'approved' })
      .eq('id', tipId);

    // 3. Reject all other tips for this bounty
    await serverClient
      .from('tips')
      .update({ status: 'rejected' })
      .eq('bounty_id', bountyId)
      .neq('id', tipId);

    return NextResponse.json({
      success: true,
      message: 'Tip approved and payment sent successfully',
      transactionSignature: signature,
      recipientWallet: finalRecipientWallet,
    });
  } catch (error: any) {
    console.error('Approve tip error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

