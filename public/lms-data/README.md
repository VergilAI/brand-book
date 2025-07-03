# LMS Data Structure Documentation

This directory contains JSON files that serve as the mock backend for the LMS new course overview page.

## Directory Structure

```
data/
├── courses/              # Course data files
│   └── course-1.json    # Complete course structure with chapters and lessons
├── users/               # User progress and preferences
│   └── user-progress.json
├── content/             # Lesson content (written, video, audio)
│   └── lesson-1-1-written.json
├── game-content/        # Game-specific content
│   └── lesson-1-1-flashcards.json
└── knowledge-learning-paths.json  # Maps knowledge points to lessons
```

## File Descriptions

### courses/course-1.json
Contains the complete course structure including:
- Course metadata (title, description, progress)
- Chapters with order and progress
- Lessons with knowledge points and available game types
- Initial proficiency values (all set to 0)

### users/user-progress.json
Stores user-specific data:
- Enrollment dates
- Lesson completion status
- Knowledge point proficiency updates
- Test scores
- Game history

### content/[lessonId]-[contentType].json
Stores actual lesson content:
- `written-material`: HTML or PDF content
- `video`: Video URLs and metadata
- `audio`: Audio files and chapter markers

### game-content/[lessonId]-[gameType].json
Game-specific data:
- `flashcards`: Card decks with questions/answers
- `millionaire`: Multiple choice questions
- `jeopardy`: Categories and clues
- `connect-cards`: Matching pairs

### knowledge-learning-paths.json
Maps each knowledge point to lessons where it can be learned, enabling the "Where else can I learn this?" feature.

## Data Flow

1. **Initial Load**: Course data is loaded from `courses/course-1.json`
2. **User Progress**: Progress from localStorage is merged with course data
3. **Content Delivery**: When a game/lesson starts, specific content files are loaded
4. **Progress Updates**: Updates are saved to localStorage and can be persisted back to JSON

## Adding New Content

To add new lessons or games:

1. Update the course structure in `courses/course-1.json`
2. Create corresponding content files in `content/` and `game-content/`
3. Update `knowledge-learning-paths.json` with new mappings

## API Integration

The `api/course-api.ts` file provides methods that:
- Load JSON files via fetch
- Merge with localStorage for persistence
- Calculate progress dynamically
- Handle error cases with fallback content

## Future Enhancements

- Add more course files (course-2.json, etc.)
- Support for multiple users
- Add chapter test questions
- Include multimedia content URLs
- Add collaborative features data