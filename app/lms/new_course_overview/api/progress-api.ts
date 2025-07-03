/**
 * Progress Tracking API
 * 
 * Handles all progress-related operations including knowledge point updates,
 * performance tracking, and score calculations.
 */

import { 
  EnhancedKnowledgePoint, 
  PerformanceRecord, 
  ProgressUpdate, 
  ProgressCalculator, 
  GameResultMapper 
} from '@/lib/lms/progress-system'

export class ProgressAPI {
  
  /**
   * DEBUG: Manual test function that can be called from browser console
   */
  static async manualTest(): Promise<void> {
    console.log('🔧 MANUAL DEBUG TEST STARTING...');
    console.log('='.repeat(60));
    
    const lessonId = 'lesson-1-1';
    const courseId = 'course-1';
    
    // Clear existing data first
    console.log('🧹 Clearing existing progress data...');
    localStorage.removeItem(`lesson_progress_${lessonId}`);
    localStorage.removeItem(`user-progress-${courseId}`);
    
    // Test the flashcard completion
    const testResults = [
      { cardId: 'card-0', isCorrect: true, responseTime: 3000 },
      { cardId: 'card-1', isCorrect: false, responseTime: 5000 },
      { cardId: 'card-2', isCorrect: true, responseTime: 2000 }
    ];
    
    console.log('🎯 Step 1: Testing processFlashcardCompletion...');
    console.log('Test results:', testResults);
    
    const result = await this.processFlashcardCompletion(lessonId, testResults);
    console.log('✅ Result:', result);
    
    // Check localStorage after processing
    console.log('\n📂 Step 2: Checking localStorage after processing...');
    const lessonData = localStorage.getItem(`lesson_progress_${lessonId}`);
    const courseData = localStorage.getItem(`user-progress-${courseId}`);
    
    console.log('Lesson data:', lessonData ? JSON.parse(lessonData) : '❌ NOT FOUND');
    console.log('Course data:', courseData ? JSON.parse(courseData) : '❌ NOT FOUND');
    
    // Test course loading
    console.log('\n📚 Step 3: Testing course loading with merge...');
    const { courseAPI } = await import('./course-api');
    const course = await courseAPI.getCourse(courseId);
    
    console.log('Course loaded:', course);
    
    // Check specific lesson knowledge points
    const lesson = course.chapters[0].lessons[0]; // lesson-1-1
    console.log('\n🎯 Step 4: Checking lesson knowledge points:');
    lesson.knowledgePoints.forEach(kp => {
      console.log(`📈 ${kp.id} (${kp.title}): ${kp.proficiency}%`);
    });
    
    // Manual event dispatch test
    console.log('\n📡 Step 5: Testing manual event dispatch...');
    let eventReceived = false;
    const handler = (event: CustomEvent) => {
      console.log('✅ Event received:', event.detail);
      eventReceived = true;
    };
    
    window.addEventListener('courseProgressUpdated', handler as EventListener);
    window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
      detail: { courseId, lessonId } 
    }));
    
    setTimeout(() => {
      console.log(`Event system: ${eventReceived ? '✅ Working' : '❌ Failed'}`);
      window.removeEventListener('courseProgressUpdated', handler as EventListener);
      
      console.log('\n🎉 MANUAL TEST COMPLETE!');
      console.log('='.repeat(60));
    }, 500);
  }

  /**
   * DEBUG: Simple test function to verify the API is working
   */
  static async debugTest(): Promise<any> {
    console.log('🧪 DEBUG: ProgressAPI.debugTest called');
    
    const lessonId = 'lesson-1-1';
    const courseId = 'course-1';
    
    // Check current localStorage state
    console.log('📂 Current localStorage state:');
    console.log('Lesson key:', `lesson_progress_${lessonId}`);
    console.log('Lesson data:', localStorage.getItem(`lesson_progress_${lessonId}`));
    console.log('Course key:', `user-progress-${courseId}`);
    console.log('Course data:', localStorage.getItem(`user-progress-${courseId}`));
    
    // Test a simple progress update
    const testResults = [
      { cardId: 'card-0', isCorrect: true, responseTime: 3000 },
      { cardId: 'card-1', isCorrect: false, responseTime: 5000 },
    ];
    
    console.log('🎯 Testing progress update with results:', testResults);
    
    try {
      const result = await this.processFlashcardCompletion(lessonId, testResults);
      console.log('✅ Progress update result:', result);
      
      // Check localStorage after update
      console.log('📂 After update localStorage state:');
      console.log('Lesson data:', localStorage.getItem(`lesson_progress_${lessonId}`));
      console.log('Course data:', localStorage.getItem(`user-progress-${courseId}`));
      
      return result;
    } catch (error) {
      console.error('❌ Progress update failed:', error);
      throw error;
    }
  }

  /**
   * Update knowledge point proficiency based on game performance
   */
  static async updateKnowledgePointProgress(
    lessonId: string,
    progressUpdates: ProgressUpdate[]
  ): Promise<{ success: boolean; updatedKnowledgePoints: EnhancedKnowledgePoint[] }> {
    console.log(`🎯 ProgressAPI.updateKnowledgePointProgress called:`, { lessonId, progressUpdates })
    
    try {
      // Load current lesson data
      console.log(`📚 Loading lesson data for ${lessonId}...`)
      const lesson = await this.loadLessonData(lessonId)
      if (!lesson) {
        throw new Error(`Lesson ${lessonId} not found`)
      }
      console.log(`✅ Lesson data loaded, found ${lesson.knowledgePoints.length} knowledge points`)
      
      const updatedKnowledgePoints: EnhancedKnowledgePoint[] = []
      
      // Process each progress update
      for (const update of progressUpdates) {
        console.log(`🔄 Processing update for KP ${update.knowledgePointId}:`, update)
        
        const kp = lesson.knowledgePoints.find(k => k.id === update.knowledgePointId)
        if (!kp) {
          console.warn(`⚠️ Knowledge point ${update.knowledgePointId} not found in lesson ${lessonId}`)
          console.log(`Available KPs:`, lesson.knowledgePoints.map(k => k.id))
          continue
        }
        
        const oldProficiency = kp.proficiency
        
        // Create performance record
        const performanceRecord: PerformanceRecord = {
          id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          knowledgePointId: update.knowledgePointId,
          gameTypeId: update.gameTypeId,
          isCorrect: update.isCorrect,
          confidence: update.confidence,
          timestamp: new Date(),
          responseTime: update.responseTime,
          difficulty: update.difficulty
        }
        
        // Add to performance history
        kp.performanceHistory.push(performanceRecord)
        
        // Update attempt counters
        kp.totalAttempts += 1
        if (update.isCorrect) {
          kp.correctAttempts += 1
        }
        
        // Calculate new proficiency
        const newProficiency = ProgressCalculator.calculateNewProficiency(
          kp.proficiency,
          update.isCorrect,
          update.confidence,
          update.difficulty,
          kp.performanceHistory
        )
        
        kp.proficiency = newProficiency
        kp.lastPracticed = new Date()
        kp.masteryLevel = ProgressCalculator.calculateMasteryLevel(
          newProficiency,
          kp.performanceHistory
        )
        
        updatedKnowledgePoints.push(kp)
        
        console.log(`📈 Updated KP ${kp.title}: ${oldProficiency}% → ${kp.proficiency}% (${update.isCorrect ? '✅' : '❌'})`)
      }
      
      // Save updated lesson data
      console.log(`💾 Saving lesson data...`)
      await this.saveLessonData(lessonId, lesson)
      console.log(`✅ Progress update completed successfully!`)
      
      return {
        success: true,
        updatedKnowledgePoints
      }
    } catch (error) {
      console.error('❌ Failed to update knowledge point progress:', error)
      return {
        success: false,
        updatedKnowledgePoints: []
      }
    }
  }
  
  /**
   * Process flashcard game completion
   */
  static async processFlashcardCompletion(
    lessonId: string,
    results: { cardId: string; isCorrect: boolean; responseTime: number }[]
  ): Promise<{ success: boolean; updatedKnowledgePoints: EnhancedKnowledgePoint[] }> {
    console.log(`🃏 processFlashcardCompletion called:`, { lessonId, results })
    
    // Create knowledge point mapping from flashcard content
    console.log(`🗺️ Creating flashcard mapping...`)
    const knowledgePointMapping = await this.createFlashcardMapping(lessonId)
    console.log(`📍 Flashcard mapping:`, knowledgePointMapping)
    
    // Map results to progress updates
    console.log(`🔄 Mapping results to progress updates...`)
    const progressUpdates = GameResultMapper.mapFlashcardResults(results, knowledgePointMapping)
    console.log(`📋 Progress updates:`, progressUpdates)
    
    return this.updateKnowledgePointProgress(lessonId, progressUpdates)
  }
  
  /**
   * Process millionaire game completion
   */
  static async processMillionaireCompletion(
    lessonId: string,
    results: { questionId: string; isCorrect: boolean; usedLifelines: string[]; responseTime: number }[]
  ): Promise<{ success: boolean; updatedKnowledgePoints: EnhancedKnowledgePoint[] }> {
    
    const knowledgePointMapping = await this.createMillionaireMapping(lessonId)
    const progressUpdates = GameResultMapper.mapMillionaireResults(results, knowledgePointMapping)
    
    return this.updateKnowledgePointProgress(lessonId, progressUpdates)
  }
  
  /**
   * Process connect cards game completion
   */
  static async processConnectCardsCompletion(
    lessonId: string,
    results: { pairId: string; isCorrect: boolean; attempts: number }[]
  ): Promise<{ success: boolean; updatedKnowledgePoints: EnhancedKnowledgePoint[] }> {
    
    const knowledgePointMapping = await this.createConnectCardsMapping(lessonId)
    const progressUpdates = GameResultMapper.mapConnectCardsResults(results, knowledgePointMapping)
    
    return this.updateKnowledgePointProgress(lessonId, progressUpdates)
  }
  
  /**
   * Process jeopardy game completion
   */
  static async processJeopardyCompletion(
    lessonId: string,
    results: { clueId: string; isCorrect: boolean; value: number; responseTime: number }[]
  ): Promise<{ success: boolean; updatedKnowledgePoints: EnhancedKnowledgePoint[] }> {
    
    const knowledgePointMapping = await this.createJeopardyMapping(lessonId)
    const progressUpdates = GameResultMapper.mapJeopardyResults(results, knowledgePointMapping)
    
    return this.updateKnowledgePointProgress(lessonId, progressUpdates)
  }
  
  /**
   * Get current lesson progress statistics
   */
  static async getLessonProgress(lessonId: string): Promise<{
    proficiency: number
    testReadiness: ReturnType<typeof ProgressCalculator.calculateTestReadiness>
    knowledgePoints: EnhancedKnowledgePoint[]
  } | null> {
    try {
      const lesson = await this.loadLessonData(lessonId)
      if (!lesson) return null
      
      const proficiency = ProgressCalculator.calculateLessonProficiency(lesson.knowledgePoints)
      const testReadiness = ProgressCalculator.calculateTestReadiness(lesson.knowledgePoints)
      
      return {
        proficiency,
        testReadiness,
        knowledgePoints: lesson.knowledgePoints
      }
    } catch (error) {
      console.error('Failed to get lesson progress:', error)
      return null
    }
  }
  
  // Private helper methods
  
  private static async loadLessonData(lessonId: string): Promise<{ knowledgePoints: EnhancedKnowledgePoint[] } | null> {
    try {
      console.log(`📂 Loading lesson data for ${lessonId} from localStorage...`)
      
      // Try to load from localStorage first
      const key = `lesson_progress_${lessonId}`
      const storedData = localStorage.getItem(key)
      
      if (storedData) {
        console.log(`✅ Found existing lesson data in localStorage`)
        return JSON.parse(storedData)
      }
      
      // If no data exists, initialize it
      console.log(`🆕 No existing lesson data found, initializing...`)
      return this.initializeLessonProgress(lessonId)
    } catch (error) {
      console.error('❌ Error loading lesson data:', error)
      return null
    }
  }
  
  private static async saveLessonData(lessonId: string, data: { knowledgePoints: EnhancedKnowledgePoint[] }): Promise<void> {
    // In a real app, this would save to a database
    // For now, we'll store in localStorage as a mock implementation
    try {
      const key = `lesson_progress_${lessonId}`
      localStorage.setItem(key, JSON.stringify(data))
      console.log(`Saved progress for lesson ${lessonId}`)
      
      // Also update the course-level progress to trigger UI updates
      await this.updateCourseProgress(lessonId, data.knowledgePoints)
    } catch (error) {
      console.error('Failed to save lesson data:', error)
    }
  }
  
  /**
   * Update course-level progress when lesson progress changes
   */
  private static async updateCourseProgress(lessonId: string, knowledgePoints: EnhancedKnowledgePoint[]): Promise<void> {
    try {
      // Extract course ID from lesson ID (format: lesson-1-1 -> course-1)
      const lessonParts = lessonId.split('-')
      const courseId = `course-${lessonParts[1]}` // e.g., lesson-1-1 -> course-1
      console.log(`📊 Updating course progress: ${lessonId} → ${courseId}`)
      
      // Load existing course progress
      const existingProgressStr = localStorage.getItem(`user-progress-${courseId}`)
      const existingProgress = JSON.parse(existingProgressStr || '{}')
      console.log(`📜 Existing course progress:`, existingProgress)
      
      // Update lesson progress in course progress
      existingProgress.lessons = existingProgress.lessons || {}
      existingProgress.lessons[lessonId] = {
        knowledgePoints: knowledgePoints.map(kp => ({
          id: kp.id,
          proficiency: kp.proficiency,
          masteryLevel: kp.masteryLevel,
          totalAttempts: kp.totalAttempts,
          correctAttempts: kp.correctAttempts,
          lastPracticed: kp.lastPracticed
        })),
        lastUpdated: new Date().toISOString()
      }
      
      // Save updated course progress
      const updatedProgressStr = JSON.stringify(existingProgress)
      localStorage.setItem(`user-progress-${courseId}`, updatedProgressStr)
      console.log(`💾 Updated course progress for ${courseId}:`, existingProgress)
      console.log(`🔑 LocalStorage key: user-progress-${courseId}`)
      
      // Trigger a custom event to notify the UI to refresh
      console.log(`📡 Dispatching courseProgressUpdated event...`)
      window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
        detail: { courseId, lessonId } 
      }))
      console.log(`✅ Course progress update completed!`)
      
    } catch (error) {
      console.error('❌ Failed to update course progress:', error)
    }
  }
  
  private static async initializeLessonProgress(lessonId: string): Promise<{ knowledgePoints: EnhancedKnowledgePoint[] } | null> {
    try {
      // Extract course ID from lesson ID 
      const lessonParts = lessonId.split('-')
      const courseId = `course-${lessonParts[1]}`
      
      // Load the course structure to get lesson data
      console.log(`📚 Fetching course data from /lms-data/courses/${courseId}.json`)
      const response = await fetch(`/lms-data/courses/${courseId}.json`)
      console.log(`📡 Course fetch response:`, { 
        status: response.status, 
        ok: response.ok, 
        statusText: response.statusText,
        url: response.url 
      })
      
      if (!response.ok) {
        console.error(`❌ Failed to fetch course ${courseId}: ${response.status} ${response.statusText}`)
        console.error(`❌ Attempted URL: /lms-data/courses/${courseId}.json`)
        console.error(`❌ Full response:`, response)
        throw new Error(`Course ${courseId} not found (${response.status}: ${response.statusText})`)
      }
      
      const courseData = await response.json()
      console.log(`✅ Course data loaded successfully for ${courseId}`)
      
      // Find the lesson in the course data
      let lessonData = null
      for (const chapter of courseData.chapters) {
        const lesson = chapter.lessons.find((l: any) => l.id === lessonId)
        if (lesson) {
          lessonData = lesson
          break
        }
      }
      
      if (!lessonData) {
        throw new Error(`Lesson ${lessonId} not found in course ${courseId}`)
      }
      
      // Convert basic knowledge points to enhanced ones
      const enhancedKnowledgePoints: EnhancedKnowledgePoint[] = lessonData.knowledgePoints.map((kp: any) => ({
        ...kp,
        performanceHistory: [],
        totalAttempts: 0,
        correctAttempts: 0,
        masteryLevel: 'novice' as const
      }))
      
      const progressData = { knowledgePoints: enhancedKnowledgePoints }
      
      // Save lesson data directly to localStorage without triggering course update
      // to avoid circular dependency during initialization
      const key = `lesson_progress_${lessonId}`
      localStorage.setItem(key, JSON.stringify(progressData))
      console.log(`💾 Initialized lesson progress for ${lessonId}`)
      
      return progressData
    } catch (error) {
      console.error('Failed to initialize lesson progress:', error)
      return null
    }
  }
  
  private static async createFlashcardMapping(lessonId: string): Promise<Record<string, string>> {
    try {
      const response = await fetch(`/lms-data/content/lessons/${lessonId}/flashcards.json`)
      if (!response.ok) {
        // Create a fallback mapping based on lesson structure
        return this.createFallbackMapping(lessonId)
      }
      
      const flashcardData = await response.json()
      const mapping: Record<string, string> = {}
      
      // Map each flashcard to its corresponding knowledge point
      if (flashcardData.content?.cards) {
        flashcardData.content.cards.forEach((card: any, index: number) => {
          // Map to knowledge points in order
          mapping[card.id] = `kp-${index + 1}`
        })
      }
      
      return mapping
    } catch (error) {
      console.error('Failed to create flashcard mapping:', error)
      return this.createFallbackMapping(lessonId)
    }
  }
  
  /**
   * Create a fallback mapping when content files don't exist
   */
  private static async createFallbackMapping(lessonId: string): Promise<Record<string, string>> {
    try {
      console.log(`🔄 Creating fallback mapping for ${lessonId}...`)
      
      // Get lesson structure directly from course data to avoid circular dependency
      const lessonParts = lessonId.split('-')
      const courseId = `course-${lessonParts[1]}`
      
      console.log(`📚 Fetching course data for fallback mapping: /lms-data/courses/${courseId}.json`)
      const response = await fetch(`/lms-data/courses/${courseId}.json`)
      console.log(`📡 Fallback mapping fetch response:`, { 
        status: response.status, 
        ok: response.ok, 
        statusText: response.statusText 
      })
      
      if (!response.ok) {
        console.log(`❌ Failed to load course for fallback mapping: ${response.status} ${response.statusText}`)
        return {}
      }
      
      const courseData = await response.json()
      
      // Find the lesson in the course data
      let lessonData = null
      for (const chapter of courseData.chapters) {
        const lesson = chapter.lessons.find((l: any) => l.id === lessonId)
        if (lesson) {
          lessonData = lesson
          break
        }
      }
      
      if (!lessonData) {
        console.log(`❌ Lesson ${lessonId} not found for fallback mapping`)
        return {}
      }
      
      const mapping: Record<string, string> = {}
      const knowledgePointIds = lessonData.knowledgePoints.map((kp: any) => kp.id)
      console.log(`📋 Available knowledge point IDs:`, knowledgePointIds)
      
      // Create a simple mapping for flashcards - match the card ID format from game-launcher
      for (let i = 0; i < knowledgePointIds.length; i++) {
        mapping[`card-${i}`] = knowledgePointIds[i]
      }
      
      // Also create mappings for other game types
      for (let i = 0; i < 20; i++) { // For other games
        const kpIndex = i % knowledgePointIds.length
        mapping[`item-${i}`] = knowledgePointIds[kpIndex]
        mapping[`question-${i}`] = knowledgePointIds[kpIndex]
        mapping[`clue-${i}`] = knowledgePointIds[kpIndex]
        mapping[`pair-${i}`] = knowledgePointIds[kpIndex]
      }
      
      console.log(`🗺️ Created fallback mapping:`, mapping)
      return mapping
    } catch (error) {
      console.error('❌ Failed to create fallback mapping:', error)
      return {}
    }
  }

  private static async createMillionaireMapping(lessonId: string): Promise<Record<string, string>> {
    try {
      const response = await fetch(`/lms-data/content/lessons/${lessonId}/millionaire.json`)
      if (!response.ok) {
        return this.createFallbackMapping(lessonId)
      }
      
      const millionaireData = await response.json()
      const mapping: Record<string, string> = {}
      
      if (millionaireData.content?.questions) {
        millionaireData.content.questions.forEach((question: any, index: number) => {
          mapping[question.id] = `kp-${(index % 3) + 1}` // Cycle through KPs
        })
      }
      
      return mapping
    } catch (error) {
      console.error('Failed to create millionaire mapping:', error)
      return this.createFallbackMapping(lessonId)
    }
  }
  
  private static async createConnectCardsMapping(lessonId: string): Promise<Record<string, string>> {
    try {
      const response = await fetch(`/lms-data/content/lessons/${lessonId}/connect-cards.json`)
      if (!response.ok) {
        return this.createFallbackMapping(lessonId)
      }
      
      const connectCardsData = await response.json()
      const mapping: Record<string, string> = {}
      
      if (connectCardsData.content?.pairs) {
        connectCardsData.content.pairs.forEach((pair: any, index: number) => {
          mapping[pair.matchId] = `kp-${index + 1}`
        })
      }
      
      return mapping
    } catch (error) {
      console.error('Failed to create connect cards mapping:', error)
      return this.createFallbackMapping(lessonId)
    }
  }
  
  private static async createJeopardyMapping(lessonId: string): Promise<Record<string, string>> {
    try {
      const response = await fetch(`/lms-data/content/lessons/${lessonId}/jeopardy.json`)
      if (!response.ok) {
        return this.createFallbackMapping(lessonId)
      }
      
      const jeopardyData = await response.json()
      const mapping: Record<string, string> = {}
      
      if (jeopardyData.content?.categories) {
        jeopardyData.content.categories.forEach((category: any) => {
          category.clues?.forEach((clue: any, index: number) => {
            mapping[clue.id] = `kp-${(index % 3) + 1}` // Cycle through KPs
          })
        })
      }
      
      return mapping
    } catch (error) {
      console.error('Failed to create jeopardy mapping:', error)
      return this.createFallbackMapping(lessonId)
    }
  }
}

// Debug functions - remove the window assignments for now