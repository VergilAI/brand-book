# Progress Tracking Debug Instructions

## How to Debug the Progress Tracking System

### Quick Test
1. Open the browser console
2. Run: `ProgressAPI.manualTest()`
3. This will run a complete test of the entire flow

### Step-by-Step Manual Testing

#### 1. Check Current State
```javascript
// Check localStorage
console.log('Lesson:', localStorage.getItem('lesson_progress_lesson-1-1'))
console.log('Course:', localStorage.getItem('user-progress-course-1'))

// Check current course data
courseAPI.getCourse('course-1').then(course => {
  const lesson = course.chapters[0].lessons[0]
  lesson.knowledgePoints.forEach(kp => {
    console.log(`${kp.id}: ${kp.proficiency}%`)
  })
})
```

#### 2. Clear and Test from Scratch
```javascript
// Clear all progress data
localStorage.removeItem('lesson_progress_lesson-1-1')
localStorage.removeItem('user-progress-course-1')

// Run a test game simulation
ProgressAPI.manualTest()
```

#### 3. Test Individual Components

**Test Progress API:**
```javascript
const testResults = [
  { cardId: 'card-0', isCorrect: true, responseTime: 3000 },
  { cardId: 'card-1', isCorrect: false, responseTime: 5000 }
]

ProgressAPI.processFlashcardCompletion('lesson-1-1', testResults)
  .then(result => console.log('Progress result:', result))
```

**Test Course Loading:**
```javascript
courseAPI.getCourse('course-1')
  .then(course => {
    const lesson = course.chapters[0].lessons[0]
    console.log('Lesson KPs:', lesson.knowledgePoints)
  })
```

**Test Event System:**
```javascript
let eventReceived = false
window.addEventListener('courseProgressUpdated', (e) => {
  console.log('Event received:', e.detail)
  eventReceived = true
})

window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
  detail: { courseId: 'course-1', lessonId: 'lesson-1-1' } 
}))

setTimeout(() => console.log('Event received:', eventReceived), 100)
```

**Manually Trigger UI Refresh:**
```javascript
// This should trigger the UI to refresh with latest data
debugRefreshCourse()
```

### Expected Data Flow

1. **Game Completion** → `ProgressAPI.processFlashcardCompletion()`
2. **Knowledge Point Updates** → `ProgressAPI.updateKnowledgePointProgress()`
3. **Save to Lesson Storage** → `lesson_progress_lesson-1-1`
4. **Update Course Storage** → `user-progress-course-1`
5. **Dispatch Event** → `courseProgressUpdated`
6. **Event Listener** → `useCourseData` hook receives event
7. **Refresh Course** → `courseAPI.getCourse()`
8. **Merge Progress** → `mergeCourseWithProgress()`
9. **UI Update** → React re-renders with new proficiency values

### Expected Data Structures

**Lesson Progress (`lesson_progress_lesson-1-1`):**
```json
{
  "knowledgePoints": [
    {
      "id": "kp-1",
      "title": "CIA Triad",
      "proficiency": 25,
      "performanceHistory": [...],
      "totalAttempts": 1,
      "correctAttempts": 1,
      "masteryLevel": "novice"
    }
  ]
}
```

**Course Progress (`user-progress-course-1`):**
```json
{
  "lessons": {
    "lesson-1-1": {
      "knowledgePoints": [
        {
          "id": "kp-1",
          "proficiency": 25,
          "masteryLevel": "novice"
        }
      ],
      "lastUpdated": "2023-..."
    }
  }
}
```

### What Should Happen After Playing a Game

1. **localStorage** should contain both `lesson_progress_lesson-1-1` and `user-progress-course-1`
2. **Knowledge point proficiency** should be > 0 (not the original 0)
3. **UI should show** "In Progress" status and updated proficiency percentages
4. **Console logs** should show the merge process happening

### Common Issues to Check

1. **Event not firing** - Check if `courseProgressUpdated` event is dispatched
2. **Event not received** - Check if `useCourseData` hook is listening
3. **Data not saved** - Check localStorage keys and data structure
4. **Merge not working** - Check if `mergeCourseWithProgress` is updating proficiencies
5. **UI not updating** - Check if React state is being updated after merge

### Debug Functions Available

- `ProgressAPI.manualTest()` - Complete end-to-end test
- `ProgressAPI.debugTest()` - Simple API test
- `debugRefreshCourse()` - Manually refresh course data
- `courseAPI.getCourse()` - Get current course with merged progress