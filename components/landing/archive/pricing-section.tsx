'use client'

import { Section } from '@/components/landing/section'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Star, Zap, Crown } from 'lucide-react'

interface PricingTier {
  name: string
  description: string
  price: string
  period: string
  features: string[]
  cta: string
  popular?: boolean
  icon: React.ReactNode
  gradient: string
}

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <Card className={`relative ${tier.popular ? 'ring-2 ring-cosmic-purple shadow-xl scale-105' : 'hover:shadow-lg'} transition-all duration-300`}>
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-cosmic-purple text-pure-light px-4 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-8">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${tier.gradient} flex items-center justify-center text-pure-light`}>
          {tier.icon}
        </div>
        
        <h3 className="text-h3 font-bold mb-2">{tier.name}</h3>
        <p className="text-body text-stone-gray mb-6">{tier.description}</p>
        
        <div className="mb-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold">{tier.price}</span>
            {tier.period && (
              <span className="text-stone-gray">{tier.period}</span>
            )}
          </div>
        </div>
        
        <Button 
          size="lg" 
          className={`w-full ${
            tier.popular 
              ? 'bg-cosmic-purple hover:bg-electric-violet' 
              : 'bg-stone-gray hover:bg-deep-space'
          }`}
        >
          {tier.cta}
        </Button>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-4">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-phosphor-cyan mt-0.5 flex-shrink-0" />
              <span className="text-body">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function PricingSection() {
  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      description: 'Perfect for growing teams ready to transform their learning',
      price: '$29',
      period: '/user/month',
      icon: <Zap className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-synaptic-blue to-phosphor-cyan',
      cta: 'Start Free Trial',
      features: [
        '50-200 employees',
        'All core learning features',
        'Basic analytics dashboard',
        'Email support',
        'Standard integrations',
        'Mobile learning app',
        'Progress tracking',
        'Completion certificates'
      ]
    },
    {
      name: 'Growth',
      description: 'Advanced features for scaling organizations',
      price: '$19',
      period: '/user/month',
      icon: <Star className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-cosmic-purple to-electric-violet',
      cta: 'Book Demo',
      popular: true,
      features: [
        '200-1000 employees',
        'Advanced AI personalization',
        'Team analytics & insights',
        'Priority support',
        'API access',
        'Custom branding',
        'Advanced reporting',
        'Skills mapping',
        'Learning paths automation',
        'Integration marketplace'
      ]
    },
    {
      name: 'Enterprise',
      description: 'Complete platform for large organizations',
      price: 'Custom',
      period: 'pricing',
      icon: <Crown className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-neural-pink to-luminous-indigo',
      cta: 'Contact Sales',
      features: [
        '1000+ employees',
        'Full platform access',
        'Dedicated Customer Success Manager',
        'Custom integrations',
        'Enterprise SLA & Security',
        'Advanced compliance features',
        'White-label options',
        'Custom AI model training',
        'Premium support',
        'Onsite training & setup'
      ]
    }
  ]

  return (
    <Section className="py-24" id="pricing">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold mb-4">
            Simple Pricing. <span className="gradient-text">Powerful Results.</span>
          </h2>
          <p className="text-body-lg text-stone-gray max-w-2xl mx-auto mb-8">
            Choose the plan that fits your organization's learning transformation needs.
          </p>
          
          {/* Note */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-whisper-gray rounded-full">
            <CheckCircle2 className="w-5 h-5 text-phosphor-cyan" />
            <span className="text-sm text-stone-gray">
              All plans include unlimited content upload and AI interactions
            </span>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
        
        {/* Bottom Section */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-h2 font-semibold mb-4">
              Not sure which plan is right for you?
            </h3>
            <p className="text-body-lg text-stone-gray mb-6">
              Our team can help you understand your learning transformation needs and 
              recommend the best approach for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                Schedule Consultation
              </Button>
              <Button size="lg" className="bg-cosmic-purple hover:bg-electric-violet">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}