'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ApproveTipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipId: string;
  bountyId: string;
  tokenType: 'SOL' | 'USDC';
  amount: number;
  tipperWallet: string;
  onSuccess: () => void;
}

export default function ApproveTipDialog({
  open,
  onOpenChange,
  tipId,
  bountyId,
  tokenType,
  amount,
  tipperWallet,
  onSuccess,
}: ApproveTipDialogProps) {
  const [recipientType, setRecipientType] = useState<'tipper' | 'external'>('tipper');
  const [externalWallet, setExternalWallet] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    setError('');
    
    if (recipientType === 'external' && !externalWallet.trim()) {
      setError('Please enter an external wallet address');
      return;
    }

    if (!password) {
      setError('Password is required to sign the transaction');
      return;
    }

    setLoading(true);

    try {
      const recipientWallet = recipientType === 'tipper' ? tipperWallet : externalWallet;

      const response = await fetch(`/api/bounties/${bountyId}/approve-tip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tipId,
          recipientWallet,
          recipientType,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to approve tip');
        setLoading(false);
        return;
      }

      // Success - close dialog and refresh
      onOpenChange(false);
      setPassword('');
      setExternalWallet('');
      setRecipientType('tipper');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E293B] border-[#334155] text-[#F8FAFC] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#F8FAFC]">
            Approve Tip & Send Payment
          </DialogTitle>
          <DialogDescription className="text-[#94A3B8]">
            Approve this tip and send {amount} {tokenType} to the recipient
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
            {error}
          </Alert>
        )}

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-[#F8FAFC]">Payment Recipient</Label>
            <RadioGroup value={recipientType} onValueChange={(value: 'tipper' | 'external') => setRecipientType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tipper" id="tipper" />
                <Label htmlFor="tipper" className="text-[#F8FAFC] cursor-pointer">
                  Send to tipper wallet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="external" id="external" />
                <Label htmlFor="external" className="text-[#F8FAFC] cursor-pointer">
                  Send to external wallet
                </Label>
              </div>
            </RadioGroup>
          </div>

          {recipientType === 'external' && (
            <div className="space-y-2">
              <Label htmlFor="externalWallet" className="text-[#F8FAFC]">
                External Wallet Address
              </Label>
              <Input
                id="externalWallet"
                value={externalWallet}
                onChange={(e) => setExternalWallet(e.target.value)}
                placeholder="Enter Solana wallet address"
                className="bg-[#0F172A] border-[#334155] text-[#F8FAFC] font-mono text-sm"
              />
              <p className="text-xs text-[#94A3B8]">
                {recipientType === 'tipper' 
                  ? `Tipper wallet: ${tipperWallet.slice(0, 8)}...${tipperWallet.slice(-8)}`
                  : 'Enter a valid Solana wallet address'}
              </p>
            </div>
          )}

          {recipientType === 'tipper' && (
            <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-3">
              <p className="text-xs text-[#94A3B8] mb-1">Tipper Wallet</p>
              <code className="text-sm text-[#F8FAFC] font-mono break-all">
                {tipperWallet}
              </code>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#F8FAFC]">
              Your Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to sign transaction"
              className="bg-[#0F172A] border-[#334155] text-[#F8FAFC]"
            />
            <p className="text-xs text-[#94A3B8]">
              Required to sign the on-chain transaction
            </p>
          </div>

          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-[#F8FAFC]">Payment Summary</p>
            <div className="flex justify-between text-sm">
              <span className="text-[#94A3B8]">Amount:</span>
              <span className="text-[#00FFB3] font-bold">{amount} {tokenType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#94A3B8]">Recipient:</span>
              <span className="text-[#F8FAFC] font-mono text-xs">
                {recipientType === 'tipper' 
                  ? `${tipperWallet.slice(0, 8)}...${tipperWallet.slice(-8)}`
                  : externalWallet || 'Not set'}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-[#334155] text-[#F8FAFC] hover:bg-[#334155]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={loading || !password || (recipientType === 'external' && !externalWallet.trim())}
            className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3]"
          >
            {loading ? 'Processing...' : 'Approve & Send Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

