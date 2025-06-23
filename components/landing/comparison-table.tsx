'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'

interface ComparisonItem {
  feature: string
  traditional: {
    status: 'negative' | 'neutral' | 'positive'
    text: string
  }
  modern: {
    status: 'negative' | 'neutral' | 'positive'
    text: string
  }
  vergil: {
    status: 'negative' | 'neutral' | 'positive'
    text: string
  }
}

function StatusIcon({ status }: { status: 'negative' | 'neutral' | 'positive' }) {
  switch (status) {
    case 'negative':
      return <X className="w-4 h-4 text-red-500" />
    case 'neutral':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    case 'positive':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />
    default:
      return null
  }
}

function ComparisonCard({ 
  title, 
  items, 
  highlight = false 
}: { 
  title: string
  items: ComparisonItem[]
  highlight?: boolean 
}) {
  return (
    <Card className={`relative ${highlight ? 'ring-2 ring-cosmic-purple shadow-lg' : ''}`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-cosmic-purple text-pure-light">
            <Sparkles className="w-3 h-3 mr-1" />
            Best Choice
          </Badge>
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className={highlight ? 'text-cosmic-purple' : ''}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const columnData = title === 'Traditional LMS' ? item.traditional :
                           title === 'Modern Solutions' ? item.modern :
                           item.vergil
          
          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-whisper-gray/50">
              <div className="mt-0.5">
                <StatusIcon status={columnData.status} />
              </div>
              <span className="text-sm">{columnData.text}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function ComparisonTable() {
  const comparisonData: ComparisonItem[] = [
    {
      feature: 'Content Handling',
      traditional: { status: 'negative', text: 'Static content only' },
      modern: { status: 'neutral', text: 'Video libraries with basic organization' },
      vergil: { status: 'positive', text: 'Living knowledge system that evolves' }
    },
    {
      feature: 'Personalization',
      traditional: { status: 'negative', text: 'One-size-fits-all approach' },
      modern: { status: 'neutral', text: 'Some adaptive features' },
      vergil: { status: 'positive', text: 'True AI personalization for each learner' }
    },
    {
      feature: 'Learning Tracking',
      traditional: { status: 'negative', text: 'Track completion only' },
      modern: { status: 'neutral', text: 'Basic progress tracking' },
      vergil: { status: 'positive', text: 'Track actual understanding and retention' }
    },
    {
      feature: 'Engagement',
      traditional: { status: 'negative', text: 'Boring, checkbox training' },
      modern: { status: 'neutral', text: 'Interactive videos and quizzes' },
      vergil: { status: 'positive', text: 'Gamified, adaptive learning experiences' }
    },
    {
      feature: 'Analytics',
      traditional: { status: 'negative', text: 'Basic completion reports' },
      modern: { status: 'neutral', text: 'Limited analytics dashboards' },
      vergil: { status: 'positive', text: 'Deep insights into skills and capabilities' }
    },
    {
      feature: 'Compliance',
      traditional: { status: 'negative', text: 'Manual reporting and tracking' },
      modern: { status: 'neutral', text: 'Separate compliance tools needed' },
      vergil: { status: 'positive', text: 'Integrated compliance with one-click reporting' }
    }
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold mb-4">
            Built Different. <span className="gradient-text">Built Better.</span>
          </h2>
          <p className="text-body-lg text-stone-gray max-w-3xl mx-auto">
            See how Vergil Learn compares to traditional LMS platforms and modern learning solutions.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ComparisonCard 
            title="Traditional LMS"
            items={comparisonData}
          />
          <ComparisonCard 
            title="Modern Solutions"
            items={comparisonData}
          />
          <ComparisonCard 
            title="Vergil Learn"
            items={comparisonData}
            highlight={true}
          />
        </div>
        
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-h2 font-semibold mb-4">
              Ready to experience the difference?
            </h3>
            <p className="text-body-lg text-stone-gray mb-6">
              Join the organizations already transforming their learning with Vergil intelligent platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}