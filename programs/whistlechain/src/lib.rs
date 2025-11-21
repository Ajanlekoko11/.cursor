use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111"); // Update with your program ID

#[program]
pub mod whistlechain {
    use super::*;

    pub fn create_bounty(
        ctx: Context<CreateBounty>,
        title: String,
        description: String,
        amount: u64,
        token_type: u8, // 0 = SOL, 1 = USDC
    ) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        bounty.creator = ctx.accounts.creator.key();
        bounty.title = title;
        bounty.description = description;
        bounty.amount = amount;
        bounty.token_type = token_type;
        bounty.status = BountyStatus::Open as u8;
        bounty.bump = ctx.bumps.bounty;
        
        // Transfer funds to escrow account
        // Implementation depends on token type (SOL vs USDC)
        
        Ok(())
    }

    pub fn submit_tip(
        ctx: Context<SubmitTip>,
        ipfs_hash: String,
        encrypted_data: String,
    ) -> Result<()> {
        let tip = &mut ctx.accounts.tip;
        tip.bounty = ctx.accounts.bounty.key();
        tip.submitter = ctx.accounts.submitter.key();
        tip.ipfs_hash = ipfs_hash;
        tip.encrypted_data = encrypted_data;
        tip.bump = ctx.bumps.tip;
        
        Ok(())
    }

    pub fn claim_reward(
        ctx: Context<ClaimReward>,
        proof: String,
    ) -> Result<()> {
        let claim = &mut ctx.accounts.claim;
        claim.bounty = ctx.accounts.bounty.key();
        claim.claimant = ctx.accounts.claimant.key();
        claim.proof = proof;
        claim.status = ClaimStatus::Pending as u8;
        claim.bump = ctx.bumps.claim;
        
        Ok(())
    }

    pub fn admin_verify_claim(
        ctx: Context<AdminVerifyClaim>,
        verified: bool,
    ) -> Result<()> {
        require!(
            ctx.accounts.admin.key() == ctx.accounts.bounty.creator || 
            ctx.accounts.admin.key() == Pubkey::try_from(ADMIN_WALLET).unwrap(),
            ErrorCode::Unauthorized
        );
        
        let claim = &mut ctx.accounts.claim;
        if verified {
            claim.status = ClaimStatus::Verified as u8;
            // Transfer reward to claimant
            // Implementation here
        } else {
            claim.status = ClaimStatus::Rejected as u8;
        }
        
        Ok(())
    }

    pub fn close_bounty(ctx: Context<CloseBounty>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        require!(
            ctx.accounts.creator.key() == bounty.creator,
            ErrorCode::Unauthorized
        );
        
        bounty.status = BountyStatus::Closed as u8;
        // Refund or release funds
        // Implementation here
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateBounty<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + Bounty::LEN,
        seeds = [b"bounty", creator.key().as_ref(), &bounty_seed()],
        bump
    )]
    pub bounty: Account<'info, Bounty>,
    
    /// CHECK: Escrow account for funds
    #[account(mut)]
    pub escrow: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitTip<'info> {
    #[account(mut)]
    pub submitter: Signer<'info>,
    
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    
    #[account(
        init,
        payer = submitter,
        space = 8 + Tip::LEN,
        seeds = [b"tip", bounty.key().as_ref(), submitter.key().as_ref()],
        bump
    )]
    pub tip: Account<'info, Tip>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub claimant: Signer<'info>,
    
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    
    #[account(
        init,
        payer = claimant,
        space = 8 + Claim::LEN,
        seeds = [b"claim", bounty.key().as_ref(), claimant.key().as_ref()],
        bump
    )]
    pub claim: Account<'info, Claim>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AdminVerifyClaim<'info> {
    pub admin: Signer<'info>,
    
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    
    #[account(mut)]
    pub claim: Account<'info, Claim>,
    
    /// CHECK: Claimant wallet
    #[account(mut)]
    pub claimant: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct CloseBounty<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
}

#[account]
pub struct Bounty {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub amount: u64,
    pub token_type: u8, // 0 = SOL, 1 = USDC
    pub status: u8,
    pub bump: u8,
}

impl Bounty {
    pub const LEN: usize = 32 + 200 + 500 + 8 + 1 + 1 + 1; // Adjust sizes as needed
}

#[account]
pub struct Tip {
    pub bounty: Pubkey,
    pub submitter: Pubkey,
    pub ipfs_hash: String,
    pub encrypted_data: String,
    pub bump: u8,
}

impl Tip {
    pub const LEN: usize = 32 + 32 + 100 + 500 + 1; // Adjust sizes as needed
}

#[account]
pub struct Claim {
    pub bounty: Pubkey,
    pub claimant: Pubkey,
    pub proof: String,
    pub status: u8,
    pub bump: u8,
}

impl Claim {
    pub const LEN: usize = 32 + 32 + 200 + 1 + 1; // Adjust sizes as needed
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BountyStatus {
    Open = 0,
    Closed = 1,
    Claimed = 2,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ClaimStatus {
    Pending = 0,
    Verified = 1,
    Rejected = 2,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid status")]
    InvalidStatus,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}

// Helper function for bounty seed (you can make this more sophisticated)
fn bounty_seed() -> u64 {
    // In production, use a counter or timestamp
    0
}

// Update this with your admin wallet address
const ADMIN_WALLET: &str = "11111111111111111111111111111111";

