# LMS New Course Overview API Specification

## Overview
The `/lms/new_course_overview` page requires a set of APIs to manage course data, user progress, game content, and learning activities. The page displays course structure, tracks learning progress, and provides access to various learning games.

## API Endpoints

### 1. Course Data API

#### GET /api/courses/{courseId}
Retrieves complete course structure and metadata.

**Parameters:**
- `courseId` (string): Unique identifier for the course (e.g., "ai-fundamentals")

**Response:**
```json
{
  "id": "ai-fundamentals",
  "title": "AI Fundamentals",
  "description": "Learn the basics of artificial intelligence...",
  "totalLessons": 12,
  "completedLessons": 3,
  "progress": 25,
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Introduction to AI",
      "description": "Understanding what AI is...",
      "order": 1,
      "progress": 45,
      "estimatedTime": "2 hours",
      "testScore": null,
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "What is AI?",
          "description": "Introduction to artificial intelligence",
          "knowledgePoints": [
            {
              "id": "kp-1",
              "title": "AI Definition",
              "description": "Understanding what artificial intelligence is",
              "proficiency": 75
            }
          ],
          "availableGameTypes": ["flashcards", "millionaire", "jeopardy"],
          "estimatedTime": 30,
          "completed": false
        }
      ]
    }
  ]
}
```

### 2. User Progress API

#### GET /api/users/{userId}/courses/{courseId}/progress
Retrieves user-specific progress data for a course.

**Parameters:**
- `userId` (string): User identifier
- `courseId` (string): Course identifier

**Response:**
```json
{
  "courseId": "ai-fundamentals",
  "userId": "user-123",
  "overallProgress": 25,
  "lessons": {
    "lesson-1-1": {
      "completed": false,
      "knowledgePoints": [
        {
          "id": "kp-1",
          "proficiency": 75
        }
      ],
      "lastAccessed": "2024-01-15T10:30:00Z"
    }
  },
  "chapterTestScores": {
    "chapter-1": 85,
    "chapter-2": null
  },
  "gameHistory": [
    {
      "lessonId": "lesson-1-1",
      "gameTypeId": "flashcards",
      "timestamp": "2024-01-15T10:30:00Z",
      "score": 85,
      "timeSpent": 600
    }
  ]
}
```

#### PUT /api/users/{userId}/courses/{courseId}/lessons/{lessonId}/progress
Updates progress for a specific lesson.

**Request Body:**
```json
{
  "completed": true,
  "knowledgePointUpdates": [
    {
      "id": "kp-1",
      "proficiency": 85
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
  "updatedChapterProgress": 65,
  "updatedCourseProgress": 30
}
```

### 3. Game Content API

#### GET /api/game-content/{lessonId}/{gameTypeId}
Retrieves game-specific content for a lesson.

**Parameters:**
- `lessonId` (string): Lesson identifier
- `gameTypeId` (string): Game type (e.g., "flashcards", "millionaire", "jeopardy")

**Query Parameters:**
- `version` (string, optional): Specific content version
- `difficulty` (string, optional): "easy", "medium", "hard"

**Response Example (Flashcards):**
```json
{
  "gameType": "flashcards",
  "content": {
    "id": "deck-lesson-1-1",
    "title": "AI Basics Flashcards",
    "description": "Review key AI concepts",
    "cards": [
      {
        "id": "card-1",
        "front": "What does AI stand for?",
        "back": "Artificial Intelligence",
        "hint": "Think about machines that can think",
        "category": "Definitions",
        "difficulty": "easy",
        "knowledgePointId": "kp-1"
      }
    ],
    "totalCards": 15,
    "estimatedTime": 10,
    "category": "AI Basics"
  }
}
```

**Response Example (Jeopardy):**
```json
{
  "gameType": "jeopardy",
  "content": {
    "categories": [
      {
        "name": "AI Basics",
        "questions": [
          {
            "id": "q-1",
            "value": 200,
            "question": "This test determines if a machine can exhibit intelligent behavior",
            "answer": "Turing Test",
            "knowledgePointId": "kp-1"
          }
        ]
      }
    ],
    "dailyDouble": {
      "categoryIndex": 2,
      "questionIndex": 3
    }
  }
}
```

#### POST /api/game-results
Submits game completion results.

**Request Body:**
```json
{
  "lessonId": "lesson-1-1",
  "gameTypeId": "flashcards",
  "gameData": {
    "score": 85,
    "timeSpent": 600,
    "cardsCompleted": 15,
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
      "oldProficiency": 75,
      "newProficiency": 82
    }
  ],
  "achievements": ["Perfect Score!", "Knowledge Master"],
  "nextRecommendedGame": "millionaire"
}
```

### 4. Learning Path API

