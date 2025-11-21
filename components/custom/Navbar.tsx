'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async (retryCount = 0) => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Ensure cookies are sent with the request
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
      } else {
        // Don't redirect from navbar - let the layout handle it
        // Only log errors, don't take action
        console.error('Navbar fetch error:', data.error);
        
        // Retry on server errors
        if ((response.status >= 500 || response.status === 0) && retryCount < 1) {
          setTimeout(() => fetchUser(retryCount + 1), 2000);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      
      // Retry on network errors
      if (retryCount < 1) {
        setTimeout(() => fetchUser(retryCount + 1), 2000);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <nav className="border-b border-[#334155] bg-[#1E293B] animate-slide-in-left">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/app" className="text-xl font-bold text-[#00FFB3] hover:text-[#00E6A3] transition-colors hover-glow">
            Whistle
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link
              href="/app"
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-300 hover:scale-110"
            >
              Dashboard
            </Link>
            <Link
              href="/app/bounties"
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-300 hover:scale-110"
            >
              Bounties
            </Link>
            <Link
              href="/app/my-bounties"
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-300 hover:scale-110"
            >
              My Bounties
            </Link>
            <Link
              href="/app/submit"
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-300 hover:scale-110"
            >
              Submit Tip
            </Link>
            <Link
              href="/app/profile"
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-300 hover:scale-110"
            >
              Profile
            </Link>
            {user?.isAdmin && (
              <Link
                href="/app/admin"
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {!loading && user && (
            <>
              <span className="text-sm text-[#94A3B8] font-mono">
                {shortenAddress(user.walletAddress)}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-[#334155] text-[#F8FAFC] hover:bg-[#334155] hover-lift transition-all"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

