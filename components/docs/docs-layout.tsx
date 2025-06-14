'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Search, Menu, X, ChevronRight, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VergilLogo } from '@/components/vergil/vergil-logo'

interface NavItem {
  title: string
  href: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Brand Foundation',
    href: '/brand',
    children: [
      { title: 'Mission & Vision', href: '/brand/foundation' },
      { title: 'Brand Personality', href: '/brand/personality' },
      { title: 'Voice & Tone', href: '/brand/voice-tone' },
    ],
  },
  {
    title: 'Visual Identity',
    href: '/visual',
    children: [
      { title: 'Design Philosophy', href: '/visual/philosophy' },
      { title: 'Color System', href: '/visual/colors' },
      { title: 'Typography', href: '/visual/typography' },
      { title: 'Logo & Icons', href: '/visual/logo' },
    ],
  },
  {
    title: 'Design Elements',
    href: '/elements',
    children: [
      { title: 'Iris Pattern', href: '/elements/iris' },
      { title: 'Neural Networks', href: '/elements/neural' },
      { title: 'Cards & Surfaces', href: '/elements/cards' },
      { title: 'Buttons', href: '/elements/buttons' },
    ],
  },
  {
    title: 'Motion & Animation',
    href: '/motion',
    children: [
      { title: 'Animation Principles', href: '/motion/principles' },
      { title: 'Breathing Effects', href: '/motion/breathing' },
      { title: 'Interactions', href: '/motion/interactions' },
    ],
  },
  {
    title: 'Application Examples',
    href: '/examples',
    children: [
      { title: 'Website Components', href: '/examples/website' },
      { title: 'Dashboard UI', href: '/examples/dashboard' },
      { title: 'Marketing Materials', href: '/examples/marketing' },
    ],
  },
  {
    title: 'Guidelines',
    href: '/guidelines',
    children: [
      { title: 'Usage Guidelines', href: '/guidelines/usage' },
      { title: 'Digital Guidelines', href: '/guidelines/digital' },
      { title: 'Brand Protection', href: '/guidelines/protection' },
    ],
  },
]

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<string[]>([])

  // Auto-expand current section
  React.useEffect(() => {
    const currentSection = navigation.find(item => pathname?.startsWith(item.href) && item.href !== '/')
    if (currentSection && !expandedSections.includes(currentSection.href)) {
      setExpandedSections(prev => [...prev, currentSection.href])
    }
  }, [pathname, expandedSections])

  const toggleSection = (href: string) => {
    setExpandedSections(prev => 
      prev.includes(href) 
        ? prev.filter(section => section !== href)
        : [...prev, href]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 consciousness-gradient rounded-lg">
                <VergilLogo 
                  variant="mark" 
                  size="sm" 
                  animated={true}
                />
              </div>
              <span className="font-semibold text-lg gradient-text">Vergil Brand Book</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {/* Sidebar toggle for desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>

            <div className="w-full max-w-sm">
              <Button
                variant="outline"
                className="relative h-10 w-full justify-start rounded-lg bg-muted/50 text-sm font-normal text-muted-foreground shadow-none px-4"
              >
                <Search className="mr-3 h-4 w-4" />
                <span className="hidden sm:inline-flex">Search documentation...</span>
                <span className="inline-flex sm:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-3 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100 sm:flex">
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
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <nav className="container py-6 px-6">
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

      <div className={cn(
        "container flex-1 items-start transition-all duration-300",
        sidebarCollapsed 
          ? "md:grid md:grid-cols-[60px_minmax(0,1fr)] md:gap-8"
          : "md:grid md:grid-cols-[280px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12"
      )}>
        {/* Sidebar */}
        <aside className={cn(
          "fixed top-16 z-30 hidden h-[calc(100vh-4rem)] shrink-0 md:sticky md:block transition-all duration-300 border-r bg-gray-50/50",
          sidebarCollapsed ? "w-[60px]" : "w-full"
        )}>
          <div className="h-full py-8 pr-6">
            {sidebarCollapsed ? (
              // Collapsed sidebar - just icons
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname?.startsWith(item.href) && item.href !== '/'
                  const hasActiveChild = item.children?.some(child => pathname === child.href)
                  
                  return (
                    <div key={item.href} className="relative group">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                          isActive || hasActiveChild
                            ? "bg-cosmic-purple text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        )}
                        title={item.title}
                      >
                        <div className="w-2 h-2 rounded-full bg-current" />
                      </Link>
                      
                      {/* Tooltip */}
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    </div>
                  )
                })}
              </nav>
            ) : (
              // Full sidebar
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname?.startsWith(item.href) && item.href !== '/'
                  const hasActiveChild = item.children?.some(child => pathname === child.href)
                  const isExpanded = expandedSections.includes(item.href)
                  const shouldShowChildren = item.children && (isExpanded || isActive || hasActiveChild)
                  
                  return (
                    <div key={item.href} className="space-y-1">
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive || hasActiveChild
                              ? "bg-gradient-to-r from-cosmic-purple/10 to-electric-violet/10 text-cosmic-purple shadow-sm"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full mr-3 transition-colors",
                            isActive || hasActiveChild ? "bg-cosmic-purple" : "bg-gray-400"
                          )} />
                          {item.title}
                        </Link>
                        
                        {item.children && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 ml-1"
                            onClick={() => toggleSection(item.href)}
                          >
                            {shouldShowChildren ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                      
                      {shouldShowChildren && (
                        <div className="ml-5 space-y-1 border-l-2 border-gray-200 pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm transition-all duration-200",
                                pathname === child.href
                                  ? "bg-electric-violet/10 text-electric-violet font-medium"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              )}
                            >
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full mr-3 transition-colors",
                                pathname === child.href ? "bg-electric-violet" : "bg-gray-300"
                              )} />
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="relative py-8 px-6 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  )
}