import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Investor Portal Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/investors')
    await injectAxe(page)
  })

  test('dashboard meets WCAG 2.1 AA standards', async ({ page }) => {
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  })

  test('navigation is keyboard accessible', async ({ page }) => {
    // Tab through main navigation
    await page.keyboard.press('Tab') // Skip to main nav
    
    // Check focus is visible
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Navigate through menu items
    const menuItems = ['Dashboard', 'Financials', 'Reports', 'Settings']
    
    for (const item of menuItems) {
      await page.keyboard.press('Tab')
      const focused = await page.locator(':focus')
      await expect(focused).toContainText(item)
    }
    
    // Test Enter key navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    // Should navigate to Financials
    await expect(page).toHaveURL(/\/financials/)
  })

  test('forms have proper labels and error handling', async ({ page }) => {
    await page.goto('/investors/settings')
    
    // Check form accessibility
    await checkA11y(page, 'form', {
      runOnly: ['label', 'aria-valid', 'aria-required'],
    })
    
    // Test form interaction
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveAttribute('aria-label', /.+/)
    
    // Submit empty form to trigger errors
    await page.locator('button[type="submit"]').click()
    
    // Check error messages are announced
    const errorMessage = page.locator('[role="alert"]')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toHaveAttribute('aria-live', 'assertive')
  })

  test('charts provide text alternatives', async ({ page }) => {
    await page.goto('/investors/financials')
    
    // Wait for charts to load
    await page.waitForSelector('.recharts-wrapper')
    
    // Check for accessible alternatives
    const chartContainers = page.locator('[data-testid="chart-container"]')
    const count = await chartContainers.count()
    
    for (let i = 0; i < count; i++) {
      const container = chartContainers.nth(i)
      
      // Should have either aria-label or aria-describedby
      const hasLabel = await container.getAttribute('aria-label')
      const hasDescription = await container.getAttribute('aria-describedby')
      
      expect(hasLabel || hasDescription).toBeTruthy()
      
      // Check for data table alternative
      const tableToggle = container.locator('button:has-text("Show data table")')
      await expect(tableToggle).toBeVisible()
    }
  })

  test('modals are accessible', async ({ page }) => {
    // Open a modal
    await page.click('button:has-text("Add Transaction")')
    
    // Check modal accessibility
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()
    
    // Check focus management
    const focusedElement = await page.locator(':focus')
    const modalBounds = await modal.boundingBox()
    const focusBounds = await focusedElement.boundingBox()
    
    // Focus should be within modal
    expect(focusBounds!.x).toBeGreaterThanOrEqual(modalBounds!.x)
    expect(focusBounds!.y).toBeGreaterThanOrEqual(modalBounds!.y)
    
    // Check escape key closes modal
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
  })

  test('color contrast meets standards', async ({ page }) => {
    await checkA11y(page, undefined, {
      runOnly: ['color-contrast'],
    })
  })

  test('images have alt text', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      
      // Should have alt text or be decorative (alt="")
      expect(alt !== null).toBeTruthy()
    }
  })

  test('page has proper heading hierarchy', async ({ page }) => {
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
    
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // Check heading hierarchy
    await checkA11y(page, undefined, {
      runOnly: ['heading-order'],
    })
  })

  test('interactive elements have focus indicators', async ({ page }) => {
    // Get all interactive elements
    const interactiveSelectors = ['button', 'a', 'input', 'select', 'textarea']
    
    for (const selector of interactiveSelectors) {
      const elements = page.locator(selector)
      const count = await elements.count()
      
      if (count > 0) {
        const element = elements.first()
        await element.focus()
        
        // Check for visible focus indicator
        const focusStyles = await element.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return {
            outline: styles.outline,
            boxShadow: styles.boxShadow,
            border: styles.border,
          }
        })
        
        // Should have some focus indicator
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' ||
          focusStyles.boxShadow !== 'none' ||
          focusStyles.border !== 'none'
        
        expect(hasFocusIndicator).toBeTruthy()
      }
    }
  })

  test('touch targets meet minimum size', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const touchTargets = page.locator('button, a, input[type="checkbox"], input[type="radio"]')
    const count = await touchTargets.count()
    
    for (let i = 0; i < count; i++) {
      const target = touchTargets.nth(i)
      const box = await target.boundingBox()
      
      if (box) {
        // WCAG 2.1 requires 44x44px minimum
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('page is usable with zoom', async ({ page }) => {
    // Test at 200% zoom
    await page.evaluate(() => {
      document.body.style.zoom = '2'
    })
    
    // Check horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth
    })
    
    // Should not require horizontal scrolling at 200% zoom
    expect(hasHorizontalScroll).toBeFalsy()
    
    // Check content is still accessible
    await checkA11y(page)
  })

  test('skip links work correctly', async ({ page }) => {
    // Focus skip link
    await page.keyboard.press('Tab')
    
    const skipLink = page.locator('a:has-text("Skip to main content")')
    await expect(skipLink).toBeFocused()
    
    // Activate skip link
    await page.keyboard.press('Enter')
    
    // Check focus moved to main content
    const main = page.locator('main')
    await expect(main).toBeFocused()
  })

  test('error messages are accessible', async ({ page }) => {
    // Trigger an error
    await page.goto('/investors/invalid-page')
    
    // Check error page accessibility
    await checkA11y(page)
    
    // Error should be announced
    const error = page.locator('[role="alert"]')
    await expect(error).toBeVisible()
    await expect(error).toHaveAttribute('aria-live', 'assertive')
  })

  test('loading states are announced', async ({ page }) => {
    // Intercept API to delay response
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 2000)
    })
    
    await page.goto('/investors')
    
    // Check for loading announcement
    const loadingIndicator = page.locator('[aria-label*="Loading"]')
    await expect(loadingIndicator).toBeVisible()
    
    // Should have live region for updates
    const liveRegion = page.locator('[aria-live]')
    await expect(liveRegion).toHaveAttribute('aria-live', 'polite')
  })
})