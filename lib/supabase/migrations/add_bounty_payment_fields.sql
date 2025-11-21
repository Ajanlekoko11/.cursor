-- Migration: Add payment tracking fields to bounties and status to tips
-- Run this in Supabase SQL Editor if tables already exist

-- Add new columns to bounties table
ALTER TABLE bounties 
ADD COLUMN IF NOT EXISTS winner_tip_id UUID REFERENCES tips(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS winner_wallet TEXT,
ADD COLUMN IF NOT EXISTS payment_tx_signature TEXT,
ADD COLUMN IF NOT EXISTS payment_sent_at TIMESTAMP WITH TIME ZONE;

-- Add status column to tips table
ALTER TABLE tips
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_tips_status ON tips(status);
CREATE INDEX IF NOT EXISTS idx_bounties_winner_tip ON bounties(winner_tip_id);

