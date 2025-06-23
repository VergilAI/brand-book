'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface FooterSection {
  title: string
  links: {
    label: string
    href: string
  }[]
}

interface ComplianceItem {
  name: string
  href?: string
}

export function LearnFooter() {
  const footerSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Integrations', href: '#integrations' },
        { label: 'Security', href: '#security' },
        { label: 'Roadmap', href: '#roadmap' }
      ]
    },
    {
      title: 'Use Cases',
      links: [
        { label: 'Onboarding', href: '#onboarding' },
        { label: 'Compliance', href: '#compliance' },
        { label: 'Upskilling', href: '#upskilling' },
        { label: 'Sales Training', href: '#sales-training' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'Best Practices', href: '#best-practices' },
        { label: 'Webinars', href: '#webinars' },
        { label: 'API Docs', href: '#api' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Vergil', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Blog', href: '#blog' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  ]
  
  const complianceItems: ComplianceItem[] = [
    { name: 'SOC 2', href: '#soc2' },
    { name: 'ISO 27001', href: '#iso27001' }
  ]
  
  return (
    <footer className="bg-deep-space text-pure-light">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-consciousness-gradient rounded-lg" />
              <span className="font-display text-xl font-bold">Vergil Learn</span>
            </div>
            <p className="text-stone-gray max-w-sm mb-6">
              Transform your organization's knowledge into measurable intelligence 
              with AI-powered learning experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { name: 'LinkedIn', href: '#' },
                { name: 'Twitter', href: '#' },
                { name: 'YouTube', href: '#' }
              ].map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-stone-gray hover:text-pure-light transition-colors"
                >
                  {social.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-stone-gray hover:text-pure-light transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="bg-stone-gray/20 mb-8" />
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright and Legal */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-stone-gray">
            <span>&copy; 2024 Vergil Learn. All rights reserved.</span>
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
                className="border-stone-gray/30 text-stone-gray hover:border-pure-light hover:text-pure-light transition-colors"
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