declare module 'zero-connector' {
  export interface PostgresAdapterConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl?: { rejectUnauthorized: boolean };
  }

  export class PostgresAdapter {
    constructor(config: PostgresAdapterConfig);
    getWallet(publicKey: string): Promise<{ encryptedPrivateKey: string }>;
  }

  export interface Session {
    publicKey: string;
    [key: string]: any;
  }

  export interface AuthenticateResult {
    success: boolean;
    [key: string]: any;
  }

  export interface Balance {
    solBalance: number;
    [key: string]: any;
  }

  export interface ZeroConnectorConfig {
    storage: PostgresAdapter;
    network: 'mainnet-beta' | 'devnet';
    customRpcUrl?: string;
    sessionOptions?: {
      sessionDuration?: number;
    };
  }

  export default class ZeroConnector {
    constructor(config: ZeroConnectorConfig);
    verifySession(sessionToken: string): Session | null;
    authenticate(options: { publicKey: string; password: string }): Promise<AuthenticateResult>;
    getBalance(publicKey: string): Promise<{ balance: Balance }>;
    createWallet(options: { password: string }): Promise<{ publicKey: string; encryptedPrivateKey: string }>;
    initialize(): Promise<void>;
    deleteSession(sessionToken: string): void | Promise<void>;
    storage?: PostgresAdapter;
  }
}

