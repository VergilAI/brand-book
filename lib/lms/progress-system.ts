/**
 * Knowledge Point Progress System
 * 
 * Core system for tracking and calculating knowledge point proficiency
 * based on game performance and learning interactions.
 */

export interface PerformanceRecord {
  id: string
  knowledgePointId: string
  gameTypeId: string
  isCorrect: boolean
  confidence: number // 1-5 scale, how confident the system is in this assessment
  timestamp: Date
  responseTime?: number // milliseconds
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface EnhancedKnowledgePoint {
  id: string
  title: string
  description: string
  proficiency: number // 0-100 percentage
  performanceHistory: PerformanceRecord[]
  totalAttempts: number
  correctAttempts: number
  lastPracticed?: Date
  masteryLevel: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert'
}

export interface ProgressUpdate {
  knowledgePointId: string
  gameTypeId: string
  isCorrect: boolean
  confidence: number
  difficulty: 'easy' | 'medium' | 'hard'
  responseTime?: number
}

export class ProgressCalculator {
  
  /**
   * Calculate new proficiency score based on performance
   * Uses a confidence-weighted system with diminishing returns
   */
  static calculateNewProficiency(
    currentProficiency: number,
    isCorrect: boolean,
    confidence: number,
    difficulty: 'easy' | 'medium' | 'hard',
    performanceHistory: PerformanceRecord[]
  ): number {
    
    // Base adjustment values
    const difficultyMultipliers = {
      easy: 0.5,
      medium: 1.0,
      hard: 1.5
    }
    
    // Confidence scaling (1-5 scale)
    const confidenceWeight = confidence / 5
    
    // Calculate base change amount
    let baseChange = 0
    
    if (isCorrect) {
      // Positive reinforcement with diminishing returns
      const masteryFactor = Math.max(0.1, (100 - currentProficiency) / 100)
      baseChange = 8 * masteryFactor * difficultyMultipliers[difficulty] * confidenceWeight
    } else {
      // Negative feedback is gentler and doesn't go below certain thresholds
      const errorPenalty = Math.min(6, currentProficiency * 0.1)
      baseChange = -errorPenalty * difficultyMultipliers[difficulty] * confidenceWeight
    }
    
    // Apply recent performance streak bonus/malus
    const recentPerformance = this.getRecentPerformanceStreak(performanceHistory, 5)
    const streakMultiplier = this.calculateStreakMultiplier(recentPerformance)
    
    baseChange *= streakMultiplier
    
    // Calculate new proficiency with bounds
    const newProficiency = Math.max(0, Math.min(100, currentProficiency + baseChange))
    
    return Math.round(newProficiency * 10) / 10 // Round to 1 decimal place
  }
  
  /**
   * Get recent performance streak (last N attempts)
   */
  private static getRecentPerformanceStreak(
    history: PerformanceRecord[], 
    count: number
  ): boolean[] {
    return history
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, count)
      .map(record => record.isCorrect)
  }
  
  /**
   * Calculate streak multiplier based on recent performance
   */
  private static calculateStreakMultiplier(recentPerformance: boolean[]): number {
    if (recentPerformance.length === 0) return 1.0
    
    const correctCount = recentPerformance.filter(Boolean).length
    const total = recentPerformance.length
    const ratio = correctCount / total
    
    // Reward consistent success, be gentle with struggles
    if (ratio >= 0.8) return 1.2 // 20% bonus for strong performance
    if (ratio >= 0.6) return 1.1 // 10% bonus for good performance
    if (ratio >= 0.4) return 1.0 // Neutral
    if (ratio >= 0.2) return 0.9 // Small reduction for poor performance
    return 0.8 // Bigger reduction only for very poor performance
  }
  
  /**
   * Determine mastery level based on proficiency and consistency
   */
  static calculateMasteryLevel(
    proficiency: number,
    performanceHistory: PerformanceRecord[]
  ): 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert' {
    
    if (performanceHistory.length < 3) return 'novice'
    
    // Check consistency in recent performance
    const recentPerformance = this.getRecentPerformanceStreak(performanceHistory, 10)
    const consistency = recentPerformance.length > 0 
      ? recentPerformance.filter(Boolean).length / recentPerformance.length 
      : 0
    
