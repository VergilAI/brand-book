import { Course, Chapter, Lesson, KnowledgePoint } from '@/lib/lms/new-course-types'
import { gameAPI } from '@/lib/api/game-api'
import { recommendationsAPI } from '@/lib/api/recommendations-api'

// Base path for data files in public directory
const DATA_BASE_PATH = '/lms-data'

// Feature flag to use backend API
const USE_BACKEND_API = process.env.NEXT_PUBLIC_USE_BACKEND_API === 'true'

// Helper function to load JSON data
async function loadJSON<T>(path: string): Promise<T | null> {
  try {
    // Add cache-busting parameter to ensure we get fresh content
    const cacheBuster = `?v=${Date.now()}&nocache=true`
    const fullPath = `${path}${cacheBuster}`
    console.log(`🌐 Fetching: ${fullPath}`)
    const response = await fetch(fullPath, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    console.log(`📡 Response status: ${response.status} for ${path}`)
    
    // Handle 404s gracefully - they're expected for version files
    if (response.status === 404) {
      console.log(`📄 File not found (404): ${path} - this is expected for non-existent versions`)
      return null
    }
    
    if (!response.ok) {
      console.error(`❌ Failed to load data from ${path} (Status: ${response.status} ${response.statusText})`)
      return null
    }
    
    // Check if response is actually JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.log(`⚠️ Response is not JSON for ${path}, content-type: ${contentType}`)
      return null
    }
    
    const data = await response.json()
    console.log(`📋 Response data preview:`, {
      hasContent: !!data?.content,
      contentType: data?.contentType,
      title: data?.content?.title,
      pagesCount: data?.content?.pages?.length
    })
    return data
  } catch (error) {
    console.error(`❌ Error loading JSON from ${path}:`, error)
    return null
  }
}

// Helper function to save JSON data (for client-side state persistence)
function saveToLocalStorage(key: string, data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// Helper function to load from localStorage
function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  return null
}

