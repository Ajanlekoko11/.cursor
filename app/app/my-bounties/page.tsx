'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Bounty {
  id: string;
  title: string;
  description: string;
  amount_sol: number | null;
  amount_usdc: number | null;
  token_type: 'SOL' | 'USDC';
  status: string;
  created_at: string;
  tip_count: number;
}

export default function MyBountiesPage() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    fetchMyBounties();
  }, [status]);

  const fetchMyBounties = async () => {
    setLoading(true);
    try {
      const url = status ? `/api/bounties/my?status=${status}` : '/api/bounties/my';
      const response = await fetch(url, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setBounties(data.bounties || []);
      }
    } catch (error) {
      console.error('Failed to fetch bounties:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">My Bounties</h1>
          <p className="text-[#94A3B8]">Manage your bounties and review submitted tips</p>
        </div>
        <Button
          asChild
          className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3]"
        >
          <Link href="/app/bounties/create">Create New Bounty</Link>
        </Button>
      </div>

      <Tabs value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? '' : value)}>
        <TabsList className="bg-[#1E293B] border-[#334155]">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#00FFB3] data-[state=active]:text-[#0F172A]">
            All
          </TabsTrigger>
          <TabsTrigger value="open" className="data-[state=active]:bg-[#00FFB3] data-[state=active]:text-[#0F172A]">
            Open
          </TabsTrigger>
          <TabsTrigger value="claimed" className="data-[state=active]:bg-[#00FFB3] data-[state=active]:text-[#0F172A]">
            Claimed
          </TabsTrigger>
          <TabsTrigger value="closed" className="data-[state=active]:bg-[#00FFB3] data-[state=active]:text-[#0F172A]">
            Closed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={status || 'all'} className="mt-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-[#1E293B] border-[#334155] p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4 bg-[#0F172A]" />
                  <Skeleton className="h-4 w-full bg-[#0F172A]" />
                  <Skeleton className="h-4 w-2/3 bg-[#0F172A]" />
                </Card>
              ))}
            </div>
          ) : bounties.length === 0 ? (
            <Card className="bg-[#1E293B] border-[#334155] p-12 text-center">
              <p className="text-[#94A3B8] text-lg mb-4">No bounties found</p>
              <Button
                asChild
                className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3]"
              >
                <Link href="/app/bounties/create">Create Your First Bounty</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bounties.map((bounty) => (
                <Card
                  key={bounty.id}
                  className="bg-[#1E293B] border-[#334155] p-6 space-y-4 hover:border-[#00FFB3]/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-[#F8FAFC] flex-1">
                      {bounty.title}
                    </h3>
                    <Badge className={getStatusColor(bounty.status)}>
                      {bounty.status}
                    </Badge>
                  </div>
                  <p className="text-[#94A3B8] line-clamp-3">
                    {bounty.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#334155]">
                    <div>
                      <p className="text-sm text-[#94A3B8]">Reward</p>
                      <p className="text-lg font-bold text-[#00FFB3]">
                        {formatAmount(bounty)}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {bounty.tip_count} tip{bounty.tip_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3]/10"
                    >
                      <Link href={`/app/my-bounties/${bounty.id}`}>Manage</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

