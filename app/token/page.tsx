'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/custom/Footer';
import AnimatedSection from '@/components/custom/AnimatedSection';

export default function TokenPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,179,0.1),transparent_50%)] animate-pulse-glow" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00FFB3]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-[#334155] bg-[#1E293B]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#00FFB3] hover:text-[#00E6A3] transition-colors">
            Whistle
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              Docs
            </Link>
            <Link href="/whitepaper" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              Whitepaper
            </Link>
            <Button asChild variant="outline" className="border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3]/10">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <AnimatedSection direction="fade" delay={0}>
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="animate-gradient-text">
                  Whistle Token
                </span>
              </h1>
              <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
                Coming soon on Pump.fun
              </p>
            </div>
          </AnimatedSection>

          {/* Coming Soon Notice */}
          <AnimatedSection direction="up" delay={200}>
            <Card className="bg-[#1E293B]/50 border-[#00FFB3]/20 p-12 mb-12 hover-glow animate-pulse-glow">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🚀</div>
              <div className="flex justify-center mb-4">
                <Badge className="bg-[#00FFB3] text-[#0F172A] text-lg px-4 py-2">
                  Coming Soon
                </Badge>
              </div>
              <h2 className="text-3xl font-semibold text-[#F8FAFC]">Token Launch Coming Soon</h2>
              <p className="text-[#94A3B8] max-w-md mx-auto text-lg">
                The Whistle token will be launching on Pump.fun soon. Stay tuned for updates on the launch date 
                and token details.
              </p>
            </div>
          </Card>
          </AnimatedSection>

          {/* Info Cards */}
          <AnimatedSection direction="up" delay={400}>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-3 hover:border-[#00FFB3]/50 transition-all duration-300 hover-lift hover-glow group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">💎</div>
              <h3 className="text-xl font-semibold text-[#F8FAFC]">Token Utility</h3>
              <p className="text-[#94A3B8]">
                Details about how the Whistle token will be used within the platform will be announced soon.
              </p>
            </Card>

            <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-3 hover:border-[#00FFB3]/50 transition-all duration-300 hover-lift hover-glow group" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-xl font-semibold text-[#F8FAFC]">Tokenomics</h3>
              <p className="text-[#94A3B8]">
                Complete tokenomics including distribution, supply, and allocation will be detailed in the whitepaper.
              </p>
            </Card>
          </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection direction="fade" delay={600}>
            <div className="text-center space-y-4">
            <p className="text-[#94A3B8]">Want to be notified when we launch?</p>
            <Button
              asChild
              size="lg"
              className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3] text-lg px-8 py-6 font-semibold"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}

