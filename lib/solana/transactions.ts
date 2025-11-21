import { Connection, PublicKey, getAccount } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { connection, USDC_MINT } from './connection';

/**
 * Get balance of an escrow account
 */
export async function getEscrowBalance(escrowAccountAddress: string, tokenType: 'SOL' | 'USDC'): Promise<number> {
  try {
    const escrowPubkey = new PublicKey(escrowAccountAddress);

    if (tokenType === 'SOL') {
      const balance = await connection.getBalance(escrowPubkey);
      return balance / 1_000_000_000; // Convert lamports to SOL
    } else {
      // USDC - get token account balance
      const mintPubkey = USDC_MINT;
      const tokenAccount = await getAssociatedTokenAddress(mintPubkey, escrowPubkey);
      const accountInfo = await getAccount(connection, tokenAccount);
      return Number(accountInfo.amount) / 1_000_000; // Convert to USDC (6 decimals)
    }
  } catch (error: any) {
    console.error('Get escrow balance error:', error);
    // If account doesn't exist, return 0
    return 0;
  }
}

/**
 * Validate Solana wallet address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

