'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  children, 
  language = 'tsx', 
  className,
  showLineNumbers = true 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const lines = (children || '').trim().split('\n')

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 px-2"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      
      <pre className={cn(
        "rounded-lg border border-gray-200 bg-gray-50 p-4 overflow-x-auto",
        "text-sm leading-relaxed font-mono",
        className
      )}>
        <code>
          {showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="pr-4 text-gray-500 text-right select-none w-8">
                      {i + 1}
                    </td>
                    <td className="text-gray-800">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span className="text-gray-800">{(children || '').trim()}</span>
          )}
        </code>
      </pre>
    </div>
  )
}