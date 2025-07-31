# Backend Integration Implementation Plan

## Overview
This document outlines the plan to integrate the LMS Brand Book frontend with the backend API endpoints specified in API_DOCUMENTATION.md.

## Current State Analysis

### ✅ Authentication (Already Implemented)
- **Location**: `/lib/api/auth.ts`
- **Status**: Authentication is already properly integrated with backend endpoints
- **Endpoints covered**:
  - POST `/auth/register`
  - POST `/auth/login`
  - POST `/auth/refresh`
  - GET `/auth/me`
- **Token Management**: Using localStorage for access_token and refresh_token
- **User State**: Storing user object in localStorage

### 🎮 Game System (Local Mock Data)
- **Location**: `/app/lms/new_course_overview/api/course-api.ts`
- **Status**: Currently using local JSON files from `/public/lms-data/`
- **Components**:
  - Written Material viewer
  - Audio Material player
  - Video Material player
  - Flashcard Game
  - Millionaire Game
  - Jeopardy Game
  - Connect Cards Game
  - AI Chat Game

## Implementation Plan

### Phase 1: API Client Infrastructure

#### 1.1 Create Base API Client
```typescript
// /lib/api/base-client.ts
- Create base HTTP client with:
  - Authentication header injection
  - Error handling
  - Token refresh logic
  - Request/response interceptors
```

#### 1.2 Create Game API Client
```typescript
// /lib/api/game-api.ts
- Implement game-related endpoints:
  - GET /content/{lesson_id}/written-material
  - GET /game-content/{lesson_id}/{game_type_id}
  - POST /game-results
```

#### 1.3 Create Recommendations API Client
```typescript
// /lib/api/recommendations-api.ts
- Implement recommendation endpoints:
  - GET /users/{user_id}/courses/{course_id}/recommendations
```

### Phase 2: Course Content Integration

#### 2.1 Update Course API to Use Backend
- Modify `/app/lms/new_course_overview/api/course-api.ts`
- Replace local JSON loading with API calls
- Maintain backward compatibility during transition

#### 2.2 Update Written Material Component
- Modify `/components/games/written-material.tsx`
- Fetch content from: GET `/content/{lesson_id}/written-material`
- Handle loading states and errors

### Phase 3: Game Content Integration

#### 3.1 Update Game Content Loading
For each game type, update to fetch from backend:

**Millionaire (game_type_id=1)**
- Update `/components/games/millionaire-game.tsx`
- Fetch from: GET `/game-content/{lesson_id}/1`
- Map backend response to component format

**Jeopardy (game_type_id=2)**
- Update `/components/games/jeopardy-game-new.tsx`
- Fetch from: GET `/game-content/{lesson_id}/2`

**Flashcards (game_type_id=3)**
- Update `/components/games/flashcard-game.tsx`
- Fetch from: GET `/game-content/{lesson_id}/3`

**Connect Cards (game_type_id=4)**
- Update `/components/games/connect-cards-game.tsx`
- Fetch from: GET `/game-content/{lesson_id}/4`

### Phase 4: Game Results Submission

#### 4.1 Create Results Submission Hook
```typescript
// /hooks/useGameResults.ts
- Create hook for submitting game results
- Handle ELO rating updates
- Process achievements
```

#### 4.2 Update Each Game Component
Add result submission on game completion:
- Collect question_id, knowledge_point_id, is_correct, time_spent
- Submit via POST `/game-results`
- Handle response and update UI

### Phase 5: Progress & Recommendations

#### 5.1 Integrate Recommendations
- Add recommendation fetching to course overview
- Display next lesson suggestions
- Show course progress from backend

#### 5.2 Update Progress Tracking
- Replace localStorage progress with backend data
- Sync progress updates with backend
- Handle offline/online synchronization

## Implementation Details

### API Response Mapping

#### Written Material Response → Component
```typescript
// Backend Response
{
  "lesson_id": 1,
  "lesson_name": "Introduction to Python",
  "content": "# Introduction...",
  "chapter_name": "Getting Started",
  "course_name": "Python Programming"
}

// Component expects
{
  contentType: 'written-material',
  content: {
    title: lesson_name,
    pages: [{ content, pageNumber: 1 }],
    chapterName: chapter_name,
    courseName: course_name
  }
}
```

#### Game Content Response → Component
```typescript
// Millionaire Backend Response
{
  "game_type": "millionaire",
  "lesson_id": 1,
  "questions": [{
    "id": 1,
    "question": "...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "knowledge_point_id": 5
  }]
}

// Component expects
{
  questions: [{
    id: "1",
    question: "...",
    options: [
      { id: "A", text: "...", correct: false },
      { id: "B", text: "...", correct: true },
      // ...
    ],
    difficulty: 'medium'
  }]
}
```

### Error Handling Strategy

1. **Network Errors**: Show retry button with offline mode fallback
2. **Authentication Errors**: Redirect to login with return URL
3. **404 Errors**: Show "Content not available" message
4. **Rate Limiting**: Implement exponential backoff
5. **Validation Errors**: Display user-friendly error messages

### State Management

1. **Loading States**: Use React Suspense where appropriate
2. **Error Boundaries**: Wrap game components for graceful failures
3. **Caching**: Implement SWR or React Query for data fetching
4. **Optimistic Updates**: Update UI before server confirmation

## Migration Strategy

1. **Feature Flag**: Add `USE_BACKEND_API` environment variable
2. **Parallel Implementation**: Keep local JSON fallback
3. **Gradual Rollout**: Enable backend per component
4. **Testing**: Comprehensive E2E tests for each integration
5. **Monitoring**: Add error tracking and performance metrics

## Testing Plan

1. **Unit Tests**: API clients and response mappers
2. **Integration Tests**: API endpoint connectivity
3. **Component Tests**: Game components with mocked API
4. **E2E Tests**: Full user flows with real backend
5. **Performance Tests**: Loading times and responsiveness

## Timeline Estimate

- Phase 1: 2-3 hours (API infrastructure)
- Phase 2: 2-3 hours (Course content)
- Phase 3: 4-5 hours (Game integration)
- Phase 4: 2-3 hours (Results submission)
- Phase 5: 2-3 hours (Progress & recommendations)
- Testing: 3-4 hours

**Total: 15-20 hours**

## Next Steps

1. Set up development environment with backend running
2. Create base API client with authentication
3. Start with Written Material integration (simplest)
4. Progress through game types one by one
5. Add results submission after games work
6. Implement recommendations last