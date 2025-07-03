# Backend API Implementation Plan for New Course Overview

## Overview
This document outlines all the API endpoints required to support the new course overview page in the LMS module. The APIs are organized by functional area and include detailed specifications for request/response formats.

## Data Models

### Core Entities
Based on the TypeScript interfaces in `/lib/lms/new-course-types.ts`:

```typescript
interface KnowledgePoint {
  id: string
  title: string
  description: string
  proficiency: number // 0-100 percentage
}

interface Lesson {
  id: string
  title: string
  description: string
  knowledgePoints: KnowledgePoint[]
  availableGameTypes: string[] // IDs of available game types
  estimatedTime: number // in minutes
  completed: boolean
}

interface Chapter {
  id: string
  title: string
  description: string
  order: number
  progress: number // 0-100 percentage
  estimatedTime: string // human readable like "2 hours"
  testScore?: number | null // Test score percentage, null if not taken
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string
  totalLessons: number
  completedLessons: number
  progress: number // 0-100 percentage
  chapters: Chapter[]
}
```

## API Endpoints

### 1. Course Data APIs

#### GET /api/courses/:courseId
Fetches complete course data including all chapters, lessons, and knowledge points.

**Request:**
```
GET /api/courses/course-1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "course-1",
  "title": "AI Fundamentals",
  "description": "Comprehensive introduction to artificial intelligence...",
  "totalLessons": 28,
  "completedLessons": 12,
  "progress": 43,
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Introduction to Artificial Intelligence",
      "description": "Core AI concepts and foundational principles",
      "order": 1,
      "progress": 85,
      "estimatedTime": "2 hours",
      "testScore": 88,
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "What is Artificial Intelligence?",
          "description": "Overview of AI concepts, history, and applications",
          "knowledgePoints": [
            {
              "id": "kp-1",
              "title": "AI Definition",
              "description": "Understanding what artificial intelligence is",
              "proficiency": 85
            }
          ],
          "availableGameTypes": ["written-material", "video", "flashcards"],
          "estimatedTime": 30,
          "completed": false
        }
      ]
    }
  ]
}
```

### 2. Progress Tracking APIs

#### PUT /api/courses/:courseId/lessons/:lessonId/progress
Updates lesson completion status and knowledge point proficiencies.

**Request:**
```json
{
  "completed": true,
  "knowledgePointUpdates": [
    {
      "id": "kp-1",
      "proficiency": 95
    },
    {
      "id": "kp-2", 
      "proficiency": 80
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "updatedLesson": {
    "id": "lesson-1-1",
    "completed": true,
    "knowledgePoints": [...]
  },
  "updatedChapterProgress": 90,
  "updatedCourseProgress": 45
}
```

### 3. Game/Learning Activity APIs

#### GET /api/lessons/:lessonId/game-content/:gameTypeId
Fetches content for specific game types (flashcards, quiz questions, etc.).

**Request:**
```
GET /api/lessons/lesson-1-1/game-content/flashcards
Authorization: Bearer <token>
```

**Response for Flashcards:**
```json
{
  "gameType": "flashcards",
  "content": {
    "id": "deck-1",
    "title": "What is Artificial Intelligence?",
    "description": "Overview of AI concepts",
    "cards": [
      {
        "id": "card-1",
        "front": "AI Definition",
        "back": "Understanding what artificial intelligence is",
        "hint": "Think about machine intelligence",
        "difficulty": "easy"
      }
    ],
    "totalCards": 15,
    "estimatedTime": 10,
    "category": "AI Fundamentals"
  }
}
```

**Response for Millionaire Game:**
```json
{
  "gameType": "millionaire",
  "content": {
    "questions": [
      {
        "id": "q-1",
        "question": "What is Artificial Intelligence?",
        "answers": {
          "A": "The simulation of human intelligence in machines",
          "B": "A type of computer hardware",
          "C": "A programming language",
          "D": "A database system"
        },
        "correctAnswer": "A",
        "difficulty": 1
      }
    ]
  }
}
```

#### POST /api/lessons/:lessonId/game-results
Records game completion and updates knowledge point proficiencies.

**Request:**
```json
{
  "gameTypeId": "flashcards",
  "gameData": {
    "score": 85,
    "timeSpent": 600, // seconds
    "cardsReviewed": 15,
    "correctAnswers": 13
  },
  "knowledgePointScores": [
    {
      "id": "kp-1",
      "score": 90
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "updatedProficiencies": [
    {
      "id": "kp-1",
      "oldProficiency": 85,
      "newProficiency": 88
    }
  ],
  "achievements": ["First Game Completed", "Knowledge Master"],
  "nextRecommendedGame": "millionaire"
}
```

### 4. Learning Path APIs

#### GET /api/knowledge-points/:knowledgePointId/learning-paths
Gets all lessons where a specific knowledge point can be learned.

**Request:**
```
GET /api/knowledge-points/kp-1/learning-paths
Authorization: Bearer <token>
```

**Response:**
```json
{
  "knowledgePointId": "kp-1",
  "learningPaths": [
    {
      "lessonId": "lesson-1-1",
      "lessonTitle": "What is Artificial Intelligence?",
      "chapterTitle": "Introduction to AI",
      "gameTypes": ["written-material", "video", "flashcards"]
    },
    {
      "lessonId": "lesson-1-2",
      "lessonTitle": "Search and Problem Solving",
      "chapterTitle": "Introduction to AI", 
      "gameTypes": ["flashcards", "case-study"]
    }
  ]
}
```

