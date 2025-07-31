# Backend Integration - Phased Deliverables

## Phase 1: API Infrastructure (High Priority)
**Goal**: Establish robust API client foundation with authentication and error handling

### Phase 1.1: Base API Client ✅ Deliverable
- **File**: `/lib/api/base-client.ts`
- **Features**:
  - Automatic auth token injection from localStorage
  - Token refresh on 401 errors
  - Standardized error handling
  - Request/response interceptors
  - Configurable base URL from environment
- **Success Criteria**: 
  - Can make authenticated requests
  - Handles token expiry gracefully
  - Provides consistent error format

### Phase 1.2: Game API Client ✅ Deliverable  
- **File**: `/lib/api/game-api.ts`
- **Endpoints**:
  - `getWrittenMaterial(lessonId: string)`
  - `getGameContent(lessonId: string, gameTypeId: number)`
  - `submitGameResults(lessonId: string, results: GameResults)`
- **Success Criteria**:
  - Type-safe API methods
  - Proper error propagation
  - Response format mapping

### Phase 1.3: Recommendations API Client ✅ Deliverable
- **File**: `/lib/api/recommendations-api.ts`
- **Endpoints**:
  - `getCourseRecommendations(userId: string, courseId: string)`
- **Success Criteria**:
  - Returns next lesson recommendations
  - Handles completed course state

---

## Phase 2: Course Content Integration (High Priority)
**Goal**: Replace local JSON with backend API for course materials

### Phase 2.1: Course API Backend Integration ✅ Deliverable
- **File**: `/app/lms/new_course_overview/api/course-api.ts`
- **Changes**:
  - Add environment flag for backend vs local
  - Implement backend data fetching
  - Map backend course structure to frontend format
- **Success Criteria**:
  - Course overview loads from backend
  - Maintains existing UI functionality
  - Graceful fallback to local data

### Phase 2.2: Written Material Integration ✅ Deliverable
- **File**: `/components/games/written-material.tsx`
- **Changes**:
  - Fetch content from backend API
  - Add loading states
  - Handle errors gracefully
- **Success Criteria**:
  - Displays lesson written content
  - Shows chapter and course context
  - Proper error messages

---

## Phase 3: Game Integration (Medium Priority)
**Goal**: Connect all 4 game types to backend content delivery

### Phase 3.1: Millionaire Game ✅ Deliverable
- **File**: `/components/games/millionaire-game.tsx`
- **Game Type ID**: 1
- **Changes**:
  - Fetch questions from backend
  - Map options format (A,B,C,D → array)
  - Track knowledge point IDs
- **Success Criteria**:
  - 15 questions load correctly
  - Options display properly
  - Game mechanics unchanged

### Phase 3.2: Jeopardy Game ✅ Deliverable
- **File**: `/components/games/jeopardy-game-new.tsx`
- **Game Type ID**: 2
- **Changes**:
  - Fetch categories and questions
  - Map point values
  - Handle answer format
- **Success Criteria**:
  - Categories display correctly
  - Point values work
  - Answer validation functions

### Phase 3.3: Flashcards ✅ Deliverable
- **File**: `/components/games/flashcard-game.tsx`
- **Game Type ID**: 3
- **Changes**:
  - Fetch card deck from backend
  - Display front/back content
  - Track viewed cards
- **Success Criteria**:
  - Cards flip correctly
  - Progress tracking works
  - Knowledge points tracked

### Phase 3.4: Connect Cards ✅ Deliverable
- **File**: `/components/games/connect-cards-game.tsx`
- **Game Type ID**: 4
- **Changes**:
  - Fetch matching pairs
  - Randomize card positions
  - Track matches
- **Success Criteria**:
  - Pairs match correctly
  - Game completion tracked
  - Knowledge points recorded

---

## Phase 4: Results & Progress (Medium Priority)
**Goal**: Submit game results and update user progress

### Phase 4.1: Game Results Hook ✅ Deliverable
- **File**: `/hooks/useGameResults.ts`
- **Features**:
  - Submit results with timing data
  - Handle ELO updates
  - Process achievements
  - Emit progress events
- **Success Criteria**:
  - Results submit successfully
  - Returns updated proficiencies
  - Triggers UI updates

### Phase 4.2: Game Component Updates ✅ Deliverable
- **Files**: All 4 game components
- **Changes**:
  - Add result submission on completion
  - Track time per question/card
  - Show achievement notifications
- **Success Criteria**:
  - Each game submits results
  - Progress updates visible
  - Achievements display

---

## Phase 5: Recommendations & Sync (Low Priority)
**Goal**: Complete backend integration with smart recommendations

### Phase 5.1: Course Recommendations ✅ Deliverable
- **Files**: Course overview components
- **Features**:
  - Display next recommended lesson
  - Show completion reason
  - Update course progress %
- **Success Criteria**:
  - Recommendations appear
  - Progress accurate
  - Handles course completion

### Phase 5.2: Progress Synchronization ✅ Deliverable
- **Files**: Progress tracking system
- **Features**:
  - Replace localStorage with backend
  - Real-time progress updates
  - Offline queue for results
- **Success Criteria**:
  - Progress persists across sessions
  - Works offline
  - Syncs when online

---

## Phase 6: Testing & Validation (Low Priority)
**Goal**: Ensure all integrations work end-to-end

### Phase 6: Complete Testing ✅ Deliverable
- **Test Coverage**:
  - Authentication flow
  - Each game type
  - Results submission
  - Progress tracking
  - Error scenarios
- **Success Criteria**:
  - All games playable
  - Progress saves correctly
  - Errors handled gracefully
  - Performance acceptable

---

## Progress Tracking

| Phase | Status | Deliverables | Notes |
|-------|--------|--------------|-------|
| 1.1 | 🔲 Pending | Base API Client | Foundation for all API calls |
| 1.2 | 🔲 Pending | Game API Client | Game-specific endpoints |
| 1.3 | 🔲 Pending | Recommendations API | Next lesson suggestions |
| 2.1 | 🔲 Pending | Course API Update | Backend course loading |
| 2.2 | 🔲 Pending | Written Material | First content integration |
| 3.1 | 🔲 Pending | Millionaire Game | Multiple choice questions |
| 3.2 | 🔲 Pending | Jeopardy Game | Category-based Q&A |
| 3.3 | 🔲 Pending | Flashcards | Study cards |
| 3.4 | 🔲 Pending | Connect Cards | Matching pairs |
| 4.1 | 🔲 Pending | Results Hook | Submission logic |
| 4.2 | 🔲 Pending | Game Updates | Add submission to games |
| 5.1 | 🔲 Pending | Recommendations | Smart suggestions |
| 5.2 | 🔲 Pending | Progress Sync | Backend persistence |
| 6 | 🔲 Pending | Testing | End-to-end validation |

## Definition of Done

Each phase is considered complete when:
1. ✅ Code implemented and working
2. ✅ Error handling in place
3. ✅ Loading states implemented
4. ✅ Types properly defined
5. ✅ Manual testing passed
6. ✅ No console errors
7. ✅ Maintains existing UX