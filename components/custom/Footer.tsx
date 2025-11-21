'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function Footer() {
  return (
    <footer className="border-t border-[#334155] bg-[#1E293B] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-[#00FFB3] hover:text-[#00E6A3] transition-colors">
              Whistle
            </Link>
            <p className="text-sm text-[#94A3B8] max-w-xs">
              The world's first anonymous whistleblower bounty platform on Solana. Expose truth. Claim rewards. Stay anonymous.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F8FAFC] uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/app/bounties" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors">
                  Browse Bounties
                </Link>
              </li>
              <li>
                <Link href="/app/submit" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors">
                  Submit Tip
                </Link>
              </li>
              <li>
                <Link href="/app/my-bounties" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors">
                  My Bounties
                </Link>
              </li>
              <li>
                <Link href="/app/profile" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F8FAFC] uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/token" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors inline-flex items-center gap-2">
                  Token
                  <Badge className="bg-[#00FFB3]/20 text-[#00FFB3] border-[#00FFB3]/30 text-xs px-2 py-0.5">
                    Coming Soon
                  </Badge>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F8FAFC] uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-[#94A3B8] hover:text-[#00FFB3] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="pt-4 space-y-3">
              <div>
                <p className="text-xs text-[#94A3B8] mb-2">Open Source</p>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00FFB3] hover:text-[#00E6A3] transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#334155] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#94A3B8]">
            © {new Date().getFullYear()} Whistle. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#94A3B8]">100% Self-Custodial</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

