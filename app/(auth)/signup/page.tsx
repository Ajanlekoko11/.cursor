'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, Copy, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrivateKeyDialog, setShowPrivateKeyDialog] = useState(false);
  const [privateKeyBase58, setPrivateKeyBase58] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [hasConfirmedSaved, setHasConfirmedSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Store private key and public key to show in dialog
      if (data.privateKeyBase58) {
        setPrivateKeyBase58(data.privateKeyBase58);
        setPublicKey(data.publicKey);
        setShowPrivateKeyDialog(true);
        setLoading(false);
      } else {
        // If no private key, redirect normally
        router.push('/app');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setPrivateKeyCopied(true);
    setTimeout(() => setPrivateKeyCopied(false), 2000);
  };

  const handleContinueToDashboard = () => {
    if (hasConfirmedSaved || !privateKeyBase58) {
      setShowPrivateKeyDialog(false);
      router.push('/app');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#1E293B] border-[#334155] p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#F8FAFC]">Whistle</h1>
          <p className="text-[#94A3B8]">Create your account</p>
          <p className="text-sm text-[#00FFB3]">
            A Solana wallet will be created automatically
          </p>
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
              minLength={8}
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
              placeholder="••••••••"
            />
            <p className="text-xs text-[#94A3B8]">
              Must be at least 8 characters
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[#F8FAFC]">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-[#94A3B8]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00FFB3] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>

      {/* Private Key Display Dialog */}
      <Dialog open={showPrivateKeyDialog} onOpenChange={(open) => {
        // Prevent closing until user confirms they've saved the key
        if (!open && !hasConfirmedSaved && privateKeyBase58) {
          return;
        }
        if (!open) {
          setShowPrivateKeyDialog(false);
        }
      }}>
        <DialogContent 
          className="bg-[#1E293B] border-[#334155] text-[#F8FAFC] max-w-2xl"
          showCloseButton={hasConfirmedSaved}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-[#00FFB3]" />
              <DialogTitle className="text-2xl text-[#F8FAFC]">
                Account Created Successfully!
              </DialogTitle>
            </div>
            <DialogDescription className="text-[#94A3B8] text-base">
              Your Solana wallet has been created. Please save your private key securely.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Security Warning */}
            <Alert className="bg-amber-500/10 border-amber-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div className="ml-3">
                <h4 className="font-semibold text-amber-400 mb-1">Critical: Save Your Private Key</h4>
                <ul className="text-sm text-amber-300/90 space-y-1 list-disc list-inside">
                  <li>This is the only time you'll see your private key</li>
                  <li>If you lose it, your wallet cannot be recovered</li>
                  <li>Never share it with anyone</li>
                  <li>Store it in a secure password manager or write it down safely</li>
                </ul>
              </div>
            </Alert>

            {/* Public Key */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94A3B8]">Wallet Address (Public Key)</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[#0F172A] border border-[#334155] rounded px-4 py-3 text-[#F8FAFC] font-mono text-sm break-all">
                  {publicKey || 'Loading...'}
                </code>
                <Button
                  onClick={() => publicKey && copyToClipboard(publicKey)}
                  variant="outline"
                  size="sm"
                  className="border-[#334155] text-[#F8FAFC] hover:bg-[#334155] shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Private Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#94A3B8]">Private Key (Base58)</label>
                <Button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  variant="ghost"
                  size="sm"
                  className="text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  {showPrivateKey ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[#0F172A] border border-[#334155] rounded px-4 py-3 text-[#F8FAFC] font-mono text-sm break-all">
                  {showPrivateKey ? (privateKeyBase58 || 'Not available') : '••••••••••••••••••••••••••••••••'}
                </code>
                <Button
                  onClick={() => privateKeyBase58 && copyToClipboard(privateKeyBase58)}
                  variant="outline"
                  size="sm"
                  className="border-[#334155] text-[#F8FAFC] hover:bg-[#334155] shrink-0"
                >
                  {privateKeyCopied ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00FFB3]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {privateKeyCopied && (
                <p className="text-xs text-[#00FFB3] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Copied to clipboard!
                </p>
              )}
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-[#0F172A] border border-[#334155] rounded-lg">
              <input
                type="checkbox"
                id="confirmSaved"
                checked={hasConfirmedSaved}
                onChange={(e) => setHasConfirmedSaved(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#334155] bg-[#1E293B] text-[#00FFB3] focus:ring-[#00FFB3] focus:ring-offset-[#0F172A]"
              />
              <label htmlFor="confirmSaved" className="text-sm text-[#94A3B8] cursor-pointer">
                I have saved my private key securely and understand that it cannot be recovered if lost.
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleContinueToDashboard}
              disabled={!hasConfirmedSaved && !!privateKeyBase58}
              className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3] font-semibold"
            >
              Continue to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

