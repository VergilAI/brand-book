'use client'

import { Section } from '@/components/landing/section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Lock, 
  Eye, 
  Key, 
  Users, 
  CheckCircle2,
  FileCheck,
  Zap
} from 'lucide-react'

interface SecurityFeature {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
}

function SecurityCard({ feature }: { feature: SecurityFeature }) {
  return (
    <Card className="relative h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cosmic-purple/10 flex items-center justify-center text-cosmic-purple">
          {feature.icon}
        </div>
        
        <h3 className="text-h4 font-semibold mb-2">{feature.title}</h3>
        
        {feature.badge && (
          <Badge variant="outline" className="mb-3">
            {feature.badge}
          </Badge>
        )}
        
        <p className="text-body text-stone-gray">{feature.description}</p>
      </CardContent>
    </Card>
  )
}

export function SecurityCompliance() {
  const securityFeatures: SecurityFeature[] = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'SOC 2 Type II Certified',
      badge: 'Certified',
      description: 'Rigorous security controls audited by independent third parties to ensure your data is protected.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'ISO 27001 Compliant',
      badge: 'Compliant',
      description: 'International standard for information security management systems, ensuring systematic data protection.'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'GDPR Ready',
      badge: 'Ready',
      description: 'Full compliance with European privacy regulations, including data portability and right to deletion.'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'End-to-end Encryption',
      description: 'All data encrypted in transit and at rest using AES-256 encryption with proper key management.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'SSO/SAML Support',
      description: 'Seamless integration with your existing identity providers for secure, single sign-on access.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Regular Penetration Testing',
      description: 'Quarterly security assessments by certified ethical hackers to identify and fix vulnerabilities.'
    }
  ]

  return (
    <Section variant="muted" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold mb-4">
            Enterprise-Grade Security <span className="gradient-text">You Can Trust</span>
          </h2>
          <p className="text-body-lg text-stone-gray max-w-3xl mx-auto">
            Your learning data and content are protected by the same security standards 
            used by financial institutions and healthcare organizations.
          </p>
        </div>
        
        {/* Security Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <SecurityCard key={index} feature={feature} />
          ))}
        </div>
        
        {/* Trust Statement */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-cosmic-purple/5 to-electric-violet/5 border-cosmic-purple/20">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Key className="w-6 h-6 text-cosmic-purple" />
                <h3 className="text-h3 font-semibold">Data Isolation Guarantee</h3>
              </div>
              <p className="text-body-lg text-stone-gray mb-6">
                Your content and data <strong>never train our models</strong>. 
                Full data isolation guaranteed with dedicated infrastructure for enterprise customers.
              </p>
              
              {/* Compliance Badges */}
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: 'SOC 2 Type II', verified: true },
                  { name: 'ISO 27001', verified: true },
                  { name: 'GDPR', verified: true },
                  { name: 'HIPAA', verified: true },
                  { name: 'CCPA', verified: true }
                ].map((compliance) => (
                  <div key={compliance.name} className="flex items-center gap-2 px-4 py-2 bg-pure-light rounded-full border border-mist-gray">
                    {compliance.verified && (
                      <CheckCircle2 className="w-4 h-4 text-phosphor-cyan" />
                    )}
                    <span className="text-sm font-medium">{compliance.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  )
}