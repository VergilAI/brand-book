'use client'

import { Section } from '@/components/landing/section'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  CloudUpload, 
  Network, 
  UserCheck, 
  BarChart3,
  ArrowRight,
  Play
} from 'lucide-react'

interface StepProps {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

function Step({ number, icon, title, description, color }: StepProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Step Number */}
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-cosmic-purple text-pure-light flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      
      {/* Icon Container */}
      <div 
        className={`w-24 h-24 rounded-2xl mb-6 flex items-center justify-center transition-transform hover:scale-110`}
        style={{ backgroundColor: `${color}20` }}
      >
        <div style={{ color }}>
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-h4 font-semibold mb-2">{title}</h3>
      <p className="text-body text-stone-gray">{description}</p>
    </div>
  )
}

export function HowItWorks({ onDemoClick }: { onDemoClick?: () => void }) {
  const steps = [
    {
      number: 1,
      icon: <CloudUpload className="w-10 h-10" />,
      title: "Upload",
      description: "Drag and drop your existing materials. Any format, any source.",
      color: "#6366F1"
    },
    {
      number: 2,
      icon: <Network className="w-10 h-10" />,
      title: "AI Structures",
      description: "Automatic knowledge mapping. Smart prerequisite detection.",
      color: "#A78BFA"
    },
    {
      number: 3,
      icon: <UserCheck className="w-10 h-10" />,
      title: "Employees Learn",
      description: "Personalized paths for each learner. Engaging, adaptive content.",
      color: "#10B981"
    },
    {
      number: 4,
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Track & Report",
      description: "Real-time insights. Export compliance reports instantly.",
      color: "#3B82F6"
    }
  ]

  return (
    <Section variant="muted" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold mb-4">
            From Content to Compliance in 
            <span className="gradient-text"> 4 Simple Steps</span>
          </h2>
        </div>
        
        {/* Steps Flow */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <Step {...step} />
                
                {/* Arrow between steps (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-8 z-10">
                    <ArrowRight className="w-6 h-6 text-mist-gray" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={onDemoClick}
            className="bg-cosmic-purple hover:bg-electric-violet group"
          >
            <Play className="mr-2 h-4 w-4" />
            See It In Action
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </Section>
  )
}