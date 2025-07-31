'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/atomic/button'
import { Badge } from '@/components/atomic/badge'
import { Progress } from '@/components/progress'
import { Loader2, ArrowRight, Brain, Clock, Trophy, TrendingUp } from 'lucide-react'
import { recommendationsAPI } from '@/lib/api/recommendations-api'
import { useRouter } from 'next/navigation'

interface Recommendation {
  courseId: string
  courseName: string
  reason: string
  score: number
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  topics: string[]
}

interface CourseRecommendationsProps {
  currentCourseId?: string
  className?: string
}

export function CourseRecommendations({ currentCourseId, className }: CourseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true)
        setError(null)
        const response = await recommendationsAPI.getCourseRecommendations()
        
        // Transform the API response to our component format
        const transformedRecommendations: Recommendation[] = response.recommendations.map((rec: any) => ({
          courseId: rec.course_id.toString(),
          courseName: rec.course_name,
          reason: rec.reason,
          score: rec.recommendation_score,
          estimatedTime: rec.estimated_time || 30,
          difficulty: rec.difficulty || 'intermediate',
          topics: rec.topics || []
        }))
        
        // Filter out current course if provided
        const filtered = currentCourseId 
          ? transformedRecommendations.filter(r => r.courseId !== currentCourseId)
          : transformedRecommendations
        
        setRecommendations(filtered.slice(0, 3)) // Show top 3 recommendations
      } catch (err) {
        console.error('Error loading recommendations:', err)
        setError('Failed to load recommendations')
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [currentCourseId])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'success'
      case 'intermediate':
        return 'info'
      case 'advanced':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '🌱'
      case 'intermediate':
        return '🚀'
      case 'advanced':
        return '⚡'
      default:
        return '📚'
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-text-brand" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-text-brand" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || recommendations.length === 0) {
    return null // Don't show the section if there's an error or no recommendations
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-text-brand" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div 
            key={rec.courseId}
            className="border border-border-subtle rounded-lg p-4 hover:bg-bg-secondary transition-all cursor-pointer"
            onClick={() => router.push(`/lms/courses/${rec.courseId}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-text-primary mb-1">{rec.courseName}</h4>
                <p className="text-sm text-text-secondary">{rec.reason}</p>
              </div>
              <Badge 
                variant={getDifficultyColor(rec.difficulty) as any}
                className="ml-3"
              >
                {getDifficultyIcon(rec.difficulty)} {rec.difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{rec.estimatedTime} hours</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>{rec.topics.length} topics</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                <span>Match: {Math.round(rec.score * 100)}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Progress 
                value={rec.score * 100} 
                className="flex-1 h-2 mr-3"
              />
              <Button 
                size="sm" 
                variant="ghost"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/lms/courses/${rec.courseId}`)
                }}
              >
                View Course
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}