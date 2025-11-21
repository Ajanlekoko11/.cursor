'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface UserData {
  email: string;
  walletAddress: string;
  isAdmin: boolean;
}

interface Balance {
  solBalance: number;
  customData?: any;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (retryCount = 0) => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Ensure cookies are sent with the request
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setBalance(data.balance);
      } else {
        console.error('Dashboard fetch error:', data.error);
        
        // Only redirect on clear authentication errors
        // Retry on temporary errors (network issues, timeouts, etc.)
        if (response.status === 401) {
          const errorMsg = data.error?.toLowerCase() || '';
          // Only redirect if it's a clear auth error, not a temporary issue
          if (errorMsg.includes('invalid session') || 
              errorMsg.includes('not authenticated') ||
              errorMsg.includes('session expired')) {
            window.location.href = '/login';
            return;
          }
        }
        
        // Retry on server errors (500, 503) or temporary issues (0 = network error)
        if ((response.status >= 500 || response.status === 503 || response.status === 0) && retryCount < 2) {
          console.log(`Retrying dashboard fetch (attempt ${retryCount + 1})...`);
          setTimeout(() => fetchDashboardData(retryCount + 1), 2000);
          return;
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Retry on network errors
      if (retryCount < 2) {
        console.log(`Retrying dashboard fetch after error (attempt ${retryCount + 1})...`);
        setTimeout(() => fetchDashboardData(retryCount + 1), 2000);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const formatSol = (sol: number) => {
    return sol.toFixed(4);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">Dashboard</h1>
        <p className="text-[#94A3B8]">Welcome back to Whistle</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-[#1E293B] border-[#334155] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2">
              Wallet Balance
            </h2>
            {loading ? (
              <Skeleton className="h-8 w-32 bg-[#0F172A]" />
            ) : (
              <p className="text-3xl font-bold text-[#00FFB3]">
                {balance ? `${formatSol(balance.solBalance)} SOL` : '0.0000 SOL'}
              </p>
            )}
            <p className="text-sm text-[#94A3B8] mt-2 font-mono">
              {user ? shortenAddress(user.walletAddress) : 'Loading...'}
            </p>
          </div>
          <Button
            asChild
            className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3]"
          >
            <Link href="/app/profile">View Profile</Link>
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#1E293B] border-[#334155] p-6 space-y-4">
          <h3 className="text-xl font-semibold text-[#F8FAFC]">Submit a Tip</h3>
          <p className="text-[#94A3B8]">
            Submit anonymous evidence to an existing bounty. Your identity stays protected.
          </p>
          <Button
            asChild
            className="w-full bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3]"
          >
            <Link href="/app/submit">Submit Tip</Link>
          </Button>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155] p-6 space-y-4">
          <h3 className="text-xl font-semibold text-[#F8FAFC]">Create Bounty</h3>
          <p className="text-[#94A3B8]">
            Create a new bounty and fund it with SOL or USDC. Rewards are paid upon verification.
          </p>
          <Button
            asChild
            variant="outline"
            className="w-full border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3]/10"
          >
            <Link href="/app/bounties?create=true">Create Bounty</Link>
          </Button>
        </Card>
      </div>

      {/* Recent Bounties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-[#F8FAFC]">Recent Bounties</h2>
          <Button
            asChild
            variant="ghost"
            className="text-[#00FFB3] hover:text-[#00E6A3]"
          >
            <Link href="/app/bounties">View All</Link>
          </Button>
        </div>
        <Card className="bg-[#1E293B] border-[#334155] p-6">
          <p className="text-[#94A3B8] text-center py-8">
            No bounties yet. Be the first to create one!
          </p>
        </Card>
      </div>
    </div>
  );
}

