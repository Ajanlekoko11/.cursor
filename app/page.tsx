'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/custom/Footer';
import AnimatedSection from '@/components/custom/AnimatedSection';
import LiveActivityFeed from '@/components/custom/LiveActivityFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,179,0.1),transparent_50%)] animate-pulse-glow" />
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00FFB3]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#00FFB3]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-[#334155] bg-[#1E293B]/80 backdrop-blur-sm animate-slide-in-left">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#00FFB3] hover:text-[#00E6A3] transition-colors hover-glow">
            Whistle
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/docs" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-300 hover:scale-110">
              Docs
            </Link>
            <Link href="/whitepaper" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-300 hover:scale-110">
              Whitepaper
            </Link>
            <Link href="/token" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-300 hover:scale-110 inline-flex items-center gap-2">
              Token
              <span className="bg-[#00FFB3]/20 text-[#00FFB3] text-xs px-2 py-0.5 rounded border border-[#00FFB3]/30 animate-pulse-glow">
                Soon
              </span>
            </Link>
            <Button asChild variant="outline" className="border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3]/10 hover-lift">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Live Activity Feed - Upper Right */}
      <div className="fixed top-20 right-4 z-20 w-80 max-w-[calc(100vw-2rem)] hidden lg:block animate-slide-in-right">
        <LiveActivityFeed />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <AnimatedSection direction="fade" delay={0}>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                <span className="animate-gradient-text">
                  Whistle
                </span>
          </h1>
              <p className="text-2xl md:text-3xl font-light text-[#94A3B8] max-w-2xl mx-auto animate-fade-in">
                The truth has a price. Pay it anonymously.
              </p>
              <p className="text-xl md:text-2xl font-semibold text-[#F8FAFC] mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Expose truth. Claim rewards. Stay anonymous.
              </p>
            </div>
          </AnimatedSection>

          {/* Trust Signals */}
          <AnimatedSection direction="up" delay={200}>
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <Card className="bg-[#1E293B]/50 border-[#00FFB3]/20 px-4 py-2 hover:border-[#00FFB3]/40 hover:bg-[#1E293B]/70 transition-all hover-lift hover-glow">
                <span className="text-sm font-medium text-[#00FFB3]">Powered by Solana</span>
              </Card>
              <Card className="bg-[#1E293B]/50 border-[#00FFB3]/20 px-4 py-2 hover:border-[#00FFB3]/40 hover:bg-[#1E293B]/70 transition-all hover-lift hover-glow" style={{ animationDelay: '0.1s' }}>
                <span className="text-sm font-medium text-[#00FFB3]">End-to-end encrypted</span>
              </Card>
              <Card className="bg-[#1E293B]/50 border-[#00FFB3]/20 px-4 py-2 hover:border-[#00FFB3]/40 hover:bg-[#1E293B]/70 transition-all hover-lift hover-glow" style={{ animationDelay: '0.2s' }}>
                <span className="text-sm font-medium text-[#00FFB3]">No seed phrases required</span>
              </Card>
              <Card className="bg-[#1E293B]/50 border-[#00FFB3]/20 px-4 py-2 hover:border-[#00FFB3]/40 hover:bg-[#1E293B]/70 transition-all hover-lift hover-glow" style={{ animationDelay: '0.3s' }}>
                <span className="text-sm font-medium text-[#00FFB3]">100% self-custodial</span>
              </Card>
            </div>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection direction="up" delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button
                asChild
                size="lg"
                className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3] text-lg px-8 py-6 font-semibold hover-lift hover-glow transition-all"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#00FFB3] text-[#00FFB3] hover:bg-[#00FFB3]/10 text-lg px-8 py-6 font-semibold hover-lift transition-all"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <AnimatedSection direction="up" delay={600}>
            <div className="grid md:grid-cols-3 gap-6 mt-20">
              <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-3 hover:border-[#00FFB3]/50 hover:bg-[#1E293B]/50 transition-all duration-300 hover-lift hover-glow group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🔒</div>
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Anonymous Submissions</h3>
                <p className="text-[#94A3B8] leading-relaxed">
                  Submit tips and evidence completely anonymously. Your identity stays protected.
                </p>
              </Card>
              <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-3 hover:border-[#00FFB3]/50 hover:bg-[#1E293B]/50 transition-all duration-300 hover-lift hover-glow group" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">💰</div>
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Cryptocurrency Bounties</h3>
                <p className="text-[#94A3B8] leading-relaxed">
                  Create bounties with SOL or USDC. Rewards are paid instantly upon verification.
                </p>
              </Card>
              <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-3 hover:border-[#00FFB3]/50 hover:bg-[#1E293B]/50 transition-all duration-300 hover-lift hover-glow group" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Password-Only Wallets</h3>
                <p className="text-[#94A3B8] leading-relaxed">
                  No browser extensions or seed phrases. Just email and password. Fully self-custodial.
                </p>
              </Card>
            </div>
          </AnimatedSection>

          {/* How It Works */}
          <AnimatedSection direction="up" delay={800}>
            <div className="mt-20 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold animate-gradient-text">How It Works</h2>
                <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
                  A simple, secure process for anonymous whistleblowing and bounty rewards
                </p>
              </div>

              {/* Step-by-Step Process */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-4 hover:border-[#00FFB3]/50 hover:bg-[#1E293B]/50 transition-all duration-300 hover-lift hover-glow group">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#00FFB3] text-[#0F172A] flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform duration-300 hover-glow animate-bounce-in">
                      1
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-lg text-[#F8FAFC]">Sign Up</h4>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      Create your account with just an email and password. No seed phrases, no browser extensions required.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#334155]">
                    <p className="text-xs text-[#64748B]">
                      ✓ Instant account creation<br />
                      ✓ No wallet setup needed<br />
                      ✓ Secure password-based auth
                    </p>
                  </div>
                </Card>

                <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-4 hover:border-[#00FFB3]/50 hover:bg-[#1E293B]/50 transition-all duration-300 hover-lift hover-glow group">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#00FFB3] text-[#0F172A] flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform duration-300 hover-glow animate-bounce-in" style={{ animationDelay: '0.1s' }}>
                      2
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-lg text-[#F8FAFC]">Get Wallet</h4>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      A real Solana wallet is automatically created for you. Fully self-custodial and encrypted with your password.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#334155]">
                    <p className="text-xs text-[#64748B]">
                      ✓ Real Solana wallet<br />
                      ✓ 100% self-custodial<br />
                      ✓ Password-encrypted keys
                    </p>
                  </div>
                </Card>

                <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-4 hover:border-[#00FFB3]/50 hover:bg-[#1E293B]/50 transition-all duration-300 hover-lift hover-glow group">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#00FFB3] text-[#0F172A] flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform duration-300 hover-glow animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                      3
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-lg text-[#F8FAFC]">Submit Tips</h4>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      Upload encrypted files and evidence anonymously. Your identity stays completely protected.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#334155]">
                    <p className="text-xs text-[#64748B]">
                      ✓ End-to-end encryption<br />
                      ✓ IPFS storage<br />
                      ✓ Complete anonymity
                    </p>
                  </div>
                </Card>

                <Card className="bg-[#1E293B]/30 border-[#334155] p-6 space-y-4 hover:border-[#00FFB3]/50 hover:bg-[#1E293B]/50 transition-all duration-300 hover-lift hover-glow group">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#00FFB3] text-[#0F172A] flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform duration-300 hover-glow animate-bounce-in" style={{ animationDelay: '0.3s' }}>
                      4
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-lg text-[#F8FAFC]">Claim Rewards</h4>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      When your tip is verified, rewards are automatically sent to your wallet in SOL or USDC.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#334155]">
                    <p className="text-xs text-[#64748B]">
                      ✓ Instant payments<br />
                      ✓ SOL or USDC rewards<br />
                      ✓ On-chain verification
                    </p>
                  </div>
                </Card>
              </div>

              {/* Detailed Process Flow */}
              <div className="mt-16 space-y-8">
                <h3 className="text-2xl font-bold text-center text-[#F8FAFC]">The Complete Process</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* For Bounty Creators */}
                  <Card className="bg-[#1E293B]/40 border-[#334155] p-6 space-y-4 hover:border-[#00FFB3]/30 transition-all hover-lift">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#00FFB3]/20 flex items-center justify-center">
                        <span className="text-[#00FFB3] text-xl">💰</span>
                      </div>
                      <h4 className="text-xl font-semibold text-[#F8FAFC]">For Bounty Creators</h4>
                    </div>
                    <ol className="space-y-3 text-sm text-[#94A3B8]">
                      <li className="flex gap-3">
                        <span className="text-[#00FFB3] font-bold">1.</span>
                        <span>Create a bounty with a title, description, and reward amount (SOL or USDC)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#00FFB3] font-bold">2.</span>
                        <span>Fund the bounty by transferring cryptocurrency to the escrow account</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#00FFB3] font-bold">3.</span>
                        <span>Review anonymous tips submitted by whistleblowers</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#00FFB3] font-bold">4.</span>
                        <span>Approve the best tip and payment is automatically sent to the tipper</span>
                      </li>
                    </ol>
                  </Card>

                  {/* For Whistleblowers */}
                  <Card className="bg-[#1E293B]/40 border-[#334155] p-6 space-y-4 hover:border-[#00FFB3]/30 transition-all hover-lift">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#06B6D4]/20 flex items-center justify-center">
                        <span className="text-[#06B6D4] text-xl">🔒</span>
                      </div>
                      <h4 className="text-xl font-semibold text-[#F8FAFC]">For Whistleblowers</h4>
                    </div>
                    <ol className="space-y-3 text-sm text-[#94A3B8]">
                      <li className="flex gap-3">
                        <span className="text-[#06B6D4] font-bold">1.</span>
                        <span>Browse open bounties and find one relevant to your evidence</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#06B6D4] font-bold">2.</span>
                        <span>Upload encrypted files (documents, images, videos) with a description</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#06B6D4] font-bold">3.</span>
                        <span>Your tip is stored on IPFS and linked anonymously to the bounty</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#06B6D4] font-bold">4.</span>
                        <span>If approved, receive the reward directly to your wallet</span>
                      </li>
                    </ol>
                  </Card>
                </div>

                {/* Security Features */}
                <Card className="bg-[#0F172A]/50 border-[#334155] p-8 mt-8">
                  <h4 className="text-xl font-semibold text-[#F8FAFC] mb-6 text-center">Security & Privacy Features</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center space-y-2">
                      <div className="text-3xl mb-2">🔐</div>
                      <h5 className="font-semibold text-[#F8FAFC]">End-to-End Encryption</h5>
                      <p className="text-xs text-[#94A3B8]">
                        All files are encrypted before upload. Only the bounty creator can decrypt approved tips.
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-3xl mb-2">🌐</div>
                      <h5 className="font-semibold text-[#F8FAFC]">IPFS Storage</h5>
                      <p className="text-xs text-[#94A3B8]">
                        Files are stored on decentralized IPFS network, ensuring permanent, censorship-resistant storage.
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-3xl mb-2">🛡️</div>
                      <h5 className="font-semibold text-[#F8FAFC]">Complete Anonymity</h5>
                      <p className="text-xs text-[#94A3B8]">
                        Your identity is never revealed. Tips are linked only by wallet addresses, which remain private.
          </p>
        </div>
                  </div>
                </Card>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