    // Mastery requires both high proficiency AND consistency
    if (proficiency >= 90 && consistency >= 0.9) return 'expert'
    if (proficiency >= 80 && consistency >= 0.8) return 'advanced'
    if (proficiency >= 70 && consistency >= 0.7) return 'proficient'
    if (proficiency >= 40) return 'developing'
    return 'novice'
  }
  
  /**
   * Calculate overall lesson proficiency from knowledge points
   */
  static calculateLessonProficiency(knowledgePoints: EnhancedKnowledgePoint[]): number {
    if (knowledgePoints.length === 0) return 0
    
    // Weighted average based on practice frequency
    let totalWeight = 0
    let weightedSum = 0
    
    knowledgePoints.forEach(kp => {
      // Weight by number of attempts (more practiced = more reliable)
      const weight = Math.min(5, Math.max(1, kp.totalAttempts))
      totalWeight += weight
      weightedSum += kp.proficiency * weight
    })
    
    return Math.round((weightedSum / totalWeight) * 10) / 10
  }
  
  /**
   * Calculate test readiness based on proficiency and mastery distribution
   */
  static calculateTestReadiness(knowledgePoints: EnhancedKnowledgePoint[]): {
    score: number
    level: 'not-ready' | 'needs-practice' | 'almost-ready' | 'ready' | 'excellent'
    recommendations: string[]
  } {
    if (knowledgePoints.length === 0) {
      return { score: 0, level: 'not-ready', recommendations: ['Complete some lessons first'] }
    }
    
    const avgProficiency = this.calculateLessonProficiency(knowledgePoints)
    const masteryLevels = knowledgePoints.map(kp => kp.masteryLevel)
    
    // Count mastery distribution
    const masteryCounts = {
      expert: masteryLevels.filter(m => m === 'expert').length,
      advanced: masteryLevels.filter(m => m === 'advanced').length,
      proficient: masteryLevels.filter(m => m === 'proficient').length,
      developing: masteryLevels.filter(m => m === 'developing').length,
      novice: masteryLevels.filter(m => m === 'novice').length
    }
    
    const recommendations: string[] = []
    
    // Determine readiness level
    let level: 'not-ready' | 'needs-practice' | 'almost-ready' | 'ready' | 'excellent'
    
    if (avgProficiency >= 85 && masteryCounts.expert + masteryCounts.advanced >= knowledgePoints.length * 0.7) {
      level = 'excellent'
    } else if (avgProficiency >= 75 && masteryCounts.proficient + masteryCounts.advanced + masteryCounts.expert >= knowledgePoints.length * 0.8) {
      level = 'ready'
    } else if (avgProficiency >= 65) {
      level = 'almost-ready'
      recommendations.push('Practice weak knowledge points')
    } else if (avgProficiency >= 40) {
      level = 'needs-practice'
      recommendations.push('Focus on fundamental concepts')
    } else {
      level = 'not-ready'
      recommendations.push('Complete more lessons and practice')
    }
    
    // Add specific recommendations
    if (masteryCounts.novice > 0) {
      recommendations.push(`${masteryCounts.novice} knowledge points need basic practice`)
    }
    if (masteryCounts.developing > knowledgePoints.length * 0.3) {
      recommendations.push('Focus on developing concepts through different game types')
    }
    
    return {
      score: Math.round(avgProficiency),
      level,
      recommendations
    }
  }
}

/**
 * Map game results to knowledge point assessments
 */
export class GameResultMapper {
  
  /**
   * Map flashcard results to knowledge point progress
   */
  static mapFlashcardResults(
    results: { cardId: string; isCorrect: boolean; responseTime: number }[],
    knowledgePointMapping: Record<string, string> // cardId -> knowledgePointId
  ): ProgressUpdate[] {
    return results.map(result => ({
      knowledgePointId: knowledgePointMapping[result.cardId],
      gameTypeId: 'flashcards',
      isCorrect: result.isCorrect,
      confidence: result.responseTime < 3000 ? 5 : result.responseTime < 8000 ? 4 : 3,
      difficulty: 'medium' as const,
      responseTime: result.responseTime
    }))
  }
  
  /**
   * Map millionaire game results to knowledge point progress
   */
  static mapMillionaireResults(
    results: { questionId: string; isCorrect: boolean; usedLifelines: string[]; responseTime: number }[],
    knowledgePointMapping: Record<string, string>
  ): ProgressUpdate[] {
    return results.map(result => ({
      knowledgePointId: knowledgePointMapping[result.questionId],
      gameTypeId: 'millionaire',
      isCorrect: result.isCorrect,
      confidence: result.usedLifelines.length === 0 ? 5 : result.usedLifelines.length === 1 ? 4 : 3,
      difficulty: 'hard' as const,
      responseTime: result.responseTime
    }))
  }
  
  /**
   * Map connect cards results to knowledge point progress
   */
  static mapConnectCardsResults(
    results: { pairId: string; isCorrect: boolean; attempts: number }[],
    knowledgePointMapping: Record<string, string>
  ): ProgressUpdate[] {
    return results.map(result => ({
      knowledgePointId: knowledgePointMapping[result.pairId],
      gameTypeId: 'connect-cards',
      isCorrect: result.isCorrect,
      confidence: result.attempts === 1 ? 5 : result.attempts === 2 ? 4 : 3,
      difficulty: 'easy' as const
    }))
  }
  
  /**
   * Map jeopardy results to knowledge point progress
   */
  static mapJeopardyResults(
    results: { clueId: string; isCorrect: boolean; value: number; responseTime: number }[],
    knowledgePointMapping: Record<string, string>
  ): ProgressUpdate[] {
    return results.map(result => ({
      knowledgePointId: knowledgePointMapping[result.clueId],
      gameTypeId: 'jeopardy',
      isCorrect: result.isCorrect,
      confidence: result.responseTime < 10000 ? 5 : result.responseTime < 20000 ? 4 : 3,
      difficulty: result.value >= 400 ? 'hard' : result.value >= 200 ? 'medium' : 'easy',
      responseTime: result.responseTime
    }))
  }
}