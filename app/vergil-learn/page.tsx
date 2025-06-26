'use client'

import { useState } from 'react'
import { Navigation } from '@/components/landing/navigation'
import { LearnHero } from '@/components/landing/learn-hero'
import { UserJourneyCarousel } from '@/components/landing/user-journey-carousel'
import { LearnFooter } from '@/components/landing/learn-footer'

// Demo Video Modal Component
function DemoVideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl"
        >
          ✕ Close
        </button>
        <div className="bg-black rounded-lg overflow-hidden aspect-video">
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-cosmic-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">▶</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Demo Video</h3>
              <p className="text-gray-300">2-minute overview of Vergil Learn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VergilLearnPage() {
  const [showDemoModal, setShowDemoModal] = useState(false)
  
  const handleVideoClick = () => {
    setShowDemoModal(true)
  }
  
  const handleCloseModal = () => {
    setShowDemoModal(false)
  }
  
  return (
    <main className="min-h-screen bg-pure-light">
      <Navigation basePath="/vergil-learn" />
      
      {/* Hero Section */}
      <LearnHero onVideoClick={handleVideoClick} />
      
      {/* User Journey Carousel */}
      <UserJourneyCarousel />
      
      {/* Footer */}
      <LearnFooter />
      
      {/* Demo Video Modal */}
      <DemoVideoModal isOpen={showDemoModal} onClose={handleCloseModal} />
    </main>
  )
}