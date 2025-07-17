'use client'

import { KnowledgeNode } from './types'
import { Brain, Lock, CheckCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NodeDetailsProps {
  node: KnowledgeNode | null
  allNodes: KnowledgeNode[]
  onPractice?: (node: KnowledgeNode) => void
}

export function NodeDetails({ node, allNodes, onPractice }: NodeDetailsProps) {
  if (!node) {
    return (
      <div className="p-spacing-lg text-center text-secondary">
        <Brain className="w-12 h-12 mx-auto mb-spacing-sm opacity-20" />
        <p className="text-sm">Select a knowledge point to view details</p>
      </div>
    )
  }


  return (
    <div className="p-spacing-lg space-y-spacing-md">
      {/* Header */}
      <div className="flex items-start gap-spacing-sm">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          node.status === 'mastered' && "bg-green-100",
          node.status === 'learning' && "bg-purple-100",
          node.status === 'available' && "bg-gray-100",
          node.status === 'locked' && "bg-gray-50"
        )}>
          <Brain className={cn(
            "w-5 h-5",
            node.status === 'mastered' && "text-green-600",
            node.status === 'learning' && "text-purple-600",
            node.status === 'available' && "text-gray-600",
            node.status === 'locked' && "text-gray-400"
          )} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary">{node.title}</h3>
          <p className="text-sm text-secondary mt-1">{node.description}</p>
        </div>
      </div>

      {/* Proficiency */}
      <div className="space-y-spacing-xs">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary">Proficiency</span>
          <span className="font-medium text-primary">{node.proficiency}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              node.proficiency >= 80 ? "bg-green-500" : "bg-purple-500"
            )}
            style={{ width: `${node.proficiency}%` }}
          />
        </div>
      </div>


      {/* Action Button */}
      {node.status !== 'locked' && (
        <button
          onClick={() => onPractice?.(node)}
          className={cn(
            "w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200",
            "flex items-center justify-center gap-2",
            node.status === 'mastered' 
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-purple-500 text-white hover:bg-purple-600"
          )}
        >
          {node.status === 'mastered' ? 'Review' : 'Practice'} This Concept
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}