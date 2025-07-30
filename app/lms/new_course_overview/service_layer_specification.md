# Service Layer Specification for /lms/new_course_overview

## Overview
This document specifies the service layer requirements for the LMS Course Overview page, detailing the data transformations and database queries needed to support the frontend functionality.

## Dashboard Cards

### 'Lessons' Card - In Progress Counter
If the user has interacted with at least one knowledge point from the lesson, the lesson is considered to be in progress.

**Information needed from DB:**
- Join `lesson_knowledge_point` table with `user_knowledge_point` table on `knowledge_point_id`
- Filter by `user_id` to get current user's progress
- If any match exists where `lesson_knowledge_point.knowledge_point_id = user_knowledge_point.knowledge_point_id`, mark the lesson (identified by `lesson_knowledge_point.lesson_id`) as "in progress"

### 'Knowledge Points' Card - Mastered/Total
First count knowledge points associated with a course, then apply mastery threshold of 1800 ELO.

**Information needed from DB:**
- Join `course` → `chapter` (on `course_id`) → `lesson` (on `chapter_id`) → `lesson_knowledge_point` (on `lesson_id`) → `knowledge_point` (on `knowledge_point_id`)
- Count distinct `knowledge_point.id` for total knowledge points
- For mastered count: Join with `user_knowledge_point` where `user_knowledge_point.elo >= 1800` and `user_id` matches current user

### 'Time to Finish' Card
Calculate estimated hours to complete the course based on knowledge point progress.

**Calculation Logic:**
1. For each knowledge point in the course:
   - If no `user_knowledge_point` entry exists (never interacted): 25 minutes
   - If `user_knowledge_point` entry exists:
     - Calculate progress: `(user_knowledge_point.elo / 1800) × 100`
     - Time remaining: `25 × (1 - progress/100)` minutes
   - If ELO >= 1800 (100% complete): 0 minutes

**Information needed from DB:**
1. Get all knowledge points for the course:
   - Join `course` → `chapter` → `lesson` → `lesson_knowledge_point` → `knowledge_point`
2. Left join with `user_knowledge_point` (on `knowledge_point_id` and `user_id`)
3. For each knowledge point:
   - If `user_knowledge_point.elo` is NULL: add 25 minutes
   - If `user_knowledge_point.elo` < 1800: add `25 × (1800 - elo) / 1800` minutes
   - If `user_knowledge_point.elo` >= 1800: add 0 minutes
4. Sum all minutes and convert to hours (round up)

**Example Calculation:**
- Knowledge Point A: No interaction → 25 minutes
- Knowledge Point B: 900 ELO (50%) → 12.5 minutes remaining
- Knowledge Point C: 1800 ELO (100%) → 0 minutes
- Knowledge Point D: 1350 ELO (75%) → 6.25 minutes remaining
- Total: 43.75 minutes → Display as "1 hour"

## Chapter Cards

### Number of Lessons Display
**Information from DB:**
- Count rows in `lesson` table where `lesson.chapter_id` equals the specific chapter

### 'Completed' Lessons Counter
A lesson is completed if all knowledge points under it have been mastered (1530 ELO represents 85% mastery threshold).

**Information from DB:**
- For each lesson in chapter: Join `lesson` → `lesson_knowledge_point` → `user_knowledge_point`
- A lesson is completed when ALL associated knowledge points have `user_knowledge_point.elo >= 1530` (85% of 1800)
- Count lessons meeting this criteria

### Duration Display
**Information from DB:**
- Count knowledge points: Join `chapter` → `lesson` → `lesson_knowledge_point`
- Duration = count(`knowledge_point_id`) × 15 minutes
- Convert to hours for display

### 'In Progress' Status Tag
**Information from DB:**
- Check if ANY lesson within the chapter has at least one `user_knowledge_point` entry for its associated knowledge points
- Use same logic as individual lesson "in progress" check

### Test Readiness Tag & Progress Bar
**Note:** References "tests in that chapter" but no test tables exist. Assuming this means aggregate knowledge point progress.

