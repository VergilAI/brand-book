'use client'

import { Section } from '@/components/landing/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Play, 
  Users, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react'

interface CTAOption {
  title: string
  description: string
  features: string[]
  cta: string
  icon: React.ReactNode
  variant: 'demo' | 'trial'
}

function CTACard({ option }: { option: CTAOption }) {
  const isDemo = option.variant === 'demo'
  
  return (
    <Card className={`h-full ${
      isDemo 
        ? 'ring-2 ring-cosmic-purple bg-gradient-to-br from-cosmic-purple/5 to-electric-violet/5' 
        : 'hover:shadow-lg'
    } transition-all duration-300`}>
      <CardContent className="p-8 h-full flex flex-col">
        <div className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center ${
          isDemo 
            ? 'bg-cosmic-purple text-pure-light' 
            : 'bg-phosphor-cyan/10 text-phosphor-cyan'
        }`}>
          {option.icon}
        </div>
        
        <h3 className="text-h2 font-bold mb-3">{option.title}</h3>
        <p className="text-body-lg text-stone-gray mb-6 flex-grow">
          {option.description}
        </p>
        
        <ul className="space-y-3 mb-8">
          {option.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-phosphor-cyan mt-0.5 flex-shrink-0" />
              <span className="text-body">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          size="lg" 
          className={`w-full group ${
            isDemo 
              ? 'bg-cosmic-purple hover:bg-electric-violet' 
              : 'bg-phosphor-cyan hover:bg-synaptic-blue text-deep-space'
          }`}
        >
          {option.cta}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  )
}

export function FinalCTA() {
  const ctaOptions: CTAOption[] = [
    {
      title: 'Book a Demo',
      description: 'See the full platform in action with a personalized walkthrough tailored to your organization\'s needs.',
      features: [
        'Live platform walkthrough',
        'Discuss your specific use cases',
        'Get personalized ROI analysis',
        'Meet your dedicated success team'
      ],
      cta: 'Schedule Demo',
      icon: <Calendar className="w-8 h-8" />,
      variant: 'demo'
    },
    {
      title: 'Start Free Pilot',
      description: 'Experience the transformation firsthand with full access to all features for your team.',
      features: [
        '50 users included free',
        'Full feature access',
        '14 days to explore',
        'No credit card required'
      ],
      cta: 'Start Free Pilot',
      icon: <Play className="w-8 h-8" />,
      variant: 'trial'
    }
  ]
  
  return (
    <Section className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Ready to Transform?
          </Badge>
          
          <h2 className="text-display-lg font-display font-bold mb-6">
            Ready to Transform How Your Organization <span className="gradient-text">Learns?</span>
          </h2>
          
          <p className="text-body-lg text-stone-gray max-w-3xl mx-auto mb-8">
            Join the growing number of forward-thinking organizations that are already 
            transforming their learning with Vergil's intelligent platform.
          </p>
          
          {/* Urgency Element */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-whisper-gray rounded-full mb-12">
            <Users className="w-5 h-5 text-cosmic-purple" />
            <span className="text-sm font-medium">
              Join <span className="text-cosmic-purple font-bold">50+ organizations</span> already transforming their learning
            </span>
          </div>
        </div>
        
        {/* CTA Options */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {ctaOptions.map((option) => (
            <CTACard key={option.variant} option={option} />
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-body text-stone-gray mb-6">Trusted by leading organizations worldwide</p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Logo placeholders - in real implementation, these would be actual client logos */}
            {[
              'Fortune 500 Tech',
              'Global Financial Services',
              'Healthcare Leader',
              'Manufacturing Corp',
              'Government Agency'
            ].map((company, index) => (
              <div 
                key={index} 
                className="px-4 py-2 bg-mist-gray/30 rounded-lg text-sm font-medium text-stone-gray"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}