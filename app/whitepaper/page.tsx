'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/custom/Footer';
import AnimatedSection from '@/components/custom/AnimatedSection';

export default function WhitepaperPage() {
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
            <Link href="/whitepaper" className="text-sm text-[#F8FAFC] font-medium">
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
                  Whistle Whitepaper
                </span>
              </h1>
              <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
                Technical documentation and vision for the future of anonymous whistleblowing
              </p>
              <p className="text-sm text-[#94A3B8]">Version 1.0 • Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
          </AnimatedSection>

          {/* Table of Contents */}
          <AnimatedSection direction="up" delay={50}>
            <Card className="bg-[#1E293B]/50 border-[#334155] p-6 mb-12 hover-lift">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-[#94A3B8]">
              <li><a href="#introduction" className="hover:text-[#00FFB3] transition-colors">1. Introduction</a></li>
              <li><a href="#problem" className="hover:text-[#00FFB3] transition-colors">2. The Problem</a></li>
              <li><a href="#solution" className="hover:text-[#00FFB3] transition-colors">3. Our Solution</a></li>
              <li><a href="#technology" className="hover:text-[#00FFB3] transition-colors">4. Technology</a></li>
              <li><a href="#tokenomics" className="hover:text-[#00FFB3] transition-colors">5. Tokenomics</a></li>
              <li><a href="#security" className="hover:text-[#00FFB3] transition-colors">6. Security & Privacy</a></li>
              <li><a href="#roadmap" className="hover:text-[#00FFB3] transition-colors">7. Roadmap</a></li>
            </ul>
          </Card>
          </AnimatedSection>

          {/* Introduction */}
          <AnimatedSection direction="up" delay={100}>
            <section id="introduction" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">1. Introduction</h2>
            <div className="space-y-4 text-[#94A3B8] leading-relaxed">
              <p>
                Whistle is the world's first anonymous whistleblower bounty platform built on Solana blockchain. 
                Our mission is to create a secure, decentralized platform where truth-seekers can expose wrongdoing 
                while being fairly compensated for their contributions.
              </p>
              <p>
                Traditional whistleblowing platforms face numerous challenges: lack of anonymity, centralized control, 
                and insufficient incentives. Whistle addresses these issues by leveraging blockchain technology, 
                end-to-end encryption, and cryptocurrency rewards.
              </p>
              <Card className="bg-[#1E293B]/30 border-[#00FFB3]/20 p-4 mt-4">
                <p className="text-sm text-[#00FFB3] font-medium mb-2">Our Vision:</p>
                <p className="text-sm">
                  To create a global platform where anyone can safely expose truth, receive fair compensation, 
                  and contribute to a more transparent world—all while maintaining complete anonymity.
                </p>
              </Card>
            </div>
          </section>
          </AnimatedSection>

          {/* The Problem */}
          <AnimatedSection direction="up" delay={200}>
            <section id="problem" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">2. The Problem</h2>
            <div className="space-y-4 text-[#94A3B8] leading-relaxed">
              <p>
                Current whistleblowing mechanisms suffer from several critical flaws:
              </p>
              <div className="space-y-3">
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">🔴 Lack of Anonymity</h4>
                  <p className="text-sm">Traditional platforms can be compromised, exposing whistleblowers to retaliation.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">🔴 Centralized Control</h4>
                  <p className="text-sm">Single points of failure and potential censorship by authorities or corporations.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">🔴 Insufficient Incentives</h4>
                  <p className="text-sm">Whistleblowers often face financial hardship with little to no compensation.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">🔴 Technical Barriers</h4>
                  <p className="text-sm">Complex wallet management and blockchain knowledge requirements exclude many potential users.</p>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Solution */}
          <AnimatedSection direction="up" delay={300}>
            <section id="solution" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">3. Our Solution</h2>
            <div className="space-y-4 text-[#94A3B8] leading-relaxed">
              <p>
                Whistle solves these problems through a combination of blockchain technology, encryption, and user-friendly design:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">✅ True Anonymity</h4>
                  <p className="text-sm">End-to-end encryption and IPFS storage ensure complete privacy.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">✅ Decentralized</h4>
                  <p className="text-sm">Built on Solana blockchain with no single point of control.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">✅ Fair Compensation</h4>
                  <p className="text-sm">Cryptocurrency rewards paid instantly via smart contracts.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">✅ Easy to Use</h4>
                  <p className="text-sm">Password-only authentication—no seed phrases or browser extensions.</p>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Technology */}
          <AnimatedSection direction="up" delay={400}>
            <section id="technology" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">4. Technology</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Blockchain Infrastructure</h3>
                <p>
                  Whistle is built on Solana, chosen for its high throughput, low transaction costs, and fast finality. 
                  This enables instant payments and low fees, making micro-bounties economically viable.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Transaction Speed:</strong> ~400ms finality</li>
                  <li><strong>Transaction Cost:</strong> ~$0.00025 per transaction</li>
                  <li><strong>Throughput:</strong> 65,000+ transactions per second</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Zero Connector</h3>
                <p>
                  We use Zero Connector for password-based wallet management. This eliminates the need for:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Browser extensions (MetaMask, Phantom, etc.)</li>
                  <li>Seed phrase management</li>
                  <li>Manual private key handling</li>
                </ul>
                <p className="mt-2">
                  Wallets are encrypted with AES-256-GCM and stored in PostgreSQL. Users authenticate with 
                  email and password, making blockchain accessible to everyone.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">IPFS Storage</h3>
                <p>
                  All submitted files are encrypted and stored on IPFS (InterPlanetary File System), ensuring:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Decentralized storage (no single point of failure)</li>
                  <li>Content-addressed storage (immutable file references)</li>
                  <li>Resistance to censorship</li>
                  <li>Permanent availability</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Encryption</h3>
                <p>
                  Files are encrypted using AES-256 encryption before upload. Only the bounty creator can decrypt 
                  and view submitted evidence, ensuring complete privacy.
                </p>
              </div>
              <Card className="bg-[#1E293B]/30 border-[#334155] p-4 mt-4">
                <p className="text-sm text-[#F8FAFC] font-medium mb-2">🔧 Tech Stack:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Frontend:</strong> Next.js 15, TypeScript, Tailwind CSS</li>
                  <li><strong>Blockchain:</strong> Solana (Anchor 0.30+)</li>
                  <li><strong>Storage:</strong> IPFS via nft.storage</li>
                  <li><strong>Database:</strong> PostgreSQL (Supabase)</li>
                  <li><strong>Wallets:</strong> Zero Connector</li>
                </ul>
              </Card>
            </div>
          </section>
          </AnimatedSection>

          {/* Tokenomics */}
          <AnimatedSection direction="up" delay={500}>
            <section id="tokenomics" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">5. Tokenomics</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                The Whistle token (WHISTLE) will serve as the native utility token of the platform, enabling 
                various functions and providing governance rights.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Token Utility</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Bounty Payments:</strong> Creators can pay bounties in WHISTLE tokens</li>
                  <li><strong>Platform Fees:</strong> Reduced fees for WHISTLE token holders</li>
                  <li><strong>Governance:</strong> Token holders can vote on platform improvements</li>
                  <li><strong>Staking:</strong> Stake tokens to earn rewards and access premium features</li>
                  <li><strong>Discounts:</strong> Discounted fees for users holding WHISTLE tokens</li>
                </ul>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Distribution</h3>
                <p>
                  Token distribution details will be announced prior to launch. The allocation will include:
                </p>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 mt-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Public Sale</span>
                      <span className="text-[#00FFB3]">TBD</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Team & Advisors</span>
                      <span className="text-[#00FFB3]">TBD</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Platform Rewards</span>
                      <span className="text-[#00FFB3]">TBD</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Treasury</span>
                      <span className="text-[#00FFB3]">TBD</span>
                    </li>
                  </ul>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#00FFB3]/20 p-4 mt-4">
                  <p className="text-sm text-[#00FFB3] font-medium mb-2">🚀 Launch Information:</p>
                  <p className="text-sm">
                    The WHISTLE token will launch on Pump.fun. Stay tuned for the official launch date 
                    and token contract address.
                  </p>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Security */}
          <AnimatedSection direction="up" delay={600}>
            <section id="security" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">6. Security & Privacy</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                Security and privacy are fundamental to Whistle's design. We implement multiple layers of protection:
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Encryption</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>AES-256-GCM:</strong> Industry-standard encryption for wallet private keys</li>
                  <li><strong>File Encryption:</strong> All uploaded files encrypted before IPFS storage</li>
                  <li><strong>Password Hashing:</strong> Scrypt-based password hashing with salt</li>
                </ul>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Anonymity</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Wallet addresses anonymized in tip displays</li>
                  <li>No personal information required for signup</li>
                  <li>IPFS storage prevents file tracking</li>
                  <li>No connection between email and wallet address</li>
                </ul>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Self-Custody</h3>
                <p>
                  Users maintain full control of their wallets. Private keys are encrypted and stored securely, 
                  but only the user's password can decrypt them. We cannot access user funds.
                </p>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Smart Contract Security</h3>
                <p>
                  Our Solana programs will undergo comprehensive security audits before mainnet deployment. 
                  All smart contracts will be open-source and verifiable.
                </p>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Roadmap */}
          <AnimatedSection direction="up" delay={700}>
            <section id="roadmap" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">7. Roadmap</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <div className="space-y-4">
                <Card className="bg-[#1E293B]/30 border-[#00FFB3]/20 p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#00FFB3] text-[#0F172A] flex items-center justify-center font-bold flex-shrink-0">
                      Q1
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#F8FAFC] mb-2">Phase 1: MVP Launch</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Core platform functionality</li>
                        <li>Password-based wallet creation</li>
                        <li>Bounty creation and tip submission</li>
                        <li>SOL and USDC payments</li>
                      </ul>
                    </div>
                  </div>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#334155] text-[#F8FAFC] flex items-center justify-center font-bold flex-shrink-0">
                      Q2
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#F8FAFC] mb-2">Phase 2: Token Launch</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>WHISTLE token launch on Pump.fun</li>
                        <li>Token integration into platform</li>
                        <li>Staking mechanism</li>
                        <li>Governance voting</li>
                      </ul>
                    </div>
                  </div>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#334155] text-[#F8FAFC] flex items-center justify-center font-bold flex-shrink-0">
                      Q3
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#F8FAFC] mb-2">Phase 3: Advanced Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Multi-signature bounty escrows</li>
                        <li>Reputation system</li>
                        <li>Mobile app</li>
                        <li>API for third-party integrations</li>
                      </ul>
                    </div>
                  </div>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#334155] text-[#F8FAFC] flex items-center justify-center font-bold flex-shrink-0">
                      Q4
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#F8FAFC] mb-2">Phase 4: Expansion</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Multi-chain support</li>
                        <li>International compliance</li>
                        <li>Enterprise solutions</li>
                        <li>Decentralized governance</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Conclusion */}
          <AnimatedSection direction="fade" delay={800}>
            <Card className="bg-[#1E293B]/50 border-[#00FFB3]/20 p-8 mb-12 hover-glow">
              <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">Conclusion</h2>
              <p className="text-[#94A3B8] leading-relaxed">
                Whistle represents a new paradigm in whistleblowing—combining blockchain technology, 
                strong encryption, and user-friendly design to create a platform where truth can be exposed 
                safely and fairly. We believe that by removing barriers and providing proper incentives, 
                we can help create a more transparent world.
              </p>
            </Card>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection direction="fade" delay={900}>
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-[#00FFB3] text-[#0F172A] hover:bg-[#00E6A3] text-lg px-8 py-6 font-semibold hover-lift hover-glow"
              >
                <Link href="/signup">Join Whistle</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}
