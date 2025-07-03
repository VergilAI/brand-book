// Global debug function for progress tracking
// Add this to window object for browser console access

window.debugProgress = function() {
  console.log('🔍 DEBUGGING PROGRESS TRACKING SYSTEM');
  console.log('='.repeat(60));
  
  const lessonId = 'lesson-1-1';
  const courseId = 'course-1';
  
  // 1. Check localStorage
  console.log('\n📂 LOCALSTORAGE STATE:');
  console.log('-'.repeat(30));
  
  const lessonKey = `lesson_progress_${lessonId}`;
  const courseKey = `user-progress-${courseId}`;
  
  const lessonData = localStorage.getItem(lessonKey);
  const courseData = localStorage.getItem(courseKey);
  
  console.log(`📝 ${lessonKey}:`, lessonData ? JSON.parse(lessonData) : '❌ NOT FOUND');
  console.log(`📚 ${courseKey}:`, courseData ? JSON.parse(courseData) : '❌ NOT FOUND');
  
  // 2. List all localStorage keys that might be related
  console.log('\n🔑 ALL RELATED LOCALSTORAGE KEYS:');
  console.log('-'.repeat(30));
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('lesson') || key.includes('course') || key.includes('progress'))) {
      console.log(`📋 ${key}:`, localStorage.getItem(key) ? 'HAS DATA' : 'EMPTY');
    }
  }
  
  // 3. Test event system
  console.log('\n📡 TESTING EVENT SYSTEM:');
  console.log('-'.repeat(30));
  
  let eventReceived = false;
  const eventHandler = (event) => {
    console.log('✅ courseProgressUpdated event received:', event.detail);
    eventReceived = true;
  };
  
  window.addEventListener('courseProgressUpdated', eventHandler);
  
  // Dispatch test event
  window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
    detail: { courseId, lessonId } 
  }));
  
  setTimeout(() => {
    console.log(`📡 Event system status: ${eventReceived ? '✅ WORKING' : '❌ NOT WORKING'}`);
    window.removeEventListener('courseProgressUpdated', eventHandler);
    
    // 4. Show what data should look like
    console.log('\n📋 EXPECTED DATA STRUCTURE:');
    console.log('-'.repeat(30));
    console.log('Expected lesson progress structure:', {
      knowledgePoints: [
        {
          id: 'kp-1',
          title: 'CIA Triad',
          proficiency: 25, // Should be > 0 after playing
          performanceHistory: [{ /* performance records */ }],
          totalAttempts: 1,
          correctAttempts: 1,
          masteryLevel: 'novice'
        }
      ]
    });
    
    console.log('Expected course progress structure:', {
      lessons: {
        'lesson-1-1': {
          knowledgePoints: [
            {
              id: 'kp-1',
              proficiency: 25, // Should be > 0
              masteryLevel: 'novice'
            }
          ],
          lastUpdated: '2023-...'
        }
      }
    });
    
    console.log('\n🎯 TO TEST MANUALLY:');
    console.log('-'.repeat(30));
    console.log('1. Open flashcard game for lesson-1-1');
    console.log('2. Answer a few cards');
    console.log('3. Complete the game');
    console.log('4. Run debugProgress() again');
    console.log('5. Check if proficiency values changed');
    
  }, 100);
};

// Also add a function to clear all progress data
window.clearProgressData = function() {
  console.log('🧹 CLEARING ALL PROGRESS DATA');
  
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('lesson_progress') || key.includes('user-progress'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed: ${key}`);
  });
  
  console.log(`✅ Cleared ${keysToRemove.length} progress data entries`);
  console.log('🔄 Refresh the page to start fresh');
};

// Add a function to simulate playing a game
window.simulateGame = async function() {
  console.log('🎮 SIMULATING FLASHCARD GAME COMPLETION');
  
  const lessonId = 'lesson-1-1';
  const testResults = [
    { cardId: 'card-0', isCorrect: true, responseTime: 3000 },
    { cardId: 'card-1', isCorrect: false, responseTime: 5000 },
    { cardId: 'card-2', isCorrect: true, responseTime: 2000 }
  ];
  
  console.log('📊 Test results:', testResults);
  
  try {
    // Import the ProgressAPI
    const { ProgressAPI } = await import('./app/lms/new_course_overview/api/progress-api.js');
    
    console.log('🔧 Calling ProgressAPI.processFlashcardCompletion...');
    const result = await ProgressAPI.processFlashcardCompletion(lessonId, testResults);
    
    console.log('✅ API call result:', result);
    
    // Check the data after
    setTimeout(() => {
      console.log('\n📂 AFTER SIMULATION - LOCALSTORAGE STATE:');
      const lessonData = localStorage.getItem(`lesson_progress_${lessonId}`);
      const courseData = localStorage.getItem(`user-progress-course-1`);
      
      console.log('📝 Lesson data:', lessonData ? JSON.parse(lessonData) : '❌ NOT FOUND');
      console.log('📚 Course data:', courseData ? JSON.parse(courseData) : '❌ NOT FOUND');
    }, 1000);
    
  } catch (error) {
    console.error('❌ Simulation failed:', error);
  }
};

console.log('🛠️ DEBUG FUNCTIONS LOADED');
console.log('Available functions:');
console.log('• debugProgress() - Check current state');
console.log('• clearProgressData() - Clear all progress');
console.log('• simulateGame() - Simulate game completion');