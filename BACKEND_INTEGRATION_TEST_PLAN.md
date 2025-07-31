# Backend Integration Test Plan

## Overview
This document outlines the test plan for verifying that all frontend-backend integrations are working correctly.

## Prerequisites
1. Backend server running at `http://localhost:8000`
2. Frontend running with `NEXT_PUBLIC_USE_BACKEND_API=true`
3. Valid user credentials for authentication

## Test Scenarios

### 1. Authentication Flow
- [ ] Login with valid credentials
- [ ] Verify JWT token is stored
- [ ] Verify token refresh on 401 errors
- [ ] Logout functionality

### 2. Course Content Loading
- [ ] Course list loads from backend
- [ ] Course details load with chapters and lessons
- [ ] Knowledge point proficiencies are displayed correctly
- [ ] Written material loads for lessons

### 3. Game Content Integration

#### 3.1 Millionaire Game (game_type_id=1)
- [ ] Questions load from backend
- [ ] Game plays correctly
- [ ] Results are submitted on completion
- [ ] Score is calculated correctly

#### 3.2 Jeopardy Game (game_type_id=2)
- [ ] Categories and questions load from backend
- [ ] Daily double is placed correctly
- [ ] Results are submitted on completion
- [ ] Score percentage is calculated correctly

#### 3.3 Flashcards Game (game_type_id=3)
- [ ] Flashcards load from backend
- [ ] Cards display front/back correctly
- [ ] Results are submitted on completion
- [ ] Progress tracking works

#### 3.4 Connect Cards Game (game_type_id=4)
- [ ] Card pairs load from backend
- [ ] Matching logic works correctly
- [ ] Results are submitted on completion
- [ ] Score based on accuracy

### 4. Progress Tracking
- [ ] Game results update knowledge point proficiencies
- [ ] Course progress updates after game completion
- [ ] Lesson completion status updates correctly
- [ ] Chapter test readiness reflects progress

### 5. Recommendations
- [ ] Course recommendations load from backend
- [ ] Recommendations exclude current course
- [ ] Recommendation scores are displayed
- [ ] Navigation to recommended courses works

### 6. Error Handling
- [ ] Graceful fallback when backend is unavailable
- [ ] Error messages are user-friendly
- [ ] Loading states are shown appropriately
- [ ] Network errors are handled

### 7. Performance
- [ ] API calls are not duplicated
- [ ] Loading times are reasonable
- [ ] Caching works where appropriate
- [ ] No memory leaks

## Known Issues
1. Progress tracking uses localStorage alongside backend (hybrid approach)
2. Some game types not implemented (only 4 out of 20+ types)
3. WebSocket integration not implemented

## Testing Instructions

### Setting Up
1. Start the backend server:
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. Set environment variable and start frontend:
   ```bash
   export NEXT_PUBLIC_USE_BACKEND_API=true
   npm run dev
   ```

3. Login with test credentials

### Manual Testing Steps
1. Navigate to `/lms/new_course_overview`
2. Click on a lesson to open the learning activities modal
3. Select each game type and play through
4. Verify results are submitted (check network tab)
5. Refresh page and verify progress is retained
6. Check recommendations section updates

### API Verification
Monitor the Network tab in browser DevTools to verify:
- Correct endpoints are called
- Auth headers are included
- Response data matches expected format
- Error responses are handled

## Success Criteria
- All test scenarios pass
- No console errors during normal operation
- Fallback to local data works when backend is down
- User experience is smooth and responsive