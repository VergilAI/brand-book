'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Section } from '@/components/landing/section'
import { 
  Upload, 
  LayoutDashboard, 
  Sparkles, 
  BarChart3, 
  Shield,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'
import Image from 'next/image'

interface PillarProps {
  number: number
  icon: React.ReactNode
  headline: string
  subheadline: string
  keyPoints: string[]
  visual?: React.ReactNode
  stats?: string
  testimonial?: {
    quote: string
    author: string
  }
  badge?: string
  reverse?: boolean
}

function Pillar({ 
  number, 
  icon, 
  headline, 
  subheadline, 
  keyPoints, 
  visual, 
  stats, 
  testimonial,
  badge,
  reverse = false 
}: PillarProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      {/* Content Side */}
      <div className={reverse ? 'lg:order-2' : ''}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-cosmic-purple/10 flex items-center justify-center text-cosmic-purple">
            {icon}
          </div>
          <Badge variant="secondary" className="text-xs">
            Pillar {number}
          </Badge>
        </div>
        
        <h3 className="text-h2 font-display font-bold mb-3">{headline}</h3>
        <p className="text-h4 text-stone-gray mb-6">{subheadline}</p>
        
        <ul className="space-y-3 mb-6">
          {keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-phosphor-cyan mt-0.5 flex-shrink-0" />
              <span className="text-body-lg">{point}</span>
            </li>
          ))}
        </ul>
        
        {stats && (
          <div className="p-4 bg-cosmic-purple/5 rounded-lg mb-6">
            <p className="text-h4 font-semibold text-cosmic-purple">{stats}</p>
          </div>
        )}
        
        {testimonial && (
          <blockquote className="border-l-4 border-cosmic-purple pl-4 italic text-stone-gray">
            "{testimonial.quote}"
            <footer className="text-sm mt-2 not-italic font-medium">
              — {testimonial.author}
            </footer>
          </blockquote>
        )}
        
        {badge && (
          <div className="mt-6 p-6 bg-whisper-gray rounded-lg">
            <p className="text-h4 font-semibold mb-2">Key Differentiator</p>
            <p className="text-body-lg text-stone-gray">{badge}</p>
          </div>
        )}
      </div>
      
      {/* Visual Side */}
      <div className={`relative ${reverse ? 'lg:order-1' : ''}`}>
        <Card className="p-8 bg-gradient-to-br from-pure-light to-whisper-gray border-mist-gray">
          {visual || (
            <div className="h-[400px] bg-mist-gray/30 rounded-lg flex items-center justify-center">
              <span className="text-stone-gray">Visual Placeholder</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export function FivePillars() {
  const pillars = [
    {
      number: 1,
      icon: <Upload className="w-6 h-6" />,
      headline: "Upload Anything. Teach Everything.",
      subheadline: "Universal Content Engine",
      keyPoints: [
        "Use existing training materials, PDFs, videos",
        "Import from YouTube, blogs, internal wikis",
        "Automatic content structuring and tagging",
        "No reformatting required"
      ],
      testimonial: {
        quote: "We uploaded 5 years of training materials in one afternoon",
        author: "Sarah, L&D Director"
      },
      visual: (
        <div className="h-[400px] relative">
          {/* Drag and Drop Visual */}
          <div className="absolute inset-0 border-2 border-dashed border-cosmic-purple/30 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-16 h-16 text-cosmic-purple/50 mx-auto mb-4" />
              <p className="text-stone-gray">Drag & Drop Any Content</p>
            </div>
          </div>
          
          {/* File Type Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {['PDF', 'Video', 'DOCX', 'Wiki'].map((type, index) => (
              <Badge key={type} variant="outline" className="animate-blob" style={{ animationDelay: `${index * 0.5}s` }}>
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )
    },
    {
      number: 2,
      icon: <LayoutDashboard className="w-6 h-6" />,
      headline: "Manage Learning Like Never Before",
      subheadline: "Complete LMS Command Center",
      keyPoints: [
        "Assign courses to individuals or teams",
        "Real-time progress tracking",
        "Automated reminders and scheduling",
        "Self-service learning paths"
      ],
      stats: "87% average completion rate vs 23% industry standard",
      visual: (
        <div className="h-[400px] bg-gradient-to-br from-pure-light to-whisper-gray rounded-lg p-6">
          {/* Dashboard Mock */}
          <div className="h-full flex flex-col gap-4">
            <div className="h-12 bg-pure-light rounded shadow-sm flex items-center px-4">
              <div className="text-sm font-medium">Team Overview</div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-pure-light rounded shadow-sm p-4">
                <div className="text-2xl font-bold text-cosmic-purple">87%</div>
                <div className="text-xs text-stone-gray">Completion Rate</div>
              </div>
              <div className="bg-pure-light rounded shadow-sm p-4">
                <div className="text-2xl font-bold text-phosphor-cyan">4.8</div>
                <div className="text-xs text-stone-gray">Avg Score</div>
              </div>
            </div>
            <div className="h-32 bg-pure-light rounded shadow-sm p-4">
              {/* Progress bars */}
              <div className="space-y-2">
                {[85, 92, 78, 95].map((value, i) => (
                  <div key={i} className="h-2 bg-mist-gray rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cosmic-purple transition-all duration-1000"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      reverse: true
    },
    {
      number: 3,
      icon: <Sparkles className="w-6 h-6" />,
      headline: "Every Learner Gets Their Perfect Path",
      subheadline: "AI-Powered Personalization",
      keyPoints: [
        "AI adapts to what you already know",
        "Optimal spacing for retention",
        "Skip what you've mastered",
        "Focus on what matters most"
      ],
      badge: "We don't just track completion. We track comprehension.",
      visual: (
        <div className="h-[400px] relative flex items-center justify-center">
          {/* Knowledge Graph Animation */}
          <svg className="w-full h-full" viewBox="0 0 400 400">
            {/* Center node */}
            <circle cx="200" cy="200" r="40" fill="#6366F1" opacity="0.8" className="animate-pulse" />
            
            {/* Surrounding nodes with different paths */}
            {[
              { cx: 100, cy: 100, delay: '0s' },
              { cx: 300, cy: 100, delay: '0.2s' },
              { cx: 300, cy: 300, delay: '0.4s' },
              { cx: 100, cy: 300, delay: '0.6s' },
              { cx: 200, cy: 50, delay: '0.8s' },
              { cx: 350, cy: 200, delay: '1s' },
              { cx: 200, cy: 350, delay: '1.2s' },
              { cx: 50, cy: 200, delay: '1.4s' }
            ].map((node, i) => (
              <g key={i}>
                <line 
                  x1="200" y1="200" 
                  x2={node.cx} y2={node.cy} 
                  stroke="#E5E7EB" 
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <circle 
                  cx={node.cx} 
                  cy={node.cy} 
                  r="25" 
                  fill={i % 2 === 0 ? '#A78BFA' : '#10B981'} 
                  opacity="0.6"
                  className="animate-pulse"
                  style={{ animationDelay: node.delay }}
                />
              </g>
            ))}
            
            <text x="200" y="205" textAnchor="middle" className="fill-pure-light font-semibold">
              You
            </text>
          </svg>
        </div>
      )
    },
    {
      number: 4,
      icon: <BarChart3 className="w-6 h-6" />,
      headline: "Turn Learning Data Into Business Decisions",
      subheadline: "Intelligence Analytics",
      keyPoints: [
        "Individual skill mapping",
        "Team capability matrices",
        "Promotion readiness scores",
        "ROI on learning investment"
      ],
      stats: "Identify future leaders. Optimize teams. Prove training value.",
      visual: (
        <div className="h-[400px] bg-gradient-to-br from-pure-light to-whisper-gray rounded-lg p-6">
          {/* Analytics Dashboard */}
          <div className="h-full flex flex-col gap-4">
            <h4 className="font-semibold">Team Skill Matrix</h4>
            
            {/* Skill Heatmap Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-2 h-full">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded transition-all duration-500 hover:scale-110"
                    style={{
                      backgroundColor: `rgba(99, 102, 241, ${((i * 7) % 10) * 0.08 + 0.2})`
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-stone-gray">
              <span>Low Proficiency</span>
              <span>High Proficiency</span>
            </div>
          </div>
        </div>
      ),
      reverse: true
    },
    {
      number: 5,
      icon: <Shield className="w-6 h-6" />,
      headline: "Get Compliant in Weeks, Not Years",
      subheadline: "Compliance at the Speed of AI",
      keyPoints: [
        "Gamified compliance training",
        "94% completion rates",
        "One-click ISO report export",
        "Any format you need"
      ],
      visual: (
        <div className="h-[400px] relative flex items-center justify-center">
          {/* Before/After Visual */}
          <div className="w-full flex items-center justify-around">
            <div className="text-center">
              <div className="text-6xl font-bold text-stone-gray/30 mb-2">2</div>
              <div className="text-sm text-stone-gray">Years</div>
              <div className="text-xs text-stone-gray/60 mt-1">Traditional</div>
            </div>
            
            <ArrowRight className="w-12 h-12 text-cosmic-purple animate-pulse" />
            
            <div className="text-center">
              <div className="text-6xl font-bold text-cosmic-purple mb-2">8</div>
              <div className="text-sm text-stone-gray">Weeks</div>
              <div className="text-xs text-cosmic-purple/60 mt-1">With Vergil</div>
            </div>
          </div>
          
          {/* Compliance Badges */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            {['ISO 27001', 'GDPR', 'SOC 2', 'HIPAA'].map((badge) => (
              <Badge key={badge} variant="outline" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      )
    }
  ]

  return (
    <Section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-display-lg font-display font-bold mb-4">
            Everything You Need in One <span className="gradient-text">Intelligent Platform</span>
          </h2>
        </div>
        
        {/* Pillars */}
        <div className="space-y-32">
          {pillars.map((pillar) => (
            <Pillar key={pillar.number} {...pillar} />
          ))}
        </div>
      </div>
    </Section>
  )
}