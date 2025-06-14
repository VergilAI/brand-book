'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Search, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  title: string
  href: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    href: '/',
  },
  {
    title: 'Foundations',
    href: '/foundations',
    children: [
      { title: 'Colors', href: '/foundations/colors' },
      { title: 'Typography', href: '/foundations/typography' },
      { title: 'Spacing', href: '/foundations/spacing' },
      { title: 'Motion', href: '/foundations/motion' },
    ],
  },
  {
    title: 'Components',
    href: '/components',
    children: [
      { title: 'Button', href: '/components/button' },
      { title: 'Card', href: '/components/card' },
      { title: 'Neural Network', href: '/components/neural-network' },
    ],
  },
  {
    title: 'Patterns',
    href: '/patterns',
  },
  {
    title: 'AI Guide',
    href: '/ai-guide',
  },
]

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-4 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full vergil-gradient vergil-breathing" />
              <span className="font-semibold">Vergil Design System</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith(item.href) && item.href !== '/' 
                    ? "text-foreground font-medium" 
                    : "text-foreground/60"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button
                variant="outline"
                className="relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
              >
                <Search className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline-flex">Search documentation...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-background md:hidden">
          <nav className="container py-6">
            {navigation.map((item) => (
              <div key={item.href} className="mb-4">
                <Link
                  href={item.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-foreground/80",
                    pathname?.startsWith(item.href) && item.href !== '/' 
                      ? "text-foreground" 
                      : "text-foreground/60"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block text-sm transition-colors hover:text-foreground/80",
                          pathname === child.href 
                            ? "text-foreground font-medium" 
                            : "text-foreground/60"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="grid items-start gap-2">
              {navigation.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname?.startsWith(item.href) && item.href !== '/'
                        ? "bg-accent text-accent-foreground"
                        : "transparent"
                    )}
                  >
                    {item.title}
                  </Link>
                  {item.children && pathname?.startsWith(item.href) && (
                    <div className="ml-3 grid gap-1 pt-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === child.href
                              ? "bg-accent text-accent-foreground"
                              : "transparent text-muted-foreground"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="relative py-6 lg:gap-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}