import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import { connection, USDC_MINT } from './connection';

/**
 * Build a SOL transfer transaction
 * Returns unsigned transaction that needs to be signed
 */
export async function buildSolTransferTransaction(
  fromWalletAddress: string,
  toWalletAddress: string,
  amountSol: number
): Promise<Transaction> {
  const fromPubkey = new PublicKey(fromWalletAddress);
  const toPubkey = new PublicKey(toWalletAddress);
  
  // Convert SOL to lamports
  const amountLamports = Math.floor(amountSol * 1_000_000_000);

  // Create transfer instruction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey,
      lamports: amountLamports,
    })
  );

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromPubkey;

  return transaction;
}

/**
 * Build a USDC transfer transaction
 * Returns unsigned transaction that needs to be signed
 */
export async function buildUsdcTransferTransaction(
  fromWalletAddress: string,
  toWalletAddress: string,
  amountUsdc: number
): Promise<Transaction> {
  const fromPubkey = new PublicKey(fromWalletAddress);
  const toPubkey = new PublicKey(toWalletAddress);
  const mintPubkey = USDC_MINT;

  // Get associated token addresses
  const fromTokenAccount = await getAssociatedTokenAddress(mintPubkey, fromPubkey);
  const toTokenAccount = await getAssociatedTokenAddress(mintPubkey, toPubkey);

  // Convert amount to smallest unit (USDC has 6 decimals)
  const amountInSmallestUnit = Math.floor(amountUsdc * 1_000_000);

  // Create transfer instruction
  const transferInstruction = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    fromPubkey,
    amountInSmallestUnit
  );

  const transaction = new Transaction().add(transferInstruction);

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromPubkey;

  return transaction;
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

