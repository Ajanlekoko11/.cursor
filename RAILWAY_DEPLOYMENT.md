# Railway + Supabase Deployment Guide

Complete guide for deploying Whistle to Railway with Supabase.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
3. **GitHub Repository**: Your code pushed to GitHub
4. **NFT.Storage API Key**: Get one at [nft.storage](https://nft.storage)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `whistle` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project initialization (~2 minutes)

### 1.2 Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `lib/supabase/schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Verify success message

### 1.3 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
   - **service_role key**: Long string (keep this secret!)

3. Go to **Settings** → **Database**
4. Under **Connection string**, select **URI**
5. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)

## Step 2: Railway Setup

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Authorize Railway to access your GitHub
5. Select your repository
6. Railway will auto-detect Next.js

### 2.2 Configure Service Settings

1. Click on your service
2. Go to **Settings** tab
3. Set **Root Directory** to: `whistlechain` (if deploying from monorepo)
4. Verify:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### 2.3 Add Environment Variables

Go to **Variables** tab and add all of these:

#### Required Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

#### Required Solana Variables
```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
ZERO_CONNECTOR_NETWORK=mainnet-beta
```

#### Required IPFS/NFT.Storage
```
NEXT_PUBLIC_NFT_STORAGE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Required Security (Generate Random Strings)
```
SESSION_SECRET=[Generate 32+ character random string]
ENCRYPTION_KEY=[Generate 32+ character random string]
SESSION_DURATION_DAYS=30
```

#### Required App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```
*(Update this after deployment with your Railway domain or custom domain)*

#### Optional Anchor Program
```
NEXT_PUBLIC_ANCHOR_PROGRAM_ID=your_program_id_here
```
*(Only if you've deployed the Anchor program)*

#### Optional Admin
```
ADMIN_WALLET_ADDRESS=your_admin_wallet_address
```
*(Only if you want admin features)*

### 2.4 Generate Secure Secrets

Use one of these methods to generate `SESSION_SECRET` and `ENCRYPTION_KEY`:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 2: Using OpenSSL (Linux/Mac)**
```bash
openssl rand -base64 32
```

**Option 3: Online Generator**
- Visit [randomkeygen.com](https://randomkeygen.com)
- Use "CodeIgniter Encryption Keys" (256-bit)

### 2.5 Deploy

1. Railway will automatically start building when you push to GitHub
2. Or click **Deploy** in Railway dashboard
3. Monitor the build logs in **Deployments** tab
4. Wait for deployment to complete (~3-5 minutes)

### 2.6 Get Your Railway URL

1. After deployment, go to **Settings** → **Networking**
2. Railway provides a default domain: `your-app.railway.app`
3. Update `NEXT_PUBLIC_APP_URL` with this domain
4. Redeploy (Railway will auto-redeploy when you update variables)

## Step 3: Custom Domain (Optional)

1. In Railway, go to **Settings** → **Networking**
2. Click **Custom Domain**
3. Add your domain (e.g., `whistle.com`)
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` with your custom domain
6. Redeploy

## Step 4: Verify Deployment

### 4.1 Check Application

1. Visit your Railway URL
2. Test signup flow
3. Test login flow
4. Verify database connection works

### 4.2 Check Logs

1. In Railway, go to **Deployments** tab
2. Click on latest deployment
3. Check for any errors
4. Common issues:
   - Missing environment variables
   - Database connection errors
   - Invalid API keys

### 4.3 Test Database

1. In Supabase, go to **Table Editor**
2. Verify tables exist: `users`, `bounties`, `tips`, `claims`
3. Create a test user via the app
4. Verify user appears in `users` table

## Step 5: Post-Deployment

### 5.1 Initialize Zero Connector

Zero Connector will automatically create its storage tables on first use. To verify:

1. Sign up a test user
2. Check Supabase **Table Editor**
3. Look for Zero Connector tables (usually prefixed with `zero_connector_`)

### 5.2 Set Up Admin (Optional)

1. In Supabase **SQL Editor**, run:
```sql
UPDATE users 
SET is_admin = true 
WHERE wallet_address = 'YOUR_ADMIN_WALLET_ADDRESS';
```

2. Update `ADMIN_WALLET_ADDRESS` in Railway variables

### 5.3 Monitor

- **Railway**: Check deployment logs and metrics
- **Supabase**: Monitor database usage and API calls
- **Application**: Set up error tracking (e.g., Sentry)

## Troubleshooting

### Build Fails

- Check Railway build logs
- Verify all environment variables are set
- Ensure `package.json` has correct scripts

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure database password is correct in connection string

### Application Errors

- Check Railway logs
- Verify all `NEXT_PUBLIC_*` variables are set
- Check browser console for client-side errors

### Session Issues

- Verify `SESSION_SECRET` is set and unique
- Check cookie settings (should work automatically on Railway)
- Ensure `NEXT_PUBLIC_APP_URL` matches your actual domain

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | ✅ | Solana RPC endpoint |
| `NEXT_PUBLIC_SOLANA_NETWORK` | ✅ | `mainnet-beta` or `devnet` |
| `ZERO_CONNECTOR_NETWORK` | ✅ | `mainnet-beta` or `devnet` |
| `NEXT_PUBLIC_NFT_STORAGE_API_KEY` | ✅ | NFT.Storage API key |
| `SESSION_SECRET` | ✅ | Random 32+ char string |
| `ENCRYPTION_KEY` | ✅ | Random 32+ char string |
| `SESSION_DURATION_DAYS` | ✅ | Session duration (default: 30) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your Railway domain |
| `NEXT_PUBLIC_ANCHOR_PROGRAM_ID` | ⚠️ | Only if using Anchor program |
| `ADMIN_WALLET_ADDRESS` | ⚠️ | Only if using admin features |

## Cost Estimates

- **Railway**: Free tier available, paid plans start at $5/month
- **Supabase**: Free tier (500MB DB, 2GB bandwidth)
- **NFT.Storage**: Free tier available
- **Solana RPC**: Free public RPC (consider paid for production)

## Support

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Issues: Open a GitHub issue

---

**Ready to deploy? Follow the steps above and your Whistle app will be live on Railway! 🚀**

