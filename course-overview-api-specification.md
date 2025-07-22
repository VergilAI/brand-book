# Course Overview Page - API Specification

## Overview
API endpoints required for `/lms/new_course_overview` page functionality. All endpoints require authentication.

## Base URL
`https://api.yourdomain.com/v1`

---

## 1. Course Content

### GET /courses/:courseId
Retrieves complete course structure with user progress merged.

```json
Response:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "chapters": [{
    "id": "string",
    "title": "string",
    "testCompleted": boolean,
    "testScore": number|null,
    "lessons": [{
      "id": "string",
      "title": "string",
      "type": "written|video|audio|game",
      "completed": boolean,
      "estimatedTime": number (minutes),
      "knowledgePointIds": ["string"]
    }]
  }],
  "knowledgePoints": [{
    "id": "string",
    "name": "string",
    "proficiency": number (0-100),
    "dependencies": ["knowledgePointId"]
  }]
}
```

---

## 2. Progress Management

### PUT /courses/:courseId/lessons/:lessonId/progress
Updates lesson completion status and associated knowledge point proficiencies.

```json
Request:
{
  "completed": boolean,
  "timeSpent": number (seconds),
  "knowledgePointUpdates": [{
    "id": "string",
    "proficiency": number (0-100)
  }]
}

Response: 204 No Content
```

### POST /courses/:courseId/chapters/:chapterId/test-results
Records chapter test completion.

```json
Request:
{
  "score": number (0-100),
  "timeSpent": number (seconds)
}

Response: 204 No Content
```

---

## 3. Learning Content

### GET /lessons/:lessonId/content
Retrieves lesson content based on type.

```json
Query params: ?type=written|video|audio

Response for written:
{
  "type": "written",
  "content": {
    "html": "string",
    "estimatedReadTime": number (minutes)
  }
}

Response for video:
{
  "type": "video",
  "content": {
    "url": "string",
    "duration": number (seconds),
    "transcriptUrl": "string|null"
  }
}

Response for audio:
{
  "type": "audio",
  "content": {
    "url": "string",
    "duration": number (seconds),
    "transcriptUrl": "string|null"
  }
}
```

---

## 4. Game Content

### GET /lessons/:lessonId/games
Lists available games for a lesson.

```json
Response:
{
  "games": [{
    "id": "flashcards|millionaire|jeopardy|crossword",
    "title": "string",
    "description": "string",
    "available": boolean
  }]
}
```

### GET /lessons/:lessonId/games/:gameTypeId
Retrieves game-specific content.

```json
Response for flashcards:
{
  "type": "flashcards",
  "content": {
    "cards": [{
      "id": "string",
      "question": "string",
      "answer": "string",
      "knowledgePointId": "string"
    }]
  }
}

Response for millionaire/jeopardy:
{
  "type": "millionaire|jeopardy",
  "content": {
    "questions": [{
      "id": "string",
      "question": "string",
      "options": ["string"],
      "correctAnswer": number (index),
      "difficulty": number (1-5),
      "knowledgePointId": "string"
    }]
  }
}

Response for crossword:
{
  "type": "crossword",
  "content": {
    "grid": object,
    "clues": {
      "across": [{"number": number, "clue": "string", "answer": "string"}],
      "down": [{"number": number, "clue": "string", "answer": "string"}]
    }
  }
}
```

### POST /lessons/:lessonId/games/:gameTypeId/results
Submits game results and updates proficiencies.

```json
Request:
{
  "score": number,
  "timeSpent": number (seconds),
  "knowledgePointScores": [{
    "id": "string",
    "score": number (0-100)
  }],
  "gameData": object (game-specific data)
}

Response: 204 No Content
```

---

## 5. Learning Paths

### GET /knowledge-points/:knowledgePointId/learning-paths
Returns recommended learning paths to improve a knowledge point.

```json
Response:
{
  "paths": [{
    "difficulty": "easy|medium|hard",
    "estimatedTime": number (minutes),
    "steps": [{
      "type": "lesson|game",
      "lessonId": "string",
      "gameTypeId": "string|null",
      "title": "string",
      "expectedImprovement": number (0-100)
    }]
  }]
}
```

---

## 6. User Progress Overview

### GET /users/me/courses/:courseId/progress
Returns aggregated progress data for the course.

```json
Response:
{
  "overallProgress": number (0-100),
  "completedLessons": number,
  "totalLessons": number,
  "averageProficiency": number (0-100),
  "strongKnowledgePoints": ["knowledgePointId"],
  "weakKnowledgePoints": ["knowledgePointId"],
  "recommendedNext": {
    "lessonId": "string",
    "reason": "string"
  }
}
```

---

## Implementation Notes

1. **Progress Calculation**: 
   - Knowledge point proficiency should be calculated server-side based on all related activities
   - Use weighted averages based on activity type (games vs lessons)

2. **Content Versioning**: 
   - Support multiple content versions per lesson
   - Return appropriate version based on user preferences or A/B testing

3. **Real-time Updates**:
   - Consider WebSocket support for progress synchronization across devices
   - Emit events when user completes activities

4. **Caching**:
   - Course structure can be cached (changes infrequently)
   - User progress should not be cached
   - Game content can be cached per session

5. **Security**:
   - Validate all progress updates server-side
   - Ensure users can only update their own progress
   - Rate limit game submissions to prevent abuse