### 5. Assessment/Test APIs

#### GET /api/chapters/:chapterId/test
Gets test questions for a chapter assessment.

**Request:**
```
GET /api/chapters/chapter-1/test
Authorization: Bearer <token>
```

**Response:**
```json
{
  "chapterId": "chapter-1",
  "chapterTitle": "Introduction to Artificial Intelligence",
  "testId": "test-chapter-1",
  "questions": [
    {
      "id": "test-q-1",
      "type": "multiple-choice",
      "question": "What is the primary goal of AI?",
      "options": ["A", "B", "C", "D"],
      "knowledgePointId": "kp-1"
    }
  ],
  "timeLimit": 3600, // seconds
  "passingScore": 70
}
```

#### POST /api/chapters/:chapterId/test/submit
Submits chapter test results.

**Request:**
```json
{
  "testId": "test-chapter-1",
  "answers": [
    {
      "questionId": "test-q-1",
      "answer": "A"
    }
  ],
  "timeSpent": 2400
}
```

**Response:**
```json
{
  "score": 88,
  "passed": true,
  "correctAnswers": 22,
  "totalQuestions": 25,
  "knowledgePointResults": [
    {
      "id": "kp-1",
      "score": 90,
      "proficiencyUpdated": true
    }
  ]
}
```

### 6. Content Delivery APIs

#### GET /api/lessons/:lessonId/content/:contentType
Fetches lesson content for different formats (written, video, audio).

**Request:**
```
GET /api/lessons/lesson-1-1/content/written-material
Authorization: Bearer <token>
```

**Response for Written Material:**
```json
{
  "contentType": "written-material",
  "content": {
    "format": "pdf",
    "url": "https://cdn.example.com/lessons/lesson-1-1/material.pdf",
    "pages": 15,
    "estimatedReadTime": 30
  }
}
```

**Response for Video:**
```json
{
  "contentType": "video",
  "content": {
    "format": "mp4",
    "url": "https://cdn.example.com/lessons/lesson-1-1/video.mp4",
    "duration": 420, // seconds
    "chapters": [
      {
        "title": "Introduction",
        "startTime": 0,
        "endTime": 60
      }
    ],
    "transcriptUrl": "https://cdn.example.com/lessons/lesson-1-1/transcript.vtt"
  }
}
```

**Response for Audio:**
```json
{
  "contentType": "audio",
  "content": {
    "format": "mp3",
    "url": "https://cdn.example.com/lessons/lesson-1-1/audio.mp3",
    "duration": 600,
    "chapters": [
      {
        "id": 1,
        "title": "Introduction",
        "start": 0,
        "duration": 120,
        "summary": "Overview of the lesson"
      }
    ]
  }
}
```

### 7. Analytics APIs

#### GET /api/users/:userId/knowledge-analytics
Gets comprehensive knowledge point analytics for a user.

**Request:**
```
GET /api/users/current/knowledge-analytics?courseId=course-1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalKnowledgePoints": 50,
  "masteredCount": 20,
  "inProgressCount": 15,
  "notStartedCount": 15,
  "averageProficiency": 58,
  "recentProgress": [
    {
      "date": "2024-01-15",
      "knowledgePointsImproved": 5,
      "averageImprovement": 15
    }
  ],
  "recommendedFocus": [
    {
      "knowledgePointId": "kp-6",
      "title": "Optimization",
      "currentProficiency": 40,
      "lessonsAvailable": 3
    }
  ]
}
```

## Authentication & Authorization

All endpoints require authentication via JWT tokens in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

The token should contain:
- User ID
- Role (student, instructor, admin)
- Course enrollment status

## Error Responses

Standard error format:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Course not found",
    "details": {
      "courseId": "course-1"
    }
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Invalid or missing token
- `FORBIDDEN` - User lacks permission
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `VALIDATION_ERROR` - Invalid request data
- `INTERNAL_ERROR` - Server error

## Implementation Notes

1. **Caching Strategy:**
   - Course structure data should be cached (1 hour TTL)
   - User progress data should not be cached
   - Game content can be cached (24 hour TTL)

2. **Real-time Updates:**
   - Consider WebSocket connections for real-time progress updates
   - Useful for collaborative features or instructor monitoring

3. **Batch Operations:**
   - Consider batch endpoints for updating multiple knowledge points
   - Useful for game results that affect multiple points

4. **Rate Limiting:**
   - Game result submissions: 1 per minute per lesson
   - Progress updates: 10 per minute
   - Content fetching: 100 per hour

5. **Data Consistency:**
   - Use transactions for progress updates
   - Ensure chapter/course progress is recalculated on lesson updates
   - Validate proficiency scores (0-100 range)

## Next Steps

1. Set up backend framework (Node.js/Express, Python/FastAPI, etc.)
2. Design database schema (PostgreSQL recommended)
3. Implement authentication system
4. Create API endpoints following RESTful conventions
5. Add request validation and error handling
6. Implement caching layer (Redis)
7. Set up CDN for content delivery
8. Add monitoring and logging
9. Create API documentation (Swagger/OpenAPI)
10. Implement rate limiting and security measures