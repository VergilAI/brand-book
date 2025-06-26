"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Palette,
  Type,
  Image,
  Sparkles,
  Zap,
  Code,
  MessageCircle,
  Search,
  Rocket,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { VergilLogo } from "@/components/vergil/vergil-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// Navigation data for Vergil Brand Book
const navigation = [
  {
    title: "Home",
    url: "/brand",
    icon: Home,
    description: "Brand book overview",
  },
  {
    title: "Brand Foundation",
    url: "/brand/brand/foundation",
    icon: Sparkles,
    description: "Mission, vision & values",
  },
  {
    title: "Voice & Tone",
    url: "/brand/brand/voice-tone",
    icon: MessageCircle,
    description: "Communication style",
  },
  {
    title: "Colors",
    url: "/brand/visual/colors",
    icon: Palette,
    description: "Brand color system",
  },
  {
    title: "Typography",
    url: "/brand/visual/typography",
    icon: Type,
    description: "Font system & scales",
  },
  {
    title: "Logo Guidelines",
    url: "/brand/visual/logo",
    icon: Image,
    description: "Logo usage & variants",
  },
  {
    title: "Radial Heatmap",
    url: "/brand/elements/heatmap",
    icon: Sparkles,
    description: "Living data visualization",
  },
  {
    title: "Graph Visualization",
    url: "/brand/elements/graph",
    icon: Zap,
    description: "Interactive network graphs",
  },
  {
    title: "Graph Constellation",
    url: "/brand/elements/graph-constellation",
    icon: Sparkles,
    description: "Premium graph visualization",
  },
  {
    title: "Motion System",
    url: "/brand/motion/breathing",
    icon: Sparkles,
    description: "Living animations",
  },
  {
    title: "Components",
    url: "/brand/components",
    icon: Code,
    description: "UI component library",
  },
]

export function VergilSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg consciousness-gradient text-sidebar-primary-foreground">
                  <VergilLogo variant="mark" size="sm" animated={true} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Vergil Brand Book</span>
                  <span className="truncate text-xs">Design System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url))
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                size="sm"
              >
                <Search className="h-4 w-4" />
                <span>Search docs...</span>
                <kbd className="ml-auto text-xs font-mono">⌘K</kbd>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}