'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { VergilLogo } from '@/components/vergil/vergil-logo'

interface ComplianceItem {
  name: string
  href?: string
}

export function LearnFooter() {
  const complianceItems: ComplianceItem[] = [
    { name: 'SOC 2', href: '#soc2' },
    { name: 'ISO 27001', href: '#iso27001' }
  ]
  
  return (
    <footer className="bg-deep-space text-pure-light">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="mb-12 text-center">
          {/* Logo and Description */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <VergilLogo variant="mark" size="lg" />
              <span className="font-display text-2xl font-bold">Vergil Learn</span>
            </div>
            <p className="text-stone-gray text-lg max-w-lg mx-auto mb-6">
              Transform your organization's knowledge into measurable intelligence 
              with AI-powered learning experiences.
            </p>
            
            {/* LinkedIn Link */}
            <Link
              href="https://www.linkedin.com/company/103983727"
              className="text-stone-gray hover:text-pure-light transition-colors inline-flex items-center gap-2 text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Link>
          </div>
        </div>
        
        <Separator className="bg-stone-gray/20 mb-8" />
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright and Legal */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-base text-stone-gray">
            <span>&copy; 2025 Vergil Learn. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="#privacy" className="hover:text-pure-light transition-colors">
                Privacy Policy
              </Link>
              <Link href="#terms" className="hover:text-pure-light transition-colors">
                Terms of Service
              </Link>
              <Link href="#security" className="hover:text-pure-light transition-colors">
                Security
              </Link>
            </div>
          </div>
          
          {/* Compliance Badges */}
          <div className="flex items-center gap-3">
            {complianceItems.map((item) => (
              <Badge 
                key={item.name} 
                variant="outline" 
                className="border-stone-gray/30 text-stone-gray hover:border-pure-light hover:text-pure-light transition-colors text-base px-4 py-1"
              >
                {item.href ? (
                  <Link href={item.href}>{item.name}</Link>
                ) : (
                  item.name
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}