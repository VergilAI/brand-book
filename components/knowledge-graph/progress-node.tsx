'use client'

import { cn } from '@/lib/utils'

interface ProgressNodeProps {
  title: string
  progress: number // 0-100
  size?: number
  className?: string
  onClick?: () => void
  showLabel?: boolean
}

export function ProgressNode({ 
  title, 
  progress, 
  size = 48,
  className,
  onClick,
  showLabel = true
}: ProgressNodeProps) {
  const radius = size / 2
  const strokeWidth = 3
  const normalizedRadius = radius - strokeWidth
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Determine color based on progress
  const getProgressColor = (progress: number) => {
    if (progress >= 70) return '#22C55E' // Green for good progress
    if (progress >= 40) return '#FFC700' // Yellow for medium progress
    if (progress > 0) return '#E51C23' // Red for low progress
    return '#E5E7EB' // Gray for not started
  }

  const progressColor = getProgressColor(progress)
  const isStarted = progress > 0

  return (
    <div 
      className={cn(
        "relative cursor-pointer transition-transform hover:scale-105",
        className
      )}
      onClick={onClick}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
      >
        {/* Background track */}
        <circle
          stroke="#E5E7EB"
          fill="none"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        {/* Progress arc */}
        <circle
          stroke={progressColor}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Inner circle */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-full",
          "bg-white border-2 transition-colors",
          isStarted ? "border-gray-200" : "border-gray-100"
        )}
        style={{
          width: size - 8,
          height: size - 8,
          top: 4,
          left: 4
        }}
      >
        {showLabel ? (
          <span className={cn(
            "text-xs font-medium text-center px-1",
            isStarted ? "text-gray-900" : "text-gray-500"
          )}>
            {title}
          </span>
        ) : (
          <span className={cn(
            "font-medium",
            size <= 20 ? "text-[8px]" : size <= 28 ? "text-[10px]" : "text-xs",
            progress >= 70 ? "text-green-700" :
            progress >= 40 ? "text-yellow-700" :
            progress > 0 ? "text-red-700" : "text-gray-400"
          )}>
            {progress}
          </span>
        )}
      </div>

      {/* Progress percentage on hover */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
        <span className="text-xs text-gray-600">{progress}%</span>
      </div>
    </div>
  )
}