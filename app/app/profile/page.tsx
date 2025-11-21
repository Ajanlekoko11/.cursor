'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface UserData {
  email: string;
  walletAddress: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Balance {
  solBalance: number;
  customData?: any;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async (retryCount = 0) => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Ensure cookies are sent with the request
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setBalance(data.balance);
      } else {
        console.error('Profile fetch error:', data.error);
        
        // Only redirect on clear authentication errors
        if (response.status === 401) {
          const errorMsg = data.error?.toLowerCase() || '';
          if (errorMsg.includes('invalid session') || 
              errorMsg.includes('not authenticated') ||
              errorMsg.includes('session expired')) {
            window.location.href = '/login';
            return;
          }
        }
        
        // Retry on server errors (500, 503) or temporary issues (0 = network error)
        if ((response.status >= 500 || response.status === 503 || response.status === 0) && retryCount < 2) {
          console.log(`Retrying profile fetch (attempt ${retryCount + 1})...`);
          setTimeout(() => fetchProfile(retryCount + 1), 2000);
          return;
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      
      // Retry on network errors
      if (retryCount < 2) {
        console.log(`Retrying profile fetch after error (attempt ${retryCount + 1})...`);
        setTimeout(() => fetchProfile(retryCount + 1), 2000);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const formatSol = (sol: number) => {
    return sol.toFixed(4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">Profile</h1>
        <p className="text-[#94A3B8]">Manage your account and wallet</p>
      </div>

      {/* Wallet Info */}
      <Card className="bg-[#1E293B] border-[#334155] p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Wallet Information</h2>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full bg-[#0F172A]" />
              <Skeleton className="h-6 w-full bg-[#0F172A]" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[#0F172A] border border-[#334155] rounded px-4 py-2 text-[#F8FAFC] font-mono text-sm">
                    {user?.walletAddress || 'Loading...'}
                  </code>
                  <Button
                    onClick={() => user && copyToClipboard(user.walletAddress)}
                    variant="outline"
                    size="sm"
                    className="border-[#334155] text-[#F8FAFC] hover:bg-[#334155]"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-[#94A3B8] mb-1">Balance</p>
                <p className="text-2xl font-bold text-[#00FFB3]">
                  {balance ? `${formatSol(balance.solBalance)} SOL` : '0.0000 SOL'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[#334155]">
                <Badge className={user?.isAdmin ? 'bg-[#00FFB3] text-[#0F172A]' : 'bg-[#334155] text-[#F8FAFC]'}>
                  {user?.isAdmin ? 'Admin' : 'User'}
                </Badge>
                <p className="text-sm text-[#94A3B8]">
                  Account created: {user ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Account Info */}
      <Card className="bg-[#1E293B] border-[#334155] p-6 space-y-4">
        <h2 className="text-xl font-semibold text-[#F8FAFC]">Account Information</h2>
        {loading ? (
          <Skeleton className="h-6 w-full bg-[#0F172A]" />
        ) : (
          <div className="space-y-2">
            <div>
              <p className="text-sm text-[#94A3B8]">Email</p>
              <p className="text-[#F8FAFC]">{user?.email || 'N/A'}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Security Notice */}
      <Card className="bg-[#0F172A] border border-[#334155] p-6">
        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">Security Notice</h3>
        <ul className="text-sm text-[#94A3B8] space-y-2 list-disc list-inside">
          <li>Your wallet is fully self-custodial and encrypted with your password</li>
          <li>If you lose your password, your wallet cannot be recovered</li>
          <li>Never share your password with anyone</li>
          <li>Your private key is encrypted and stored securely server-side</li>
        </ul>
      </Card>
    </div>
  );
}

