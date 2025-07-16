'use client'

import Link from 'next/link'

export default function CSSTestPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">CSS Test Page</h1>
      
      <div className="mb-8">
        <Link href="/css-test/spacing-test" className="text-blue-600 underline hover:text-blue-800">
          → Go to Spacing Test Page
        </Link>
      </div>
      
      <div className="space-y-6">
        <div className="p-6 bg-primary border border-default rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Primary Background</h2>
          <p className="text-secondary">This should have a white background (#FFFFFF)</p>
        </div>
        
        <div className="p-6 bg-secondary border border-default rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Secondary Background</h2>
          <p className="text-secondary">This should have a light gray background (#F5F5F7)</p>
        </div>
        
        <div className="p-6 bg-brand text-white rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Brand Background</h2>
          <p>This should have a purple background (#A64DFF)</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-red-500 text-white rounded">Tailwind Red</div>
          <div className="p-4 bg-green-500 text-white rounded">Tailwind Green</div>
          <div className="p-4 bg-blue-500 text-white rounded">Tailwind Blue</div>
        </div>
        
        <div className="flex gap-4">
          <button className="btn-primary px-6 py-2 rounded-md">Primary Button</button>
          <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Standard Button</button>
        </div>
      </div>
    </div>
  )
}