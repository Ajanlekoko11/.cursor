-- WhistleChain Database Schema for Supabase

-- Users table (managed by Zero Connector, but we track additional metadata)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE
);

-- Bounties table
CREATE TABLE IF NOT EXISTS bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  on_chain_id TEXT UNIQUE, -- PDA address from Solana
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_sol DECIMAL(18, 9),
  amount_usdc DECIMAL(18, 6),
  token_type TEXT NOT NULL CHECK (token_type IN ('SOL', 'USDC')),
  creator_wallet TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'claimed', 'cancelled')),
  escrow_account TEXT, -- Solana escrow account address
  winner_tip_id UUID REFERENCES tips(id) ON DELETE SET NULL, -- The tip that won the bounty
  winner_wallet TEXT, -- Final wallet address that received payment
  payment_tx_signature TEXT, -- Solana transaction signature for payment
  payment_sent_at TIMESTAMP WITH TIME ZONE, -- When payment was sent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Tips table (anonymous submissions)
CREATE TABLE IF NOT EXISTS tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  on_chain_id TEXT UNIQUE, -- PDA address from Solana
  submitter_wallet TEXT NOT NULL, -- Anonymous but tracked on-chain
  ipfs_hash TEXT NOT NULL, -- IPFS CID for encrypted file
  encrypted_data TEXT, -- Additional encrypted metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table (claims for bounties)
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  tip_id UUID REFERENCES tips(id) ON DELETE SET NULL,
  claimant_wallet TEXT NOT NULL,
  proof TEXT, -- Proof of claim
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by TEXT, -- Admin wallet address
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bounties_creator ON bounties(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties(status);
CREATE INDEX IF NOT EXISTS idx_tips_bounty ON tips(bounty_id);
CREATE INDEX IF NOT EXISTS idx_tips_status ON tips(status);
CREATE INDEX IF NOT EXISTS idx_claims_bounty ON claims(bounty_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_bounties_winner_tip ON bounties(winner_tip_id);

-- RLS Policies (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Anyone can read open bounties
CREATE POLICY "Anyone can read open bounties" ON bounties
  FOR SELECT USING (status = 'open' OR creator_wallet = (SELECT wallet_address FROM users WHERE id::text = auth.uid()::text));

-- Users can create bounties
CREATE POLICY "Users can create bounties" ON bounties
  FOR INSERT WITH CHECK (creator_wallet = (SELECT wallet_address FROM users WHERE id::text = auth.uid()::text));

-- Tips are anonymous - anyone can create, only admins can read
CREATE POLICY "Anyone can create tips" ON tips
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read tips" ON tips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

-- Claims can be created by anyone, read by creator or admin
CREATE POLICY "Anyone can create claims" ON claims
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own claims" ON claims
  FOR SELECT USING (
    claimant_wallet = (SELECT wallet_address FROM users WHERE id::text = auth.uid()::text)
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

