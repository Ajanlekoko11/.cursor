import ZeroConnector, { PostgresAdapter } from 'zero-connector';

// Initialize Zero Connector with PostgreSQL adapter
let connectorInstance: ZeroConnector | null = null;
let isInitialized = false;

export async function getZeroConnector(): Promise<ZeroConnector> {
  if (connectorInstance && isInitialized) {
    return connectorInstance;
  }

  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL or SUPABASE_DB_URL');
  }

  // Parse connection string for PostgresAdapter
  const url = new URL(connectionString);
  const storage = new PostgresAdapter({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1), // Remove leading /
    user: url.username,
    password: url.password,
    ssl: { rejectUnauthorized: false }, // Enable SSL for Supabase
  });
  
  connectorInstance = new ZeroConnector({
    storage,
    network: (process.env.ZERO_CONNECTOR_NETWORK || 'devnet') as 'mainnet-beta' | 'devnet',
    customRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    sessionOptions: {
      sessionDuration: parseInt(process.env.SESSION_DURATION_DAYS || '30') * 24 * 60 * 60 * 1000,
    },
  });

  // Initialize tables on first use (non-blocking for better performance)
  if (!isInitialized) {
    try {
      // Set a timeout for initialization (10 seconds max)
      const initPromise = connectorInstance.initialize();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Initialization timeout')), 10000)
      );
      
      await Promise.race([initPromise, timeoutPromise]);
      isInitialized = true;
      console.log('[Zero Connector] Initialized successfully');
    } catch (error: any) {
      // If tables already exist or timeout, that's okay - continue anyway
      // Tables will be created on first wallet creation if needed
      if (error.message?.includes('already exists') || error.message?.includes('timeout')) {
        console.log('[Zero Connector] Tables may already exist, continuing...');
        isInitialized = true;
      } else {
        console.warn('[Zero Connector] Initialization warning:', error.message);
        // Don't throw - allow wallet creation to proceed
        // If tables don't exist, they'll be created on first wallet creation
        isInitialized = true;
      }
    }
  }

  return connectorInstance;
}

// Initialize database tables
export async function initializeZeroConnector() {
  const connector = await getZeroConnector();
  return connector;
}

