'use client'

import { LMSHeader } from '@/components/lms-header'
import { TestInterface } from '@/components/TestInterface'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-vergil-off-white">
      <LMSHeader currentView="test" />
      <main className="w-full">
        <TestInterface />
      </main>
    </div>
  )
}