'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IrisPattern } from '@/components/vergil/iris-pattern'
import { VergilLogo } from '@/components/vergil/vergil-logo'
import { ArrowLeft, Home, Construction } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <IrisPattern variant="cosmic" size="xl" />
        </div>
        
        <CardContent className="relative z-10 p-12 text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="p-4 consciousness-gradient rounded-xl">
              <VergilLogo variant="mark" size="lg" animated={true} />
            </div>
          </div>
          
          {/* 404 Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-6xl font-bold">
              <span className="gradient-text">4</span>
              <div className="animate-breathing">
                <IrisPattern variant="electric" size="sm" />
              </div>
              <span className="gradient-text">4</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Section Under Development
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              This part of our brand book is still being crafted with consciousness and precision. 
              Our neural networks are working on it.
            </p>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
            <Construction className="h-4 w-4" />
            <span className="font-medium">Coming Soon</span>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="default" className="gap-2">
              <Link href="/vergil-learn">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/contact">
                <ArrowLeft className="h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}