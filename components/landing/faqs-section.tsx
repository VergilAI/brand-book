'use client'

import { useState } from 'react'
import { Section } from '@/components/landing/section'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQ {
  question: string
  answer: string
}

function FAQItem({ faq, isOpen, onToggle }: { 
  faq: FAQ
  isOpen: boolean
  onToggle: () => void 
}) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-whisper-gray/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-h4 font-semibold pr-4">{faq.question}</h3>
          <ChevronDown 
            className={cn(
              "w-5 h-5 text-stone-gray transition-transform duration-200 flex-shrink-0",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <CardContent className="px-6 pb-6 pt-0">
          <p className="text-body-lg text-stone-gray leading-relaxed">
            {faq.answer}
          </p>
        </CardContent>
      </div>
    </Card>
  )
}

export function FAQsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  
  const faqs: FAQ[] = [
    {
      question: "How fast can we deploy Vergil Learn?",
      answer: "Most organizations are fully running in under a week. You can upload your existing content today and have employees learning tomorrow. Our AI automatically structures and organizes your materials, so there's no need for time-consuming content recreation or reformatting."
    },
    {
      question: "What about our existing LMS?",
      answer: "We integrate seamlessly with major LMS platforms like Workday, Cornerstone, and SuccessFactors, or we can replace them entirely – your choice. Our migration tools help transfer existing user data and progress, ensuring a smooth transition without losing historical learning records."
    },
    {
      question: "How does the AI personalization actually work?",
      answer: "Our knowledge graphs track what each person already knows and map the optimal path to their learning goals. The AI analyzes learning patterns, comprehension levels, and knowledge gaps to deliver content that's perfectly timed and relevant. It's like having a personal tutor for every employee."
    },
    {
      question: "Can we white-label the platform?",
      answer: "Yes, Growth and Enterprise plans include custom branding options. You can add your logo, colors, and even custom domains. Enterprise customers get full white-label capabilities, making Vergil Learn appear as your own internal learning platform."
    },
    {
      question: "What file formats do you support?",
      answer: "We support virtually everything: PDFs, Word docs, PowerPoints, videos (MP4, MOV, AVI), audio files, SCORM packages, web links, YouTube videos, and even content from internal wikis and knowledge bases. Our AI can extract and structure learning content from any format."
    },
    {
      question: "How do you ensure data security?",
      answer: "We maintain SOC 2 Type II certification and ISO 27001 compliance. All data is encrypted end-to-end, and we undergo regular penetration testing. Most importantly, your content and data never train our models – we guarantee complete data isolation."
    },
    {
      question: "What's the difference between completion and comprehension tracking?",
      answer: "Traditional LMS platforms only track if someone clicked through content. We track actual understanding through adaptive assessments, knowledge retention tests, and real-world application scenarios. You'll know not just who completed training, but who truly learned the material."
    },
    {
      question: "Do you offer implementation support?",
      answer: "Absolutely. All plans include onboarding support, and Enterprise customers get a dedicated Customer Success Manager. We also provide change management resources, training for your L&D team, and ongoing optimization recommendations."
    }
  ]
  
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  
  return (
    <Section className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-body-lg text-stone-gray max-w-2xl mx-auto">
            Everything you need to know about transforming your organization's learning with Vergil.
          </p>
        </div>
        
        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
        
        {/* More Questions CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-h3 font-semibold mb-3">
              Still have questions?
            </h3>
            <p className="text-body-lg text-stone-gray mb-6">
              Our team is here to help you understand how Vergil Learn can transform your organization's learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" className="bg-cosmic-purple hover:bg-electric-violet">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}