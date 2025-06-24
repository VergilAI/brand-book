'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when scrolling up or at top of page
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } 
      // Hide navbar when scrolling down (after scrolling past 100px)
      else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false)
        setIsOpen(false) // Close mobile menu when hiding
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      {/* Desktop Navigation Pill */}
      <nav className={cn(
        "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        className
      )}>
        <div className="bg-pure-light/90 backdrop-blur-xl rounded-full border border-mist-gray/30 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3">
          <div className="flex items-center justify-between gap-6">
            {/* Logo + Brand Name */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-6 h-6 transition-transform group-hover:scale-105">
                <Image
                  src="/logos/vergil-mark.svg"
                  alt="Vergil Logo"
                  width={24}
                  height={24}
                  className="w-full h-full"
                  style={{ filter: 'brightness(0.12) sepia(1) saturate(0)' }} // Makes it #1d1d1d
                />
              </div>
              <span className="font-display text-lg font-bold tracking-tight" style={{ color: '#1d1d1d' }}>
                Vergil Learn
              </span>
            </Link>

            {/* CTA Button */}
            <Link href="/contact">
              <Button 
                size="sm" 
                className="bg-cosmic-purple hover:bg-electric-violet text-pure-light rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                Book Demo
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="bg-pure-light/95 backdrop-blur-lg border-b border-mist-gray/30">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo + Brand Name */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-7 h-7">
                <Image
                  src="/logos/vergil-mark.svg"
                  alt="Vergil Logo"
                  width={28}
                  height={28}
                  className="w-full h-full"
                  style={{ filter: 'brightness(0.12) sepia(1) saturate(0)' }} // Makes it #1d1d1d
                />
              </div>
              <span className="font-display text-lg font-bold" style={{ color: '#1d1d1d' }}>
                Vergil Learn
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 rounded-full hover:bg-mist-gray/20 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-deep-space" />
              ) : (
                <Menu className="w-5 h-5 text-deep-space" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <div className="border-t border-mist-gray/30 bg-pure-light/98 backdrop-blur-xl">
              <div className="px-6 py-6">
                <Link href="/contact" className="block w-full">
                  <Button 
                    size="sm" 
                    className="w-full bg-cosmic-purple hover:bg-electric-violet text-pure-light rounded-full py-3"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Demo
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}