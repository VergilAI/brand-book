# LMS Module

## Overview

The LMS (Learning Management System) module is a demo interface showcasing how Vergil's design system can be applied to educational platforms. It demonstrates authentication flows, course management with multi-modal learning activities, and admin interfaces.

## Module Structure

```
app/lms/
├── page.tsx              # LMS dashboard/home
├── login/                # Authentication flow
│   └── page.tsx         # Login interface
├── forgot-password/      # Password recovery
│   └── page.tsx         # Recovery flow
├── courses/              # Course management
│   └── page.tsx         # Course listing
├── admin/                # Admin interfaces
│   └── page.tsx         # Admin dashboard
└── CLAUDE.md            # This file

Related components in:
- /components/lms/        # LMS-specific components
- /lib/lms/              # LMS data structures and types
```

## Key Features

### Authentication System
- Login page with form validation
- Password recovery flow
- Session management (demo)
- Branded authentication UI

### Course Structure
- **Courses**: Top-level containers for learning content
- **Sections**: Organized groups of related lessons within a course
- **Lessons**: Individual learning units containing knowledge points
- **Knowledge Points**: Specific concepts or skills to be mastered
- **Game Types**: Multiple learning modalities for each lesson

### Learning Activities
The system supports 20+ different game types across 5 categories:

1. **Content Types**
   - Written Material
   - Audio Material (read aloud)
   - Video
   - User-linked content

2. **Quiz Games**
   - Flashcards
   - Who Wants to Be a Millionaire (with rewards)
   - Jeopardy (with rewards)
   - Speed Rounds (timed MCQ)

3. **Assessment Types**
   - Timed Tests
   - Untimed Tests
   - Multiple answer formats (MCQ, short/long answer, single word)

4. **Interactive Games**
   - Crossword Puzzles
   - Concept Matching
   - Odd One Out
   - Territory Conquest (AI-powered)

5. **Chat-Based Games**
   - Case Study Discussions
   - Open-ended Topic Chat
   - Role Playing Games
   - Shark Tank Format
   - Escape Room Puzzles
   - Debate Tournaments

### Progress Tracking
- Knowledge point proficiency (0-100%)
- Lesson completion status
- Section progress visualization
- Overall course mastery metrics

### Admin Dashboard
- User management interface
- Course creation tools
- Analytics visualization
- System settings

## Component Guidelines

### LMS Components (`/components/lms/`)
- Follow Vergil brand guidelines
- Use breathing animations sparingly
- Focus on clarity and usability
- Maintain accessibility standards

### Form Patterns
- Use Vergil-styled inputs
- Clear validation messages
- Loading states with brand spinner
- Success/error feedback

### Data Visualization
- Use Graph Constellation for relationships
- Apply brand colors to charts
- Animate data transitions
- Keep visualizations clean

## Design Principles

1. **Educational Focus**
   - Clear information hierarchy
   - Intuitive navigation
   - Progress visibility
   - Learner-centric design

2. **Brand Integration**
   - Subtle use of living animations
   - Brand colors for accents
   - Neural patterns for backgrounds
   - Consistent typography

3. **Accessibility**
   - WCAG AA compliance
   - Keyboard navigation
   - Screen reader support
   - Clear focus states

## Common Patterns

```tsx
// Course overview with sections
<CourseOverview 
  course={course}
  onStartCourse={() => navigateToCourse(course.id)}
  onStartLesson={(lessonId, gameTypeId) => startLesson(lessonId, gameTypeId)}
/>

// Course section with lessons
<CourseSection
  section={section}
  sectionNumber={1}
  isExpanded={true}
  onStartLesson={(lessonId, gameTypeId) => startLesson(lessonId, gameTypeId)}
/>

// Individual lesson card
<LessonCard
  lesson={lesson}
  sectionNumber={1}
  lessonNumber={1}
  isLocked={false}
  onStartLesson={(gameTypeId) => startLesson(lesson.id, gameTypeId)}
/>

// Lesson modal for game selection
<LessonModal
  lesson={lesson}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSelectGame={(gameTypeId) => startGame(gameTypeId)}
/>

// Game type selection card
<GameTypeCard
  gameType={gameType}
  isAvailable={true}
  onClick={() => selectGameType(gameType.id)}
/>

// Login form
<form>
  <Input 
    type="email" 
    placeholder="Enter your email"
    className="mb-4"
  />
  <Input 
    type="password" 
    placeholder="Enter your password"
    className="mb-4"
  />
  <Button variant="default" className="w-full">
    Sign In
  </Button>
</form>
```

## Future Enhancements

- Real authentication integration
- Course content management
- Student progress tracking
- Interactive assessments
- Video player integration
- Discussion forums
- Notification system

## Notes

This is a demo implementation showcasing design system application. For production use:
- Implement proper authentication
- Add database integration
- Set up API endpoints
- Add error handling
- Implement security measures