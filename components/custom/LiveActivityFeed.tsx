'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Gift, FileText, CheckCircle2, Loader2 } from 'lucide-react';

interface Activity {
  id: string;
  type: 'bounty' | 'tip' | 'claim';
  timestamp: Date;
  data: {
    bountyId?: string;
    bountyTitle?: string;
    amount?: number;
    tokenType?: 'SOL' | 'USDC';
    tipId?: string;
    transactionSignature?: string;
    winnerWallet?: string;
  };
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const maxActivities = 8; // Reduced for compact upper-right display

  // Format amount
  const formatAmount = (amount: number, tokenType: 'SOL' | 'USDC') => {
    if (tokenType === 'SOL') {
      return `${amount.toFixed(4)} SOL`;
    } else {
      return `${amount.toFixed(2)} USDC`;
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Shorten address/ID
  const shortenId = (id: string, length = 8) => {
    if (!id) return '';
    if (id.length <= length * 2) return id;
    return `${id.slice(0, length)}...${id.slice(-length)}`;
  };

  // Get Solana explorer URL based on network
  const getSolanaExplorerUrl = (signature: string) => {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
    const baseUrl = network === 'mainnet-beta' 
      ? 'https://solscan.io/tx'
      : `https://solscan.io/tx?cluster=${network}`;
    return `${baseUrl}/${signature}`;
  };


  // Load initial activities
  useEffect(() => {
    const loadInitialActivities = async () => {
      try {
        // Get recent bounties
        const { data: recentBounties } = await supabase
          .from('bounties')
          .select('id, title, amount_sol, amount_usdc, token_type, created_at, status, payment_tx_signature, winner_wallet')
          .order('created_at', { ascending: false })
          .limit(10);

        // Get recent tips
        const { data: recentTips } = await supabase
          .from('tips')
          .select('id, bounty_id, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        const initialActivities: Activity[] = [];

        // Add bounties
        if (recentBounties) {
          recentBounties.forEach((bounty) => {
            initialActivities.push({
              id: `bounty-${bounty.id}`,
              type: 'bounty',
              timestamp: new Date(bounty.created_at),
              data: {
                bountyId: bounty.id,
                bountyTitle: bounty.title,
                amount: bounty.token_type === 'SOL' 
                  ? Number(bounty.amount_sol) 
                  : Number(bounty.amount_usdc),
                tokenType: bounty.token_type as 'SOL' | 'USDC',
              },
            });
          });
        }

        // Add tips (fetch bounty titles separately)
        if (recentTips && recentTips.length > 0) {
          const bountyIds = [...new Set(recentTips.map(t => t.bounty_id))];
          const { data: tipBounties } = await supabase
            .from('bounties')
            .select('id, title')
            .in('id', bountyIds);

          const bountyTitleMap = new Map(
            (tipBounties || []).map(b => [b.id, b.title])
          );

          recentTips.forEach((tip) => {
            initialActivities.push({
              id: `tip-${tip.id}`,
              type: 'tip',
              timestamp: new Date(tip.created_at),
              data: {
                bountyId: tip.bounty_id,
                bountyTitle: bountyTitleMap.get(tip.bounty_id) || 'Unknown Bounty',
                tipId: tip.id,
              },
            });
          });
        }

        // Add claimed bounties
        if (recentBounties) {
          recentBounties
            .filter((b) => b.status === 'claimed' && b.payment_tx_signature)
            .forEach((bounty) => {
              initialActivities.push({
                id: `claim-${bounty.id}`,
                type: 'claim',
                timestamp: new Date(bounty.updated_at || bounty.created_at),
                data: {
                  bountyId: bounty.id,
                  bountyTitle: bounty.title,
                  amount: bounty.token_type === 'SOL' 
                    ? Number(bounty.amount_sol) 
                    : Number(bounty.amount_usdc),
                  tokenType: bounty.token_type as 'SOL' | 'USDC',
                  transactionSignature: bounty.payment_tx_signature || undefined,
                  winnerWallet: bounty.winner_wallet || undefined,
                },
              });
            });
        }

        // Sort by timestamp and limit
        const sorted = initialActivities
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, maxActivities);

        setActivities(sorted);
      } catch (error) {
        console.error('Error loading initial activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialActivities();
  }, []);

  // Update timestamps every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities((prev) => [...prev]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-[#1E293B]/80 border-[#334155] p-6 backdrop-blur-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#00FFB3] animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1E293B]/90 border-[#334155] p-4 backdrop-blur-sm hover:border-[#00FFB3]/30 transition-all hover-glow shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#F8FAFC]">Activity</h3>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-6 text-[#94A3B8] text-xs">
            <p>No activity yet</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className="bg-[#0F172A]/60 border border-[#334155] rounded-lg p-3 hover:border-[#00FFB3]/40 hover:bg-[#0F172A]/80 transition-all hover-lift group"
              style={{ 
                animation: `slide-in-right 0.6s ease-out ${index * 0.1}s both, scale-in 0.4s ease-out ${index * 0.1 + 0.2}s both`,
              }}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  {activity.type === 'bounty' && (
                    <Gift className="w-4 h-4 text-[#00FFB3] animate-pulse-glow" />
                  )}
                  {activity.type === 'tip' && (
                    <FileText className="w-4 h-4 text-[#06B6D4] animate-pulse-glow" />
                  )}
                  {activity.type === 'claim' && (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] animate-pulse-glow" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {activity.type === 'bounty' && (
                    <div>
                      <p className="text-xs text-[#F8FAFC] font-medium truncate">
                        New bounty
                      </p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                        {activity.data.bountyTitle}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-semibold text-[#00FFB3]">
                          {activity.data.amount && activity.data.tokenType
                            ? formatAmount(activity.data.amount, activity.data.tokenType)
                            : 'N/A'}
                        </span>
                        {activity.data.bountyId && (
                          <Link
                            href={`/app/bounties`}
                            className="text-[10px] text-[#00FFB3] hover:underline font-mono"
                          >
                            #{shortenId(activity.data.bountyId, 6)}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {activity.type === 'tip' && (
                    <div>
                      <p className="text-xs text-[#F8FAFC] font-medium">
                        Tip submitted
                      </p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                        {activity.data.bountyTitle}
                      </p>
                      {activity.data.bountyId && (
                        <Link
                          href={`/app/bounties`}
                          className="text-[10px] text-[#06B6D4] hover:underline mt-1 inline-block font-mono"
                        >
                          #{shortenId(activity.data.bountyId, 6)}
                        </Link>
                      )}
                    </div>
                  )}

                  {activity.type === 'claim' && (
                    <div>
                      <p className="text-xs text-[#F8FAFC] font-medium">
                        Reward claimed
                      </p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                        {activity.data.bountyTitle}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold text-[#10B981]">
                          {activity.data.amount && activity.data.tokenType
                            ? formatAmount(activity.data.amount, activity.data.tokenType)
                            : 'N/A'}
                        </span>
                        {activity.data.transactionSignature && (
                          <a
                            href={getSolanaExplorerUrl(activity.data.transactionSignature)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#10B981] hover:underline font-mono"
                          >
                            TX
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-[#64748B] mt-1.5">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

