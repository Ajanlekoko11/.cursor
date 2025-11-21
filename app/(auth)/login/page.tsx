'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent and received
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Small delay to ensure cookie is properly set before redirect
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use window.location for hard redirect to ensure cookies are sent
      // This ensures the browser properly includes the cookie in the next request
      window.location.href = '/app';
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#1E293B] border-[#334155] p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#F8FAFC]">Whistle</h1>
          <p className="text-[#94A3B8]">Sign in to your account</p>
        </div>

        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#F8FAFC]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#F8FAFC]">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3] font-semibold"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Link
            href="/forgot-password"
            className="text-sm text-[#00FFB3] hover:underline"
          >
            Forgot password?
          </Link>
          <p className="text-sm text-[#94A3B8]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#00FFB3] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

