'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/custom/Footer';
import AnimatedSection from '@/components/custom/AnimatedSection';

export default function DocsPage() {
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
            <Link href="/docs" className="text-sm text-[#F8FAFC] font-medium">
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
                  Documentation
                </span>
              </h1>
              <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
                Complete guide to using Whistle - the anonymous whistleblower bounty platform
              </p>
            </div>
          </AnimatedSection>

          {/* Table of Contents */}
          <AnimatedSection direction="up" delay={50}>
            <Card className="bg-[#1E293B]/50 border-[#334155] p-6 mb-12 hover-lift">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-[#94A3B8]">
              <li><a href="#getting-started" className="hover:text-[#00FFB3] transition-colors">1. Getting Started</a></li>
              <li><a href="#creating-account" className="hover:text-[#00FFB3] transition-colors">2. Creating Your Account</a></li>
              <li><a href="#wallet-setup" className="hover:text-[#00FFB3] transition-colors">3. Wallet Setup</a></li>
              <li><a href="#submitting-tips" className="hover:text-[#00FFB3] transition-colors">4. Submitting Tips</a></li>
              <li><a href="#creating-bounties" className="hover:text-[#00FFB3] transition-colors">5. Creating Bounties</a></li>
              <li><a href="#managing-bounties" className="hover:text-[#00FFB3] transition-colors">6. Managing Bounties</a></li>
              <li><a href="#security" className="hover:text-[#00FFB3] transition-colors">7. Security & Privacy</a></li>
              <li><a href="#api" className="hover:text-[#00FFB3] transition-colors">8. API Reference</a></li>
            </ul>
          </Card>
          </AnimatedSection>

          {/* Getting Started */}
          <AnimatedSection direction="up" delay={100}>
            <section id="getting-started" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">1. Getting Started</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                Whistle is an anonymous whistleblower bounty platform built on Solana. It allows users to create bounties, 
                submit anonymous tips with encrypted evidence, and claim rewards—all while maintaining complete anonymity.
              </p>
              <p>
                Unlike traditional platforms, Whistle uses password-only authentication with Zero Connector, eliminating 
                the need for browser extensions or seed phrases. Every user automatically receives a self-custodial Solana 
                wallet upon signup.
              </p>
              <Card className="bg-[#1E293B]/30 border-[#334155] p-4 mt-4">
                <p className="text-sm text-[#00FFB3] font-medium mb-2">Key Features:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Password-only authentication (no seed phrases)</li>
                  <li>Automatic Solana wallet creation</li>
                  <li>End-to-end encrypted file uploads</li>
                  <li>IPFS-based decentralized storage</li>
                  <li>SOL and USDC bounty support</li>
                  <li>100% self-custodial wallets</li>
                </ul>
              </Card>
            </div>
          </section>
          </AnimatedSection>

          {/* Creating Account */}
          <AnimatedSection direction="up" delay={200}>
            <section id="creating-account" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">2. Creating Your Account</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                Creating an account on Whistle is simple and secure. You only need an email address and a strong password.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Step 1: Sign Up</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Navigate to the <Link href="/signup" className="text-[#00FFB3] hover:underline">signup page</Link></li>
                  <li>Enter your email address</li>
                  <li>Choose a strong password (minimum 8 characters recommended)</li>
                  <li>Click "Create Account"</li>
                </ol>
                <Card className="bg-[#1E293B]/30 border-[#00FFB3]/20 p-4 mt-4">
                  <p className="text-sm text-[#00FFB3] font-medium mb-2">🔒 Security Note:</p>
                  <p className="text-sm">
                    Your password is used to encrypt your wallet's private key. If you lose your password, 
                    your wallet cannot be recovered. Store it securely.
                  </p>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Wallet Setup */}
          <AnimatedSection direction="up" delay={300}>
            <section id="wallet-setup" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">3. Wallet Setup</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                When you create an account, Whistle automatically generates a Solana wallet for you using Zero Connector. 
                This wallet is fully self-custodial and stored encrypted in our database.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Automatic Wallet Creation</h3>
                <p>
                  Your wallet is created instantly upon signup. You don't need to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Install browser extensions</li>
                  <li>Write down seed phrases</li>
                  <li>Manage private keys manually</li>
                </ul>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Viewing Your Wallet</h3>
                <p>
                  To view your wallet address and balance:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Navigate to your <Link href="/app/profile" className="text-[#00FFB3] hover:underline">Profile</Link> page</li>
                  <li>Your wallet address is displayed at the top</li>
                  <li>Your SOL balance is shown below</li>
                </ol>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 mt-4">
                  <p className="text-sm text-[#F8FAFC] font-medium mb-2">💡 Tip:</p>
                  <p className="text-sm">
                    You can receive SOL or USDC to your wallet address to fund bounties or receive rewards. 
                    The balance updates automatically.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* Submitting Tips */}
          <AnimatedSection direction="up" delay={400}>
            <section id="submitting-tips" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">4. Submitting Tips</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                Submitting an anonymous tip is straightforward. Your identity remains completely anonymous throughout the process.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">How to Submit a Tip</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Go to the <Link href="/app/submit" className="text-[#00FFB3] hover:underline">Submit Tip</Link> page</li>
                  <li>Select the bounty you want to submit evidence for</li>
                  <li>Upload your files (documents, images, videos, etc.)</li>
                  <li>Add an optional description</li>
                  <li>Click "Submit Tip"</li>
                </ol>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">File Encryption</h3>
                <p>
                  All files are automatically encrypted before being uploaded to IPFS. This ensures that:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Only the bounty creator can decrypt and view your files</li>
                  <li>Your files are stored on decentralized IPFS network</li>
                  <li>No one can access your files without the decryption key</li>
                </ul>
                <Card className="bg-[#1E293B]/30 border-[#00FFB3]/20 p-4 mt-4">
                  <p className="text-sm text-[#00FFB3] font-medium mb-2">🔐 Privacy Guarantee:</p>
                  <p className="text-sm">
                    Your wallet address is anonymized when tips are displayed to bounty creators. 
                    They only see a shortened version (e.g., "5Gv8...3Hx2").
                  </p>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Creating Bounties */}
          <AnimatedSection direction="up" delay={500}>
            <section id="creating-bounties" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">5. Creating Bounties</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                Bounty creators can offer rewards in SOL or USDC to incentivize whistleblowers to submit evidence.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Creating a New Bounty</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Navigate to <Link href="/app/bounties/create" className="text-[#00FFB3] hover:underline">Create Bounty</Link></li>
                  <li>Enter a clear title for your bounty</li>
                  <li>Write a detailed description of what evidence you're seeking</li>
                  <li>Set the reward amount (in SOL or USDC)</li>
                  <li>Optionally upload reference documents</li>
                  <li>Click "Create Bounty"</li>
                </ol>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Funding Your Bounty</h3>
                <p>
                  After creating a bounty, you need to fund it with the reward amount. The funds are held in escrow 
                  until you approve a winning tip.
                </p>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 mt-4">
                  <p className="text-sm text-[#F8FAFC] font-medium mb-2">💰 Payment Methods:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>SOL:</strong> Native Solana token</li>
                    <li><strong>USDC:</strong> USD Coin on Solana</li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Managing Bounties */}
          <AnimatedSection direction="up" delay={600}>
            <section id="managing-bounties" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">6. Managing Bounties</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                As a bounty creator, you can manage all your bounties from the "My Bounties" dashboard.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Viewing Submitted Tips</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Go to <Link href="/app/my-bounties" className="text-[#00FFB3] hover:underline">My Bounties</Link></li>
                  <li>Click "Manage" on any bounty</li>
                  <li>View all submitted tips with their IPFS links</li>
                  <li>Download and review encrypted files</li>
                </ol>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Approving and Paying Tips</h3>
                <p>
                  When you find a tip that provides the evidence you need:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Click "Approve & Pay" on the tip</li>
                  <li>Choose to pay the tipper's wallet or an external wallet</li>
                  <li>Enter your password to sign the transaction</li>
                  <li>The payment is sent automatically via on-chain transaction</li>
                </ol>
                <Card className="bg-[#1E293B]/30 border-[#00FFB3]/20 p-4 mt-4">
                  <p className="text-sm text-[#00FFB3] font-medium mb-2">⚡ Instant Payments:</p>
                  <p className="text-sm">
                    Payments are processed immediately via Solana blockchain. Transaction signatures are stored 
                    and can be verified on Solscan.
                  </p>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* Security */}
          <AnimatedSection direction="up" delay={700}>
            <section id="security" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">7. Security & Privacy</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                Whistle is built with security and privacy as top priorities. Here's how we protect you:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">🔒 End-to-End Encryption</h4>
                  <p className="text-sm">All files are encrypted before upload using AES-256 encryption.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">🛡️ Self-Custodial Wallets</h4>
                  <p className="text-sm">You control your private keys. We never have access to your funds.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">🌐 IPFS Storage</h4>
                  <p className="text-sm">Files are stored on decentralized IPFS network, not centralized servers.</p>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 hover-lift hover-glow transition-all duration-300">
                  <h4 className="font-semibold text-[#F8FAFC] mb-2">👤 Anonymity</h4>
                  <p className="text-sm">Wallet addresses are anonymized. No personal information is required.</p>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* API Reference */}
          <AnimatedSection direction="up" delay={800}>
            <section id="api" className="mb-16 scroll-mt-20">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6">8. API Reference</h2>
            <div className="space-y-6 text-[#94A3B8] leading-relaxed">
              <p>
                Whistle provides RESTful API endpoints for developers who want to integrate with the platform.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Authentication</h3>
                <p>All API requests require authentication via session cookies.</p>
                <Card className="bg-[#0F172A] border-[#334155] p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-[#00FFB3]">POST</code> <span className="text-[#94A3B8]">/api/auth/signup</span><br/>
                  <code className="text-[#00FFB3]">POST</code> <span className="text-[#94A3B8]">/api/auth/login</span><br/>
                  <code className="text-[#00FFB3]">GET</code> <span className="text-[#94A3B8]">/api/auth/me</span>
                </Card>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Bounties</h3>
                <Card className="bg-[#0F172A] border-[#334155] p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-[#00FFB3]">GET</code> <span className="text-[#94A3B8]">/api/bounties</span><br/>
                  <code className="text-[#00FFB3]">POST</code> <span className="text-[#94A3B8]">/api/bounties</span><br/>
                  <code className="text-[#00FFB3]">GET</code> <span className="text-[#94A3B8]">/api/bounties/my</span>
                </Card>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mt-6">Tips</h3>
                <Card className="bg-[#0F172A] border-[#334155] p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-[#00FFB3]">POST</code> <span className="text-[#94A3B8]">/api/tips/submit</span><br/>
                  <code className="text-[#00FFB3]">GET</code> <span className="text-[#94A3B8]">/api/bounties/[id]/tips</span>
                </Card>
                <Card className="bg-[#1E293B]/30 border-[#334155] p-4 mt-4">
                  <p className="text-sm text-[#F8FAFC] font-medium mb-2">📚 Full API Documentation:</p>
                  <p className="text-sm">
                    For complete API documentation with request/response examples, visit our{' '}
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#00FFB3] hover:underline"
                    >
                      GitHub repository
                    </a>.
                  </p>
                </Card>
              </div>
            </div>
          </section>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection direction="fade" delay={900}>
            <div className="text-center mt-16">
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
