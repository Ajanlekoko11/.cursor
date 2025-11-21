# Whistle

**The world's first anonymous whistleblower bounty platform on Solana**

> Expose truth. Claim rewards. Stay anonymous.

Whistle is a production-ready MVP for an anonymous whistleblower bounty platform built on Solana. Users can create bounties, submit anonymous tips with encrypted files, and claim rewards—all using password-only wallets powered by Zero Connector.

## Features

- 🔒 **Password-Only Authentication**: No seed phrases, no browser extensions—just email and password
- 💰 **Cryptocurrency Bounties**: Create bounties with SOL or USDC
- 🛡️ **Anonymous Submissions**: Submit tips with encrypted files stored on IPFS
- ⚡ **Instant Wallets**: Every user gets a real Solana wallet automatically
- 🔐 **Self-Custodial**: Fully self-custodial wallets managed server-side
- 🎨 **Professional Dark UI**: Beautiful, high-trust design inspired by WikiLeaks × Stripe × Notion

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Auth & Wallets**: Zero Connector (PostgreSQL adapter)
- **Database**: Supabase PostgreSQL
- **Blockchain**: Solana (Anchor 0.30+)
- **Storage**: IPFS via nft.storage
- **Deployment**: Vercel + Solana mainnet

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- NFT.Storage API key (free)
- Solana CLI tools (for Anchor program deployment)
- Rust and Anchor installed (for smart contracts)

## Setup Instructions

### 1. Clone and Install

```bash
cd whistlechain
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_connection_string

# Zero Connector Configuration
ZERO_CONNECTOR_NETWORK=mainnet-beta

# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Anchor Program
NEXT_PUBLIC_ANCHOR_PROGRAM_ID=your_program_id_here

# IPFS / NFT.Storage
NEXT_PUBLIC_NFT_STORAGE_API_KEY=your_nft_storage_api_key

# Admin Configuration
ADMIN_WALLET_ADDRESS=your_admin_wallet_address

# Session Configuration
SESSION_SECRET=your_random_session_secret_here
ENCRYPTION_KEY=your_encryption_key_for_file_encryption
SESSION_DURATION_DAYS=30

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `lib/supabase/schema.sql`
3. Copy your project URL and anon key to `.env.local`
4. Get your database connection string from Settings > Database

### 4. Initialize Zero Connector Storage

Zero Connector will automatically create its storage tables when first used. Make sure your `DATABASE_URL` is set correctly.

### 5. Get NFT.Storage API Key

1. Go to [nft.storage](https://nft.storage)
2. Sign up and create an API key
3. Add it to `.env.local`

### 6. Set Up Anchor Program

```bash
# Install Anchor (if not already installed)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Build the program
cd programs/whistlechain
anchor build

# Deploy to devnet (for testing)
anchor deploy --provider.cluster devnet

# Or deploy to mainnet
anchor deploy --provider.cluster mainnet
```

Update `NEXT_PUBLIC_ANCHOR_PROGRAM_ID` with your deployed program ID.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3001) in your browser.

## Project Structure

```
whistlechain/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── app/               # Protected dashboard pages
│   │   ├── bounties/      # Bounties listing and detail
│   │   ├── submit/        # Tip submission
│   │   ├── profile/       # User profile
│   │   └── admin/         # Admin dashboard
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       ├── bounties/      # Bounty CRUD
│       ├── tips/          # Tip submission
│       ├── claims/        # Claim management
│       └── upload/        # IPFS file upload
├── components/
│   ├── ui/               # shadcn/ui components
│   └── custom/           # Custom components
├── lib/
│   ├── solana/           # Solana utilities
│   ├── zero-connector/  # Zero Connector setup
│   ├── ipfs/             # IPFS client
│   ├── supabase/         # Supabase client & schema
│   └── encryption.ts     # File encryption utilities
├── programs/
│   └── whistlechain/     # Anchor program (Rust)
└── public/              # Static assets
```

## Key Features Implementation

### Authentication Flow

1. User signs up with email + password
2. Zero Connector creates a Solana wallet automatically
3. Wallet address is stored in Supabase
4. Session token is set in HTTP-only cookie
5. User can authenticate with email + password (no seed phrases!)

### Bounty Creation

1. User creates bounty via form
2. Bounty record created in Supabase
3. User funds bounty via Anchor program (SOL/USDC escrow)
4. On-chain PDA stores bounty metadata

### Tip Submission

1. User selects bounty and uploads file
2. File is encrypted client-side
3. Encrypted file uploaded to IPFS
4. IPFS hash stored on-chain via Anchor program
5. Tip is completely anonymous

### Claim Verification

1. Admin reviews tips and claims
2. Admin verifies claim via Anchor program
3. Reward is released to claimant's wallet
4. Bounty status updated

## Anchor Program

The Solana program is located in `programs/whistlechain/`. Key instructions:

- `create_bounty`: Create bounty with escrow account
- `submit_tip`: Submit anonymous tip with IPFS hash
- `claim_reward`: Claim reward (admin-verified)
- `admin_verify_claim`: Admin-only instruction to verify claims
- `close_bounty`: Close bounty and release/refund funds

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

### Solana Program Deployment

```bash
anchor build
anchor deploy --provider.cluster mainnet
```

## Security Considerations

- ✅ HTTPS only in production
- ✅ HTTP-only session cookies
- ✅ File encryption before IPFS upload
- ✅ Password hashing via Zero Connector
- ✅ Row-level security in Supabase
- ✅ Admin-only claim verification

## Contributing

This is an MVP. Key areas for improvement:

- [ ] Complete Anchor program implementation
- [ ] Add transaction history
- [ ] Implement claim dispute system
- [ ] Add email notifications
- [ ] Multi-admin support
- [ ] Bounty expiration system
- [ ] Advanced search and filtering

## License

MIT

## Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for truth and transparency**
