import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NeuralNetwork } from "@/components/vergil/neural-network"
import Link from "next/link"
import { ArrowRight, Sparkles, Palette, Code2, Brain } from "lucide-react"

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-8">
        <div className="absolute inset-0 vergil-gradient opacity-10" />
        <div className="relative">
          <div className="mx-auto max-w-[64rem]">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Vergil Design System
              </h1>
              <p className="max-w-[42rem] leading-normal text-gray-600 sm:text-xl sm:leading-8">
                A living design system for AI orchestration platforms. Beautiful, 
                intelligent, and breathing with life.
              </p>
              <div className="flex gap-4">
                <Link href="/components/button">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/ai-guide">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neural Network Demo */}
      <section className="pb-16">
        <div className="mx-auto max-w-[64rem]">
          <NeuralNetwork />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="pb-16">
        <div className="mx-auto max-w-[64rem] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card variant="interactive">
            <CardHeader>
              <Palette className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Design Tokens</CardTitle>
              <CardDescription className="text-gray-600">
                Comprehensive color palettes, typography scales, and spacing systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/foundations/colors" className="text-sm text-purple-600 hover:underline">
                Explore foundations →
              </Link>
            </CardContent>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <Code2 className="h-8 w-8 text-violet-500 mb-2" />
              <CardTitle>Components</CardTitle>
              <CardDescription className="text-gray-600">
                Fully documented, accessible components with live examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/components" className="text-sm text-violet-500 hover:underline">
                Browse components →
              </Link>
            </CardContent>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <Brain className="h-8 w-8 text-indigo-500 mb-2" />
              <CardTitle>AI-Optimized</CardTitle>
              <CardDescription className="text-gray-600">
                Semantic HTML and comprehensive documentation for AI assistants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/ai-guide" className="text-sm text-indigo-500 hover:underline">
                Read AI guide →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Living System */}
      <section className="pb-16">
        <div className="mx-auto max-w-[64rem]">
          <Card variant="neural" className="overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">A Living System</CardTitle>
              <CardDescription className="text-base text-gray-600">
                Every element breathes, pulses, and responds. Experience design that feels alive.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4 pb-8">
              <div className="h-16 w-16 rounded-full bg-purple-600 vergil-breathing" />
              <div className="h-16 w-16 rounded-full bg-violet-500 vergil-breathing" style={{ animationDelay: '0.2s' }} />
              <div className="h-16 w-16 rounded-full bg-indigo-500 vergil-breathing" style={{ animationDelay: '0.4s' }} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}