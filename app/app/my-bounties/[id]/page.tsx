'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import TipCard from '@/components/custom/TipCard';
import ApproveTipDialog from '@/components/custom/ApproveTipDialog';

interface Bounty {
  id: string;
  title: string;
  description: string;
  amount_sol: number | null;
  amount_usdc: number | null;
  token_type: 'SOL' | 'USDC';
  status: string;
  created_at: string;
  winner_tip_id?: string;
  winner_wallet?: string;
  payment_tx_signature?: string;
}

interface Tip {
  id: string;
  submitter_wallet: string;
  submitter_wallet_display?: string;
  ipfs_hash: string;
  encrypted_data?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function BountyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as string;
  
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTipId, setSelectedTipId] = useState<string | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [tipperWallet, setTipperWallet] = useState('');

  useEffect(() => {
    fetchBountyDetails();
    fetchTips();
  }, [bountyId]);

  const fetchBountyDetails = async () => {
    try {
      const response = await fetch(`/api/bounties/my`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        const foundBounty = data.bounties?.find((b: Bounty) => b.id === bountyId);
        setBounty(foundBounty || null);
      }
    } catch (error) {
      console.error('Failed to fetch bounty:', error);
    }
  };

  const fetchTips = async () => {
    try {
      const response = await fetch(`/api/bounties/${bountyId}/tips`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setTips(data.tips || []);
      }
    } catch (error) {
      console.error('Failed to fetch tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (tipId: string) => {
    const tip = tips.find(t => t.id === tipId);
    if (tip) {
      setSelectedTipId(tipId);
      setTipperWallet(tip.submitter_wallet); // Full wallet address for payment
      setApproveDialogOpen(true);
    }
  };

  const handleApproveSuccess = () => {
    setApproveDialogOpen(false);
    setSelectedTipId(null);
    // Refresh data
    fetchBountyDetails();
    fetchTips();
  };

  const formatAmount = (bounty: Bounty) => {
    if (bounty.token_type === 'SOL' && bounty.amount_sol) {
      return `${bounty.amount_sol} SOL`;
    }
    if (bounty.token_type === 'USDC' && bounty.amount_usdc) {
      return `${bounty.amount_usdc} USDC`;
    }
    return 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-[#00FFB3] text-[#0F172A]';
      case 'closed':
        return 'bg-[#94A3B8] text-[#0F172A]';
      case 'claimed':
        return 'bg-[#06B6D4] text-[#0F172A]';
      default:
        return 'bg-[#334155] text-[#F8FAFC]';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 bg-[#1E293B]" />
        <Skeleton className="h-64 w-full bg-[#1E293B]" />
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="space-y-6">
        <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
          Bounty not found
        </Alert>
        <Button asChild variant="outline">
          <Link href="/app/my-bounties">Back to My Bounties</Link>
        </Button>
      </div>
    );
  }

  const amount = bounty.token_type === 'SOL' 
    ? Number(bounty.amount_sol) 
    : Number(bounty.amount_usdc);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            asChild
            variant="ghost"
            className="text-[#94A3B8] hover:text-[#F8FAFC] mb-4"
          >
            <Link href="/app/my-bounties">← Back to My Bounties</Link>
          </Button>
          <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">{bounty.title}</h1>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(bounty.status)}>
              {bounty.status}
            </Badge>
            <p className="text-[#94A3B8]">
              {tips.length} tip{tips.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
        </div>
      </div>

      {/* Bounty Details */}
      <Card className="bg-[#1E293B] border-[#334155] p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[#F8FAFC] mb-2">Bounty Details</h2>
          <p className="text-[#94A3B8] whitespace-pre-wrap">{bounty.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#334155]">
          <div>
            <p className="text-sm text-[#94A3B8] mb-1">Reward</p>
            <p className="text-2xl font-bold text-[#00FFB3]">{formatAmount(bounty)}</p>
          </div>
          <div>
            <p className="text-sm text-[#94A3B8] mb-1">Created</p>
            <p className="text-[#F8FAFC]">
              {new Date(bounty.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        {bounty.status === 'claimed' && bounty.payment_tx_signature && (
          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-[#F8FAFC]">Payment Sent</p>
            <p className="text-xs text-[#94A3B8]">Transaction:</p>
            <a
              href={`https://solscan.io/tx/${bounty.payment_tx_signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00FFB3] hover:underline font-mono break-all"
            >
              {bounty.payment_tx_signature}
            </a>
            {bounty.winner_wallet && (
              <p className="text-xs text-[#94A3B8] mt-2">
                Paid to: <code className="text-[#F8FAFC]">{bounty.winner_wallet}</code>
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Tips Section */}
      <div>
        <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">Submitted Tips</h2>
        {tips.length === 0 ? (
          <Card className="bg-[#1E293B] border-[#334155] p-12 text-center">
            <p className="text-[#94A3B8] text-lg">No tips submitted yet</p>
            <p className="text-sm text-[#94A3B8] mt-2">
              Tips will appear here once users submit evidence
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {tips.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                onApprove={handleApproveClick}
                disabled={bounty.status !== 'open'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approve Dialog */}
      {selectedTipId && bounty && (
        <ApproveTipDialog
          open={approveDialogOpen}
          onOpenChange={setApproveDialogOpen}
          tipId={selectedTipId}
          bountyId={bountyId}
          tokenType={bounty.token_type}
          amount={amount}
          tipperWallet={tipperWallet}
          onSuccess={handleApproveSuccess}
        />
      )}
    </div>
  );
}

