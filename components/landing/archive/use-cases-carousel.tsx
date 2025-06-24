'use client'

import { useState } from 'react'
import { Section } from '@/components/landing/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface UseCase {
  id: string
  companyType: string
  challenge: string
  result: string
  quote: string
  author: string
  metrics?: {
    label: string
    value: string
    color: string
  }[]
}

function UseCaseCard({ useCase, isActive }: { useCase: UseCase; isActive: boolean }) {
  return (
    <Card className={`transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'}`}>
      <CardContent className="p-8">
        <Badge variant="outline" className="mb-4">
          {useCase.companyType}
        </Badge>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-h4 font-semibold mb-2 text-stone-gray">Challenge</h4>
            <p className="text-body-lg">{useCase.challenge}</p>
          </div>
          
          <div>
            <h4 className="text-h4 font-semibold mb-2 text-phosphor-cyan">Result</h4>
            <p className="text-body-lg">{useCase.result}</p>
          </div>
          
          {/* Metrics */}
          {useCase.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {useCase.metrics.map((metric, i) => (
                <div key={i} className="text-center p-4 bg-whisper-gray rounded-lg">
                  <div className={`text-2xl font-bold mb-1`} style={{ color: metric.color }}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-stone-gray">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quote */}
          <blockquote className="relative p-6 bg-cosmic-purple/5 rounded-lg">
            <Quote className="absolute top-4 left-4 w-6 h-6 text-cosmic-purple/30" />
            <p className="text-h4 italic mb-3 ml-8">"{useCase.quote}"</p>
            <footer className="text-body text-stone-gray ml-8">
              — {useCase.author}
            </footer>
          </blockquote>
        </div>
      </CardContent>
    </Card>
  )
}

export function UseCasesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const useCases: UseCase[] = [
    {
      id: 'onboarding',
      companyType: 'Global Tech Company',
      challenge: '6-week onboarding process with low retention rates and inconsistent knowledge transfer.',
      result: 'Reduced onboarding to 10 days with 95% retention rate and standardized learning paths.',
      quote: 'New hires are productive 3x faster than before. Game-changing.',
      author: 'Head of People Operations',
      metrics: [
        { label: 'Onboarding Time', value: '10 days', color: '#6366F1' },
        { label: 'Retention Rate', value: '95%', color: '#10B981' },
        { label: 'Time to Productivity', value: '3x faster', color: '#3B82F6' }
      ]
    },
    {
      id: 'compliance',
      companyType: 'Financial Services',
      challenge: '2-year timeline to achieve ISO compliance with manual training processes.',
      result: 'Full compliance achieved in 8 weeks with automated training and reporting.',
      quote: 'We achieved compliance faster than we thought possible and saw a 70% reduction in security incidents.',
      author: 'Chief Compliance Officer',
      metrics: [
        { label: 'Compliance Time', value: '8 weeks', color: '#6366F1' },
        { label: 'Security Incidents', value: '-70%', color: '#10B981' },
        { label: 'Audit Success', value: '100%', color: '#3B82F6' }
      ]
    },
    {
      id: 'upskilling',
      companyType: 'Manufacturing Leader',
      challenge: 'Outdated workforce skills with no visibility into capabilities or training needs.',
      result: 'Complete skill mapping across 500+ employees with targeted upskilling programs.',
      quote: 'We identified 47 high-potential employees we never knew we had.',
      author: 'VP of Operations',
      metrics: [
        { label: 'Employees Mapped', value: '500+', color: '#6366F1' },
        { label: 'High-Potential ID\'d', value: '47', color: '#10B981' },
        { label: 'Skill Visibility', value: '100%', color: '#3B82F6' }
      ]
    },
    {
      id: 'sales',
      companyType: 'SaaS Company',
      challenge: 'Inconsistent product knowledge across sales team affecting deal velocity.',
      result: '100% sales team certification with measurable improvement in deal velocity.',
      quote: '32% increase in deal velocity and our ramp time for new reps dropped by half.',
      author: 'VP of Sales',
      metrics: [
        { label: 'Deal Velocity', value: '+32%', color: '#6366F1' },
        { label: 'Certification Rate', value: '100%', color: '#10B981' },
        { label: 'Ramp Time', value: '-50%', color: '#3B82F6' }
      ]
    }
  ]
  
  const nextCase = () => {
    setActiveIndex((prev) => (prev + 1) % useCases.length)
  }
  
  const prevCase = () => {
    setActiveIndex((prev) => (prev - 1 + useCases.length) % useCases.length)
  }
  
  return (
    <Section className="py-24" id="use-cases">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold mb-4">
            Success Stories Across <span className="gradient-text">Industries</span>
          </h2>
        </div>
        
        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevCase}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {useCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-cosmic-purple' : 'bg-mist-gray'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextCase}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Active Case */}
          <div className="relative min-h-[600px]">
            <UseCaseCard 
              useCase={useCases[activeIndex]} 
              isActive={true}
            />
          </div>
          
          {/* Case Titles */}
          <div className="flex justify-center mt-8 space-x-4">
            {useCases.map((useCase, index) => (
              <button
                key={useCase.id}
                onClick={() => setActiveIndex(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === activeIndex 
                    ? 'bg-cosmic-purple text-pure-light' 
                    : 'bg-whisper-gray text-stone-gray hover:bg-mist-gray'
                }`}
              >
                {useCase.companyType.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}