// Course Data APIs
export const courseAPI = {
  // Get course by ID
  async getCourse(courseId: string): Promise<Course> {
    console.log(`🏗️ Loading course ${courseId}...`)
    
    // Use backend API if enabled
    if (USE_BACKEND_API) {
      try {
        // Fetch from backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/courses/${courseId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.status} ${response.statusText}`)
        }
        
        const courseData = await response.json()
        console.log('📥 Raw backend response:', courseData)
        
        // Transform backend response to match frontend Course type
        const transformedCourse: Course = {
          id: String(courseData.id),
          title: courseData.title || courseData.name || '',
          description: courseData.description || '',
          category: courseData.category || 'technology',
          difficulty: courseData.difficulty || 'intermediate',
          duration: (courseData.totalLessons || courseData.total_lessons || 0) * 30, // Estimate based on lessons
          progress: courseData.progress || 0,
          totalLessons: courseData.totalLessons || courseData.total_lessons || 0,
          completedLessons: courseData.completedLessons || courseData.completed_lessons || 0,
          chapters: (courseData.chapters || []).map((chapter: any) => ({
            id: String(chapter.id),
            title: chapter.title || chapter.name || '',
            description: chapter.description || '',
            order: chapter.order || 0,
            progress: chapter.progress || 0,
            estimatedTime: chapter.estimatedTime || chapter.estimated_time || '2 hours',
            testScore: chapter.testScore || chapter.test_score || undefined,
            lessons: (chapter.lessons || []).map((lesson: any) => {
              console.log(`📝 Processing lesson ${lesson.id}:`, lesson)
              return {
                id: String(lesson.id),
                title: lesson.title || lesson.name || '',
                description: lesson.description || '',
                estimatedTime: lesson.estimatedTime || 30,
                completed: lesson.completed || false,
                availableGameTypes: lesson.availableGameTypes || ['millionaire', 'jeopardy', 'flashcards', 'connect-cards'],
                knowledgePoints: (lesson.knowledgePoints || lesson.knowledge_points || []).map((kp: any) => ({
                  id: String(kp.id),
                  title: kp.title || kp.name || '',
                  description: kp.description || '',
                  proficiency: kp.proficiency || 0
                }))
              }
            })
          }))
        }
        
        console.log(`✅ Course loaded from backend API for ${courseId}`)
        return transformedCourse
      } catch (error) {
        console.error('Error loading course from backend:', error)
        throw error
      }
    }
    
    // First check if we have user progress that modifies the course data
    const userProgress = loadFromLocalStorage<any>(`user-progress-${courseId}`)
    console.log(`👤 User progress for ${courseId}:`, userProgress)
    
    // Load base course data
    const course = await loadJSON<Course>(`${DATA_BASE_PATH}/courses/${courseId}.json`)
    
    if (!course) {
      console.error(`❌ Failed to load course ${courseId}`)
      throw new Error(`Course ${courseId} not found`)
    }
    
    console.log(`📚 Base course data loaded for ${courseId}`)
    
    // Log the base proficiencies before merge
    if (course?.chapters?.[0]?.lessons?.[0]?.knowledgePoints) {
      console.log(`📊 BEFORE MERGE - Base knowledge point proficiencies:`)
      course.chapters[0].lessons[0].knowledgePoints.forEach(kp => {
        console.log(`  📈 ${kp.id} (${kp.title}): ${kp.proficiency}%`)
      })
    }
    
    // If we have user progress, merge it with the course data
    if (userProgress && course) {
      console.log(`🔀 Merging user progress with course data...`)
      const mergedCourse = mergeCourseWithProgress(course, userProgress)
      console.log(`✅ Course merged with progress for ${courseId}`)
      
      // Log the merged proficiencies
      if (mergedCourse?.chapters?.[0]?.lessons?.[0]?.knowledgePoints) {
        console.log(`📊 AFTER MERGE - Final knowledge point proficiencies:`)
        mergedCourse.chapters[0].lessons[0].knowledgePoints.forEach(kp => {
          console.log(`  📈 ${kp.id} (${kp.title}): ${kp.proficiency}%`)
        })
      }
      
      return mergedCourse
    }
    
    console.log(`📖 Returning base course data (no user progress)`)
    return course
  },

  // Update lesson progress
  async updateLessonProgress(
    courseId: string,
    lessonId: string,
    data: {
      completed?: boolean
      knowledgePointUpdates?: Array<{ id: string; proficiency: number }>
    }
  ): Promise<{
    success: boolean
    updatedLesson: Lesson
    updatedChapterProgress: number
    updatedCourseProgress: number
  }> {
    // Use backend API if enabled
    if (USE_BACKEND_API) {
      try {
        // Get current user ID (this would come from auth context in real app)
        const userId = 'current-user' // Placeholder
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/users/${userId}/courses/${courseId}/lessons/${lessonId}/progress`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              completed: data.completed,
              knowledgePointUpdates: data.knowledgePointUpdates
            })
          }
        )
        
        if (!response.ok) {
          throw new Error(`Failed to update lesson progress: ${response.status} ${response.statusText}`)
        }
        
        const result = await response.json()
        
        return {
          success: result.success,
          updatedLesson: result.updatedLesson,
          updatedChapterProgress: result.updatedChapterProgress,
          updatedCourseProgress: result.updatedCourseProgress
        }
      } catch (error) {
        console.error('Error updating lesson progress:', error)
        throw error
      }
    }
    // Get current course data
    const course = await this.getCourse(courseId)
    
    // Find and update the lesson
    let updatedLesson: Lesson | null = null
    let chapterId: string | null = null
    
    for (const chapter of course.chapters) {
      const lessonIndex = chapter.lessons.findIndex(l => l.id === lessonId)
      if (lessonIndex !== -1) {
        chapterId = chapter.id
        updatedLesson = { ...chapter.lessons[lessonIndex] }
        
        // Update completion status
        if (data.completed !== undefined) {
          updatedLesson.completed = data.completed
        }
        
        // Update knowledge point proficiencies
        if (data.knowledgePointUpdates) {
          updatedLesson.knowledgePoints = updatedLesson.knowledgePoints.map(kp => {
            const update = data.knowledgePointUpdates!.find(u => u.id === kp.id)
            return update ? { ...kp, proficiency: update.proficiency } : kp
          })
        }
        
        // Update the lesson in the chapter
        chapter.lessons[lessonIndex] = updatedLesson
        break
      }
    }
    
    if (!updatedLesson || !chapterId) {
      throw new Error('Lesson not found')
    }
    
    // Recalculate progress
    const { chapterProgress, courseProgress } = recalculateProgress(course)
    
    // Save updated progress to localStorage
    const userProgress = loadFromLocalStorage<any>(`user-progress-${courseId}`) || {}
    userProgress.lessons = userProgress.lessons || {}
    userProgress.lessons[lessonId] = {
      completed: updatedLesson.completed,
      knowledgePoints: updatedLesson.knowledgePoints
    }
    saveToLocalStorage(`user-progress-${courseId}`, userProgress)
    
    return {
      success: true,
      updatedLesson,
      updatedChapterProgress: chapterProgress[chapterId],
      updatedCourseProgress: courseProgress
    }
  }
}

// Game Content APIs
export const gameContentAPI = {
  // Get game content for a lesson
  async getGameContent(lessonId: string, gameTypeId: string): Promise<any> {
    // Use backend API if enabled
    if (USE_BACKEND_API) {
      try {
        const gameTypeNumber = gameAPI.getGameTypeId(gameTypeId)
        const content = await gameAPI.getGameContent(lessonId, gameTypeNumber)
        
        // Transform content based on game type
        switch (gameTypeId) {
          case 'millionaire':
            return {
              gameType: 'millionaire',
              content: {
                questions: gameAPI.transformMillionaireQuestions(
                  (content as any).questions
                )
              }
            }
          case 'jeopardy':
            return {
              gameType: 'jeopardy',
              content: gameAPI.transformJeopardyCategories(
                (content as any).categories
              )
            }
          case 'flashcards':
            return {
              gameType: 'flashcards',
              content: gameAPI.transformFlashcards(
                (content as any).cards
              )
            }
          case 'connect-cards':
            return {
              gameType: 'connect-cards',
              content: gameAPI.transformConnectCardPairs(
                (content as any).pairs
              )
            }
          default:
            throw new Error(`Unknown game type: ${gameTypeId}`)
        }
      } catch (error) {
        console.error('Error loading game content from backend:', error)
        // Fall back to local data
      }
    }
    
    // Original local file loading logic
    try {
      // Try to load multiple versions and select one randomly
      const versions = ['', '-v2', '-v3', '-v4']
      const availableVersions = []
      
      for (const version of versions) {
        const content = await loadJSON<any>(`${DATA_BASE_PATH}/game-content/${lessonId}-${gameTypeId}${version}.json`)
        if (content) {
          availableVersions.push(content)
        }
      }
      
      if (availableVersions.length > 0) {
        // Return a random version
        const randomIndex = Math.floor(Math.random() * availableVersions.length)
        return availableVersions[randomIndex]
      }
      
      // Return generated content if no specific content file exists
      return generateGameContent(lessonId, gameTypeId)
    } catch (error) {
      // Return generated content if no specific content file exists
      return generateGameContent(lessonId, gameTypeId)
    }
  },

  // Submit game results
  async submitGameResults(
    lessonId: string,
    data: {
      gameTypeId: string
      gameData: any
      knowledgePointScores: Array<{ id: string; score: number }>
    }
  ): Promise<{
    success: boolean
    updatedProficiencies: Array<{
      id: string
      oldProficiency: number
      newProficiency: number
    }>
    achievements: string[]
    nextRecommendedGame: string
  }> {
    // Load current user progress
    const userProgress = loadFromLocalStorage<any>('user-progress') || {}
    const lessonProgress = userProgress.lessons?.[lessonId] || {}
    
    // Calculate new proficiencies (simple average with existing)
    const updatedProficiencies = data.knowledgePointScores.map(score => {
      const currentProficiency = lessonProgress.knowledgePoints?.find((kp: any) => kp.id === score.id)?.proficiency || 0
      const newProficiency = Math.min(100, Math.round((currentProficiency + score.score) / 2))
      
      return {
        id: score.id,
        oldProficiency: currentProficiency,
        newProficiency
      }
    })
    
    // Check for achievements
    const achievements = []
    if (data.gameData.score >= 90) achievements.push('Perfect Score!')
    if (updatedProficiencies.some(p => p.newProficiency >= 80 && p.oldProficiency < 80)) {
      achievements.push('Knowledge Master')
    }
    
    // Determine next recommended game based on proficiency
    const avgProficiency = updatedProficiencies.reduce((sum, p) => sum + p.newProficiency, 0) / updatedProficiencies.length
    const nextRecommendedGame = avgProficiency < 60 ? 'flashcards' : avgProficiency < 80 ? 'millionaire' : 'jeopardy'
    
    // Save game history
    userProgress.gameHistory = userProgress.gameHistory || []
    userProgress.gameHistory.push({
      lessonId,
      gameTypeId: data.gameTypeId,
      timestamp: new Date().toISOString(),
      score: data.gameData.score,
      timeSpent: data.gameData.timeSpent
    })
    
    saveToLocalStorage('user-progress', userProgress)
    
    return {
      success: true,
      updatedProficiencies,
      achievements,
      nextRecommendedGame
    }
  }
}

// Learning Path APIs
export const learningPathAPI = {
  // Get learning paths for a knowledge point
  async getLearningPaths(knowledgePointId: string): Promise<any> {
    const paths = await loadJSON<any>(`${DATA_BASE_PATH}/knowledge-learning-paths.json`)
    return {
      knowledgePointId,
      learningPaths: paths[knowledgePointId] || []
    }
  }
}

// Content Delivery APIs
export const contentAPI = {
  // Get lesson content
  async getLessonContent(lessonId: string, contentType: string): Promise<any> {
    // Use backend API if enabled and content type is written material
    if (USE_BACKEND_API && contentType === 'written-material') {
      try {
        const response = await gameAPI.getWrittenMaterial(lessonId)
        return gameAPI.transformWrittenMaterial(response)
      } catch (error) {
        console.error('Error loading written material from backend:', error)
        // Fall back to local data
      }
    }
    
    // Original local file loading logic
    try {
      // Try to load multiple versions and select one randomly
      const versions = ['', '-v2', '-v3', '-v4']
      const availableVersions = []
      
      console.log(`Attempting to load content for ${lessonId} - ${contentType}`)
      
      for (const version of versions) {
        const path = `${DATA_BASE_PATH}/content/${lessonId}-${contentType}${version}.json`
        console.log(`Trying to load: ${path}`)
        const content = await loadJSON<any>(path)
        if (content) {
          availableVersions.push(content)
          console.log(`Successfully loaded version: ${version || 'default'}`)
        } else {
          console.log(`Version ${version || 'default'} not found (this is normal if version doesn't exist)`)
        }
      }
      
      if (availableVersions.length > 0) {
        // Return a random version
        const randomIndex = Math.floor(Math.random() * availableVersions.length)
        console.log(`Returning version ${randomIndex + 1} of ${availableVersions.length}`)
        return availableVersions[randomIndex]
      }
      
      console.log('No content files found, returning default content')
      // Return default content if specific content doesn't exist
      return getDefaultContent(lessonId, contentType)
    } catch (error) {
      console.error('Error loading content:', error)
      // Return default content if specific content doesn't exist
      return getDefaultContent(lessonId, contentType)
    }
  }
}

