# LMS Content Loading Solution

## Problem
All lessons were showing hardcoded AI content instead of loading from the JSON files in `/public/lms-data/content/`.

## Root Cause
The `GameLauncher` component was using hardcoded content for written materials instead of fetching from the content API.

## Solution Implemented

### 1. Created `useGameContent` Hook
- Location: `/app/lms/new_course_overview/hooks/useGameContent.ts`
- Purpose: Centralized hook to load content from the API based on lesson ID and game type
- Handles both content types (written, video, audio) and game types (flashcards, millionaire, etc.)

### 2. Updated `GameLauncher` Component
- Now uses the `useGameContent` hook to fetch content dynamically
- Shows loading and error states
- Renders HTML content from JSON files with proper styling
- Falls back to generated content if JSON files are not found

### 3. Content Loading Flow
1. User clicks on a learning method (e.g., "Written Material")
2. `GameLauncher` component is rendered with lesson ID and game type
3. `useGameContent` hook is called
4. Hook determines whether to use `contentAPI` or `gameAPI` based on game type
5. API tries to load multiple versions of content (base, -v2, -v3, -v4)
6. If content is found, it returns a random version
7. If no content is found, it returns default/generated content
8. Content is rendered with appropriate styling

### 4. Key Files Modified
- `/components/lms/game-launcher.tsx` - Main component updated to use dynamic content
- `/app/lms/new_course_overview/hooks/useGameContent.ts` - New hook for loading content
- `/app/lms/new_course_overview/api/course-api.ts` - Added debug logging

### 5. Content Structure
Written material JSON files should follow this structure:
```json
{
  "contentType": "written-material",
  "lessonId": "lesson-1-1",
  "content": {
    "format": "html",
    "title": "Lesson Title",
    "pages": [
      {
        "pageNumber": 1,
        "content": "<h1>Title</h1><p>HTML content here...</p>"
      }
    ],
    "estimatedReadTime": 45,
    "totalPages": 6
  }
}
```

### 6. Testing
- Content is now loaded from `/public/lms-data/content/` directory
- Multiple versions are supported (e.g., lesson-1-1-written-material.json, lesson-1-1-written-material-v2.json)
- Console logs show which files are being loaded
- Proper error handling shows when content cannot be loaded

## Next Steps
1. Ensure all content JSON files are properly formatted
2. Test with different lessons to verify content loading
3. Monitor console logs for any loading errors
4. Consider adding content caching for better performance