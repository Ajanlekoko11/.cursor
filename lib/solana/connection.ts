import { Connection, PublicKey, Cluster } from '@solana/web3.js';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta') as Cluster;

export const connection = new Connection(RPC_URL, 'confirmed');

export function getNetwork(): Cluster {
  return NETWORK;
}

export function getRpcUrl(): string {
  return RPC_URL;
}

// Common Solana addresses
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Mainnet USDC

