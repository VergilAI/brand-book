import { test, expect } from '@playwright/test'

test.describe('Chart Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance monitoring
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = {
        renderTimes: [],
        interactionTimes: [],
        memoryUsage: [],
      }
      
      // Track render performance
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            window.performanceMetrics.renderTimes.push({
              name: entry.name,
              duration: entry.duration,
            })
          }
        }
      })
      observer.observe({ entryTypes: ['measure'] })
    })
  })

  test('revenue chart initial render performance', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/investors/financials')
    
    // Wait for chart to render
    await page.waitForSelector('.recharts-wrapper', { state: 'visible' })
    
    const loadTime = Date.now() - startTime
    
    // Chart should render within 2 seconds
    expect(loadTime).toBeLessThan(2000)
    
    // Check render metrics
    const metrics = await page.evaluate(() => window.performanceMetrics)
    
    // Initial render should be fast
    const chartRender = metrics.renderTimes.find(m => m.name === 'chart-render')
    if (chartRender) {
      expect(chartRender.duration).toBeLessThan(500)
    }
  })

  test('chart data update performance', async ({ page }) => {
    await page.goto('/investors/financials')
    await page.waitForSelector('.recharts-wrapper', { state: 'visible' })
    
    // Measure re-render performance
    const updateTime = await page.evaluate(async () => {
      const start = performance.now()
      
      // Trigger data update
      const button = document.querySelector('[data-testid="refresh-data"]')
      if (button) {
        button.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      return performance.now() - start
    })
    
    // Updates should be fast
    expect(updateTime).toBeLessThan(1000)
  })

  test('multiple charts rendering performance', async ({ page }) => {
    await page.goto('/investors')
    
    // Measure time to render all charts
    const renderTime = await page.evaluate(async () => {
      const start = performance.now()
      
      // Wait for all charts
      await Promise.all([
        new Promise(resolve => {
          const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelectorAll('.recharts-wrapper').length >= 3) {
              obs.disconnect()
              resolve(true)
            }
          })
          observer.observe(document.body, { childList: true, subtree: true })
        }),
      ])
      
      return performance.now() - start
    })
    
    // All charts should render within 3 seconds
    expect(renderTime).toBeLessThan(3000)
  })

  test('chart interaction responsiveness', async ({ page }) => {
    await page.goto('/investors/financials')
    await page.waitForSelector('.recharts-wrapper', { state: 'visible' })
    
    // Test hover performance
    const chart = page.locator('.recharts-wrapper').first()
    
    const interactionTimes = []
    
    for (let i = 0; i < 10; i++) {
      const start = Date.now()
      
      // Hover over different points
      await chart.hover({ position: { x: 100 + i * 50, y: 200 } })
      await page.waitForTimeout(50)
      
      interactionTimes.push(Date.now() - start)
    }
    
    // Average interaction time should be under 100ms
    const avgTime = interactionTimes.reduce((a, b) => a + b) / interactionTimes.length
    expect(avgTime).toBeLessThan(100)
  })

  test('memory usage during chart operations', async ({ page }) => {
    await page.goto('/investors/financials')
    await page.waitForSelector('.recharts-wrapper', { state: 'visible' })
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize
      }
      return 0
    })
    
    // Perform multiple operations
    for (let i = 0; i < 5; i++) {
      // Change time range
      await page.click('[data-testid="time-range-selector"]')
      await page.click(`[data-testid="time-range-${i % 3}"]`)
      await page.waitForTimeout(500)
    }
    
    // Check memory after operations
    const finalMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize
      }
      return 0
    })
    
    // Memory increase should be reasonable (less than 50MB)
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024
    expect(memoryIncrease).toBeLessThan(50)
  })

  test('large dataset performance', async ({ page }) => {
    // Navigate with large dataset parameter
    await page.goto('/investors/financials?dataset=large')
    
    const startTime = Date.now()
    
    // Wait for chart with large dataset
    await page.waitForSelector('.recharts-wrapper', { state: 'visible' })
    
    const renderTime = Date.now() - startTime
    
    // Even with large dataset, should render within 5 seconds
    expect(renderTime).toBeLessThan(5000)
    
    // Check if virtualization is working
    const isVirtualized = await page.evaluate(() => {
      const chart = document.querySelector('.recharts-wrapper')
      return chart?.getAttribute('data-virtualized') === 'true'
    })
    
    // Large datasets should use virtualization
    expect(isVirtualized).toBeTruthy()
  })

  test('mobile chart performance', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const startTime = Date.now()
    
    await page.goto('/investors/financials')
    await page.waitForSelector('.recharts-wrapper', { state: 'visible' })
    
    const loadTime = Date.now() - startTime
    
    // Mobile should still be performant
    expect(loadTime).toBeLessThan(3000)
    
    // Check if mobile optimizations are applied
    const mobileOptimized = await page.evaluate(() => {
      const chart = document.querySelector('.recharts-wrapper')
      return chart?.classList.contains('mobile-optimized')
    })
    
    expect(mobileOptimized).toBeTruthy()
  })

  test('concurrent chart updates', async ({ page }) => {
    await page.goto('/investors')
    await page.waitForSelector('.recharts-wrapper', { state: 'visible' })
    
    // Simulate concurrent updates
    const updateTime = await page.evaluate(async () => {
      const start = performance.now()
      
      // Trigger multiple chart updates simultaneously
      const updateButtons = document.querySelectorAll('[data-testid^="update-chart-"]')
      const promises = Array.from(updateButtons).map(button => {
        button.click()
        return new Promise(resolve => setTimeout(resolve, 1000))
      })
      
      await Promise.all(promises)
      
      return performance.now() - start
    })
    
    // Concurrent updates should complete within reasonable time
    expect(updateTime).toBeLessThan(2000)
  })
})