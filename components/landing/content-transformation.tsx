'use client'

import { ArrowRight } from 'lucide-react'

export function ContentTransformation() {
  return (
    <section className="py-20 bg-soft-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-deep-space">
              Transform Any Content Into{' '}
              <span className="gradient-text">Intelligent Learning</span>
            </h2>
            <p className="text-xl text-stone-gray max-w-3xl mx-auto">
              Upload your existing materials and watch AI transform them into personalized, 
              adaptive learning experiences that employees actually complete.
            </p>
          </div>

          {/* Content Transformation Visualization */}
          <div className="relative h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-consciousness-gradient opacity-10 blur-3xl" />
            
            {/* Split Screen Animation Container */}
            <div className="relative h-full flex flex-col md:flex-row gap-8">
              {/* Left Side - Content Stack */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-4">
                    {['PDF Content', 'Video Content', 'Docs Content', 'Wiki Content'].map((type, i) => (
                      <div
                        key={type}
                        className="w-48 h-14 bg-pure-light shadow-lg rounded-lg flex items-center justify-center font-medium animate-blob border border-mist-gray"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Arrow */}
              <div className="hidden md:flex items-center justify-center px-4">
                <div className="w-16 h-16 rounded-full bg-cosmic-purple/20 flex items-center justify-center animate-pulse">
                  <ArrowRight className="w-8 h-8 text-cosmic-purple" />
                </div>
              </div>

              {/* Right Side - Learning Interface */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-pure-light/90 backdrop-blur-sm rounded-2xl border border-mist-gray p-6 shadow-xl">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-phosphor-cyan animate-pulse" />
                      <span className="text-sm font-medium text-deep-space">Active Learning</span>
                    </div>
                    
                    {/* Knowledge Graph Visualization */}
                    <div className="flex-1 relative">
                      <svg className="w-full h-full" viewBox="0 0 300 200">
                        {/* Animated knowledge graph */}
                        <circle cx="150" cy="100" r="30" fill="#6366F1" opacity="0.6" className="animate-pulse" />
                        <circle cx="80" cy="60" r="20" fill="#A78BFA" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <circle cx="220" cy="60" r="20" fill="#818CF8" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                        <circle cx="80" cy="140" r="20" fill="#10B981" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                        <circle cx="220" cy="140" r="20" fill="#3B82F6" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
                        
                        <line x1="150" y1="100" x2="80" y2="60" stroke="#E5E7EB" strokeWidth="2" />
                        <line x1="150" y1="100" x2="220" y2="60" stroke="#E5E7EB" strokeWidth="2" />
                        <line x1="150" y1="100" x2="80" y2="140" stroke="#E5E7EB" strokeWidth="2" />
                        <line x1="150" y1="100" x2="220" y2="140" stroke="#E5E7EB" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Progress Indicators */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs text-stone-gray">
                        <span>Learning Progress</span>
                        <span>87%</span>
                      </div>
                      <div className="w-full bg-mist-gray rounded-full h-2">
                        <div className="bg-phosphor-cyan h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}