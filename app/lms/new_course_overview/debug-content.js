// Simple test to check if content is loading correctly
async function testContentAPI() {
  try {
    console.log('🧪 Testing content API...')
    
    // Test direct fetch
    const response = await fetch('/lms-data/content/lesson-1-1-written-material.json?nocache=' + Date.now())
    console.log('📡 Direct fetch response:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Direct fetch success:', {
        contentType: data.contentType,
        title: data.content?.title,
        pagesCount: data.content?.pages?.length,
        firstPagePreview: data.content?.pages?.[0]?.content?.substring(0, 100) + '...'
      })
    } else {
      console.error('❌ Direct fetch failed:', response.status, response.statusText)
    }
    
  } catch (error) {
    console.error('🚨 Test failed:', error)
  }
}

// Run test when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testContentAPI)
} else {
  testContentAPI()
}