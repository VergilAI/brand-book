// Test script to verify content API is working
const fetch = require('node-fetch');

async function testContentAPI() {
  try {
    console.log('Testing content API...\n');
    
    // Test 1: Load written material for lesson 1-1
    console.log('Test 1: Loading written material for lesson-1-1');
    const response1 = await fetch('http://localhost:3001/lms-data/content/lesson-1-1-written-material.json');
    if (response1.ok) {
      const data = await response1.json();
      console.log('✓ Successfully loaded written material');
      console.log(`  - Content type: ${data.contentType}`);
      console.log(`  - Lesson ID: ${data.lessonId}`);
      console.log(`  - Pages: ${data.content.pages.length}`);
      console.log(`  - Title: ${data.content.title}`);
    } else {
      console.log('✗ Failed to load written material:', response1.status);
    }
    
    // Test 2: Load flashcards for lesson 1-1
    console.log('\nTest 2: Loading flashcards for lesson-1-1');
    const response2 = await fetch('http://localhost:3001/lms-data/game-content/lesson-1-1-flashcards.json');
    if (response2.ok) {
      const data = await response2.json();
      console.log('✓ Successfully loaded flashcards');
      console.log(`  - Game type: ${data.gameType}`);
      console.log(`  - Cards: ${data.content.cards.length}`);
      console.log(`  - Title: ${data.content.title}`);
    } else {
      console.log('✗ Failed to load flashcards:', response2.status);
    }
    
    // Test 3: Check if multiple versions exist
    console.log('\nTest 3: Checking for multiple versions');
    const versions = ['', '-v2', '-v3', '-v4'];
    let foundVersions = 0;
    for (const version of versions) {
      try {
        const response = await fetch(`http://localhost:3001/lms-data/content/lesson-1-1-written-material${version}.json`);
        if (response.ok) {
          foundVersions++;
          console.log(`  ✓ Found version: lesson-1-1-written-material${version}.json`);
        }
      } catch (e) {
        // Version doesn't exist
      }
    }
    console.log(`Found ${foundVersions} version(s) of written material`);
    
  } catch (error) {
    console.error('Error testing content API:', error);
  }
}

// Run the test
testContentAPI();