**Information from DB:**
- Get all knowledge points for chapter: Join `chapter` → `lesson` → `lesson_knowledge_point` → `user_knowledge_point`
- Calculate average ELO as percentage: (average(`user_knowledge_point.elo`) / 1800) × 100
- Apply thresholds for readiness labels:
  - 0-20%: Keep Learning
  - 21-40%: Getting closer
  - 41-60%: Almost there
  - 61-80%: Mostly Prepared
  - 81%-100%: Ready!
- Progress bar shows this percentage, capped at 90% (final 10% requires course completion)

## Lesson Cards

### Knowledge Point Progress
**Information from DB:**
- Join `lesson` → `lesson_knowledge_point` → `user_knowledge_point` for specific lesson
- Calculate average: (average(`user_knowledge_point.elo`) / 1800) × 100
- If no `user_knowledge_point` entry exists for a knowledge point, count as 0%

### 'In Progress' Status Tag
**Information from DB:**
- Check if lesson has at least one `user_knowledge_point` entry for its associated knowledge points
- Use same logic as dashboard lesson card

## Learning Activities Modal

### Available Activities
**Always show:**
- Written material (from `lesson.content`)
- AI Learning assistant

**Conditional games based on available questions:**
- **Who Wants to Be a Millionaire**: Check `multiple_choice_knowledge_point` table
  - Need minimum 15 questions: Count entries where `knowledge_point_id` IN (lesson's knowledge points)
- **Jeopardy**: Check `question_and_answer_knowledge_point` table
- **Flashcards**: Check `question_and_answer_knowledge_point` table
- **Connect the Cards**: Check `connect_the_cards_knowledge_point` table

### Written Material
**Information from DB:**
- Load `lesson.content` field directly

### Who Wants to Be a Millionaire Game
**Information from DB:**
1. Join `multiple_choice` → `multiple_choice_knowledge_point` where `knowledge_point_id` IN (lesson's knowledge points)
2. Left join with `multiple_choice_user` to identify unanswered questions
3. Order by `multiple_choice.elo` ASC (easiest to hardest)
4. Prioritize questions with no `multiple_choice_user` entries
5. Select 15 questions total

### Jeopardy Game
**Information from DB:**
1. Get knowledge points for lesson from `lesson_knowledge_point`
2. For each knowledge point, join `question_and_answer` → `question_and_answer_knowledge_point`
3. Only include knowledge points with at least 1 question
4. Left join with `question_and_answer_user` to prioritize unanswered
5. Order by `question_and_answer.elo` DESC (easiest on top, hardest on bottom)
6. Limit to 5 questions per knowledge point category

### Flashcards Game
**Information from DB:**
1. Join `question_and_answer` → `question_and_answer_knowledge_point` where `knowledge_point_id` IN (lesson's knowledge points)
2. Group by `knowledge_point_id` for even distribution
3. Left join with `question_and_answer_user` to prioritize unanswered
4. Select up to 15 total with balanced distribution across knowledge points
5. Random order for selected questions
6. If less than 15 available, load all

### Connect the Cards Game
**Information from DB:**
1. Join `connect_the_cards` → `connect_the_cards_knowledge_point` where `knowledge_point_id` IN (lesson's knowledge points)
2. Left join with `connect_the_cards_user` to prioritize unplayed
3. Select up to 10 with even distribution across knowledge points
4. Return `connect_the_cards.left_side_data` and `connect_the_cards.right_side_data`
5. Frontend randomizes display order
6. If less than 10 available, load all

## ELO System Reference

### Proficiency Mapping
- 0 ELO = 0% proficiency
- 1800 ELO = 100% proficiency
- 1530 ELO = 85% proficiency (mastery threshold)
- 1500 ELO = ~83% proficiency (knowledge point mastered for card display)

### Progress Calculations
- Lesson completion: ALL knowledge points >= 1530 ELO (85%)
- Knowledge point mastery: >= 1500 ELO
- Progress percentages: (current_elo / 1800) × 100

## Additional Notes

1. All queries must filter by `user_id` for user-specific data
2. Use left joins when checking for user interactions to handle cases where user hasn't attempted content
3. Prioritize unplayed/unanswered content in all game selections
4. Frontend expects proficiency as 0-100 percentage, not raw ELO values
5. Consider implementing database views or stored procedures for complex aggregations