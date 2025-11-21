'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Tip {
  id: string;
  submitter_wallet: string;
  submitter_wallet_display?: string;
  ipfs_hash: string;
  encrypted_data?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface TipCardProps {
  tip: Tip;
  onApprove: (tipId: string) => void;
  disabled?: boolean;
}

export default function TipCard({ tip, onApprove, disabled }: TipCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#00FFB3] text-[#0F172A]';
      case 'rejected':
        return 'bg-[#94A3B8] text-[#0F172A]';
      default:
        return 'bg-[#334155] text-[#F8FAFC]';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="bg-[#1E293B] border-[#334155] p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm font-medium text-[#F8FAFC]">Submitted by</p>
            <code className="text-xs bg-[#0F172A] px-2 py-1 rounded text-[#94A3B8] font-mono">
              {tip.submitter_wallet_display || tip.submitter_wallet}
            </code>
            <Badge className={getStatusColor(tip.status)}>
              {tip.status}
            </Badge>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Submitted: {formatDate(tip.created_at)}
          </p>
        </div>
      </div>

      {tip.encrypted_data && (
        <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-3">
          <p className="text-xs text-[#94A3B8] mb-1">Description</p>
          <p className="text-sm text-[#F8FAFC]">{tip.encrypted_data}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[#334155]">
        <div>
          <p className="text-xs text-[#94A3B8] mb-1">IPFS Hash</p>
          <a
            href={`https://ipfs.io/ipfs/${tip.ipfs_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#00FFB3] hover:underline font-mono break-all"
          >
            {tip.ipfs_hash}
          </a>
        </div>
        {tip.status === 'pending' && (
          <Button
            onClick={() => onApprove(tip.id)}
            disabled={disabled}
            className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3]"
          >
            Approve & Pay
          </Button>
        )}
      </div>
    </Card>
  );
}

