'use client'

import { Button } from '@/components/ui/button'
import { RadialHeatmap } from '@/components/vergil/radial-heatmap'
import { Play, ArrowRight } from 'lucide-react'

interface LearnHeroProps {
  onVideoClick?: () => void
}

export function LearnHero({ onVideoClick }: LearnHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* Content Container */}
      <div className="container relative mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 pl-8">
            {/* Main Headline */}
            <div className="space-y-5">
              <h1 className="text-7xl md:text-8xl font-display font-black bg-gradient-to-r from-cosmic-purple via-electric-violet to-luminous-indigo bg-clip-text text-transparent leading-none tracking-tight">
                PEOPLE
              </h1>
              
              {/* Gradient Separator Line */}
              <div className="w-64 h-2 bg-gradient-to-r from-cosmic-purple via-electric-violet to-luminous-indigo rounded-full"></div>
              
              <p className="text-lg md:text-xl font-display text-stone-gray leading-tight max-w-lg">
                Your greatest asset deserves the best training. Build courses in minutes, train for real impact.
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Button
                size="lg"
                className="bg-cosmic-purple hover:bg-electric-violet text-pure-light px-8 py-3 text-base font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Book a Demo
              </Button>
            </div>
          </div>

          {/* Right Side - Radial Heatmap */}
          <div className="flex justify-center items-center">
            <RadialHeatmap 
              showControls={false}
              autoStart={true}
              className="max-w-sm scale-75"
              title=""
              description=""
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}