// Helper functions
function mergeCourseWithProgress(course: Course, userProgress: any): Course {
  console.log(`🔀 mergeCourseWithProgress called with:`, { course: course.id, userProgress })
  const mergedCourse = { ...course }
  
  // Update lesson progress from user data
  if (userProgress.lessons) {
    console.log(`📝 Found lesson progress for ${Object.keys(userProgress.lessons).length} lessons`)
    
    for (const chapter of mergedCourse.chapters) {
      for (const lesson of chapter.lessons) {
        const lessonProgress = userProgress.lessons[lesson.id]
        if (lessonProgress) {
          console.log(`🎯 Merging progress for lesson ${lesson.id}:`, lessonProgress)
          
          lesson.completed = lessonProgress.completed || false
          if (lessonProgress.knowledgePoints) {
            console.log(`📊 Updating ${lessonProgress.knowledgePoints.length} knowledge points for lesson ${lesson.id}`)
            
            lesson.knowledgePoints = lesson.knowledgePoints.map(kp => {
              const progressKp = lessonProgress.knowledgePoints.find((pk: any) => pk.id === kp.id)
              if (progressKp) {
                console.log(`📈 KP ${kp.id}: ${kp.proficiency}% → ${progressKp.proficiency}%`)
                return { 
                  ...kp, 
                  proficiency: progressKp.proficiency || kp.proficiency
                }
              }
              return kp
            })
          }
        }
      }
    }
  } else {
    console.log(`ℹ️ No lesson progress found in user data`)
  }
  
  // Recalculate all progress values
  const { chapterProgress, courseProgress, completedLessons } = recalculateProgress(mergedCourse)
  
  // Update chapter progress
  for (const chapter of mergedCourse.chapters) {
    chapter.progress = chapterProgress[chapter.id]
    if (userProgress.chapterTestScores?.[chapter.id]) {
      chapter.testScore = userProgress.chapterTestScores[chapter.id]
    }
  }
  
  // Update course progress
  mergedCourse.progress = courseProgress
  mergedCourse.completedLessons = completedLessons
  
  return mergedCourse
}

