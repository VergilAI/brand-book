'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Zap, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface CheckingIndicatorProps {
  message?: string
  type?: 'checking' | 'success' | 'error' | 'loading'
  icon?: 'zap' | 'clock' | 'check' | 'x' | 'loader'
  className?: string
}

const iconMap = {
  zap: Zap,
  clock: Clock,
  check: CheckCircle,
  x: XCircle,
  loader: Loader2
}

const typeStyles = {
  checking: 'text-cosmic-purple',
  success: 'text-phosphor-cyan',
  error: 'text-vivid-red',
  loading: 'text-stone-gray'
}

const typeIcons = {
  checking: 'zap' as const,
  success: 'check' as const,
  error: 'x' as const,
  loading: 'loader' as const
}

export function CheckingIndicator({
  message = "Checking...",
  type = 'checking',
  icon,
  className
}: CheckingIndicatorProps) {
  const IconComponent = iconMap[icon || typeIcons[type]]
  const iconClass = type === 'checking' ? 'animate-pulse' : type === 'loading' ? 'animate-spin' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-center"
    >
      <Card className={cn("p-4 border-stone-gray/20 max-w-md", className)}>
        <div className="flex items-center justify-center gap-2">
          <IconComponent className={cn("w-5 h-5", typeStyles[type], iconClass)} />
          <p className="text-stone-gray">{message}</p>
        </div>
      </Card>
    </motion.div>
  )
}