#### GET /api/knowledge-points/{knowledgePointId}/learning-paths
Retrieves recommended learning paths for a knowledge point.

**Parameters:**
- `knowledgePointId` (string): Knowledge point identifier

**Response:**
```json
{
  "knowledgePointId": "kp-1",
  "learningPaths": [
    {
      "pathId": "path-1",
      "name": "Visual Learning Path",
      "description": "Learn through videos and diagrams",
      "recommendedGames": ["video", "crossword", "matching"],
      "estimatedTime": 45
    },
    {
      "pathId": "path-2",
      "name": "Interactive Learning Path",
      "description": "Learn through hands-on activities",
      "recommendedGames": ["territory-conquest", "escape-room", "debate"],
      "estimatedTime": 60
    }
  ]
}
```

### 5. Content Delivery API

#### GET /api/content/{lessonId}/{contentType}
Retrieves lesson content for different media types.

**Parameters:**
- `lessonId` (string): Lesson identifier
- `contentType` (string): "written-material", "video", "audio", "user-content"

**Response Example (Written Material):**
```json
{
  "contentType": "written-material",
  "content": {
    "format": "html",
    "pages": [
      {
        "pageNumber": 1,
        "content": "<h1>Introduction to AI</h1><p>Artificial Intelligence is...</p>",
        "images": ["image1.jpg", "image2.jpg"]
      }
    ],
    "estimatedReadTime": 10,
    "totalPages": 5,
    "references": [
      {
        "title": "AI: A Modern Approach",
        "author": "Stuart Russell",
        "url": "https://example.com"
      }
    ]
  }
}
```

**Response Example (Video):**
```json
{
  "contentType": "video",
  "content": {
    "format": "mp4",
    "url": "https://cdn.example.com/videos/ai-intro.mp4",
    "thumbnailUrl": "https://cdn.example.com/thumbnails/ai-intro.jpg",
    "duration": 300,
    "chapters": [
      {
        "title": "What is AI?",
        "startTime": 0,
        "endTime": 120
      }
    ],
    "captions": {
      "en": "https://cdn.example.com/captions/ai-intro-en.vtt"
    }
  }
}
```

### 6. Analytics API

#### POST /api/analytics/events
Tracks user interactions and learning events.

**Request Body:**
```json
{
  "userId": "user-123",
  "courseId": "ai-fundamentals",
  "eventType": "lesson_started",
  "eventData": {
    "lessonId": "lesson-1-1",
    "gameTypeId": "flashcards",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Event Types:**
- `lesson_started`
- `lesson_completed`
- `game_started`
- `game_completed`
- `knowledge_point_mastered`
- `chapter_test_completed`

### 7. Recommendation API

#### GET /api/users/{userId}/courses/{courseId}/recommendations
Gets personalized learning recommendations.

**Response:**
```json
{
  "nextLesson": {
    "lessonId": "lesson-1-2",
    "reason": "Continue with the next lesson in sequence"
  },
  "recommendedGames": [
    {
      "lessonId": "lesson-1-1",
      "gameTypeId": "millionaire",
      "reason": "Reinforce knowledge points with 60-80% proficiency"
    }
  ],
  "reviewSuggestions": [
    {
      "knowledgePointId": "kp-3",
      "proficiency": 45,
      "suggestedGames": ["flashcards", "video"]
    }
  ]
}
```

## Error Handling

All APIs should return consistent error responses:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Course not found",
    "details": {
      "courseId": "invalid-course-id"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Codes:**
- `RESOURCE_NOT_FOUND` (404)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `VALIDATION_ERROR` (400)
- `SERVER_ERROR` (500)

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Rate Limiting

- 100 requests per minute for content retrieval endpoints
- 50 requests per minute for progress update endpoints
- 10 requests per minute for analytics endpoints

## Caching Strategy

- Course structure: Cache for 1 hour
- User progress: No caching (real-time updates)
- Game content: Cache for 24 hours with version parameter
- Learning paths: Cache for 1 week
- Static content (written/video/audio): Cache for 30 days

## WebSocket Events

For real-time updates, the following WebSocket events are available:

- `courseProgressUpdated`: Fired when any progress changes
- `achievementUnlocked`: Fired when user unlocks an achievement
- `lessonCompleted`: Fired when a lesson is completed
- `knowledgePointMastered`: Fired when proficiency reaches 80%

## Current Implementation Status

Currently, the application uses a client-side mock API implementation that:
- Loads data from JSON files in the `/public/lms-data` directory
- Stores user progress in localStorage
- Simulates API responses with realistic data structures
- Supports multiple content versions for variety
- Emits custom DOM events for real-time updates

This specification provides all the necessary endpoints for the `/lms/new_course_overview` page to function with full course management, progress tracking, game content delivery, and learning analytics capabilities.