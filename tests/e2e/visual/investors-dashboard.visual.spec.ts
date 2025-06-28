import { test, expect } from '@playwright/test'

test.describe('Investor Dashboard Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to investor dashboard
    await page.goto('/investors')
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
    
    // Wait for animations to complete
    await page.waitForTimeout(1000)
  })

  test('dashboard overview - desktop', async ({ page }) => {
    // Set viewport to desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Take screenshot
    await expect(page).toHaveScreenshot('dashboard-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('dashboard overview - tablet', async ({ page }) => {
    // Set viewport to tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Take screenshot
    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('dashboard overview - mobile', async ({ page }) => {
    // Set viewport to mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Take screenshot
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('financial charts - all viewports', async ({ page }) => {
    // Navigate to financials section
    await page.click('text=Financials')
    await page.waitForLoadState('networkidle')
    
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 },
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      
      // Wait for charts to render
      await page.waitForSelector('.recharts-wrapper', { state: 'visible' })
      await page.waitForTimeout(500)
      
      await expect(page).toHaveScreenshot(`financials-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      })
    }
  })

  test('mobile navigation states', async ({ page, browserName }) => {
    // Skip on webkit due to touch event differences
    test.skip(browserName === 'webkit', 'Touch events behave differently in WebKit')
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Closed state
    await expect(page.locator('nav[aria-label="Mobile navigation"]')).toHaveScreenshot(
      'mobile-nav-closed.png'
    )
    
    // Open menu
    await page.click('button[aria-label="Open menu"]')
    await page.waitForSelector('text=Dashboard', { state: 'visible' })
    
    // Open state
    await expect(page.locator('body')).toHaveScreenshot('mobile-nav-open.png')
  })

  test('responsive table layouts', async ({ page }) => {
    // Navigate to a page with tables
    await page.click('text=Reports')
    await page.waitForLoadState('networkidle')
    
    // Desktop table view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('[data-testid="responsive-table-desktop"]')).toHaveScreenshot(
      'table-desktop.png'
    )
    
    // Mobile card view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[data-testid="responsive-table-mobile"]')).toHaveScreenshot(
      'table-mobile-cards.png'
    )
  })

  test('dark mode consistency', async ({ page }) => {
    // Check dark mode across different sections
    const sections = [
      { path: '/investors', name: 'dashboard' },
      { path: '/investors/financials', name: 'financials' },
      { path: '/investors/reports', name: 'reports' },
      { path: '/investors/settings', name: 'settings' },
    ]
    
    for (const section of sections) {
      await page.goto(section.path)
      await page.waitForLoadState('networkidle')
      
      await expect(page).toHaveScreenshot(`dark-mode-${section.name}.png`, {
        fullPage: false,
        clip: { x: 0, y: 0, width: 1920, height: 1080 },
      })
    }
  })

  test('interactive elements hover states', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Card hover state
    const card = page.locator('.card-interactive').first()
    await card.hover()
    await page.waitForTimeout(300) // Wait for transition
    await expect(card).toHaveScreenshot('card-hover.png')
    
    // Button hover states
    const button = page.locator('button').first()
    await button.hover()
    await expect(button).toHaveScreenshot('button-hover.png')
  })

  test('loading states', async ({ page }) => {
    // Intercept API calls to simulate loading
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 2000)
    })
    
    await page.goto('/investors')
    
    // Capture loading skeleton
    await expect(page).toHaveScreenshot('loading-skeleton.png', {
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 600 },
    })
  })
})