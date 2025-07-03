// Debug script to test progress tracking flow
// Run this in the browser console after playing a game

console.log('🔍 DEBUGGING PROGRESS TRACKING SYSTEM');

// 1. Check localStorage for lesson progress
const lessonId = 'lesson-1-1';
const courseId = 'course-1';

console.log('\n📂 CHECKING LOCALSTORAGE DATA:');
console.log('='.repeat(50));

// Check lesson progress
const lessonKey = `lesson_progress_${lessonId}`;
const lessonData = localStorage.getItem(lessonKey);
console.log(`📝 Lesson progress (${lessonKey}):`, lessonData ? JSON.parse(lessonData) : 'NOT FOUND');

// Check course progress
const courseKey = `user-progress-${courseId}`;
const courseData = localStorage.getItem(courseKey);
console.log(`📚 Course progress (${courseKey}):`, courseData ? JSON.parse(courseData) : 'NOT FOUND');

// 2. Check if event system is working
console.log('\n📡 TESTING EVENT SYSTEM:');
console.log('='.repeat(50));

let eventReceived = false;
window.addEventListener('courseProgressUpdated', (event) => {
  console.log('✅ courseProgressUpdated event received:', event.detail);
  eventReceived = true;
});

// Dispatch a test event
setTimeout(() => {
  window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
    detail: { courseId: 'course-1', lessonId: 'lesson-1-1' } 
  }));
  
  setTimeout(() => {
    console.log(`📡 Event system working: ${eventReceived ? '✅' : '❌'}`);
    
    // 3. Test the actual API calls
    console.log('\n🧪 TESTING API CALLS:');
    console.log('='.repeat(50));
    
    // Test progress API
    const testResults = [
      { cardId: 'card-0', isCorrect: true, responseTime: 3000 },
      { cardId: 'card-1', isCorrect: false, responseTime: 5000 },
      { cardId: 'card-2', isCorrect: true, responseTime: 2000 }
    ];
    
    console.log('🎯 Testing ProgressAPI.processFlashcardCompletion...');
    
    // Import and test the ProgressAPI
    import('/app/lms/new_course_overview/api/progress-api.js').then((module) => {
      return module.ProgressAPI.processFlashcardCompletion(lessonId, testResults);
    }).then((result) => {
      console.log('✅ ProgressAPI.processFlashcardCompletion result:', result);
      
      // Check localStorage again after API call
      setTimeout(() => {
        console.log('\n📂 AFTER API CALL - CHECKING LOCALSTORAGE:');
        console.log('='.repeat(50));
        
        const updatedLessonData = localStorage.getItem(lessonKey);
        console.log(`📝 Updated lesson progress:`, updatedLessonData ? JSON.parse(updatedLessonData) : 'NOT FOUND');
        
        const updatedCourseData = localStorage.getItem(courseKey);
        console.log(`📚 Updated course progress:`, updatedCourseData ? JSON.parse(updatedCourseData) : 'NOT FOUND');
        
        // 4. Test course loading with merge
        console.log('\n🔄 TESTING COURSE DATA MERGE:');
        console.log('='.repeat(50));
        
        import('/app/lms/new_course_overview/api/course-api.js').then((courseModule) => {
          return courseModule.courseAPI.getCourse(courseId);
        }).then((course) => {
          console.log('📚 Merged course data:', course);
          
          // Check specific lesson knowledge points
          const lesson = course.chapters[0].lessons[0]; // lesson-1-1
          console.log(`🎯 Lesson ${lesson.id} knowledge points:`, lesson.knowledgePoints.map(kp => ({
            id: kp.id,
            title: kp.title,
            proficiency: kp.proficiency
          })));
          
          console.log('\n🎉 DEBUG COMPLETE!');
          console.log('='.repeat(50));
          
        }).catch((error) => {
          console.error('❌ Course loading failed:', error);
        });
        
      }, 1000);
      
    }).catch((error) => {
      console.error('❌ ProgressAPI test failed:', error);
    });
    
  }, 500);
}, 100);