function recalculateProgress(course: Course): {
  chapterProgress: Record<string, number>
  courseProgress: number
  completedLessons: number
} {
  const chapterProgress: Record<string, number> = {}
  let totalProgress = 0
  let completedLessons = 0
  
  for (const chapter of course.chapters) {
    let chapterTotal = 0
    let chapterCompleted = 0
    
    for (const lesson of chapter.lessons) {
      if (lesson.completed) {
        completedLessons++
        chapterCompleted++
      }
      
      // Calculate average knowledge point proficiency for the lesson
      const avgProficiency = lesson.knowledgePoints.reduce((sum, kp) => sum + kp.proficiency, 0) / lesson.knowledgePoints.length
      chapterTotal += avgProficiency
    }
    
    // Chapter progress is average of all lesson proficiencies
    chapterProgress[chapter.id] = Math.round(chapterTotal / chapter.lessons.length)
    totalProgress += chapterProgress[chapter.id]
  }
  
  // Course progress is average of all chapter progress
  const courseProgress = Math.round(totalProgress / course.chapters.length)
  
  return { chapterProgress, courseProgress, completedLessons }
}

function generateGameContent(lessonId: string, gameTypeId: string): any {
  // Generate default game content based on game type
  switch (gameTypeId) {
    case 'flashcards':
      return {
        gameType: 'flashcards',
        content: {
          id: `deck-${lessonId}`,
          title: 'Lesson Flashcards',
          description: 'Review key concepts from this lesson',
          cards: [],
          totalCards: 0,
          estimatedTime: 10,
          category: 'General'
        }
      }
    case 'millionaire':
      return {
        gameType: 'millionaire',
        content: {
          questions: []
        }
      }
    default:
      return {
        gameType: gameTypeId,
        content: {}
      }
  }
}

function getDefaultContent(lessonId: string, contentType: string): any {
  switch (contentType) {
    case 'written-material':
      return {
        contentType: 'written-material',
        content: {
          format: 'html',
          pages: [{
            pageNumber: 1,
            content: '<h1>Lesson Content</h1><p>Content is being prepared...</p>'
          }],
          estimatedReadTime: 10,
          totalPages: 1
        }
      }
    case 'video':
      return {
        contentType: 'video',
        content: {
          format: 'mp4',
          url: '',
          duration: 300,
          chapters: []
        }
      }
    case 'audio':
      return {
        contentType: 'audio',
        content: {
          format: 'mp3',
          url: '',
          duration: 600,
          chapters: []
        }
      }
    default:
      return { contentType, content: {} }
  }
}

// Debug functions - remove the window assignments for now