import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Custom render function that includes common providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Add any providers here (Theme, Router, etc.)
  return render(ui, { ...options })
}

// Mobile viewport helper
export function setMobileViewport() {
  window.innerWidth = 375
  window.innerHeight = 667
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query.includes('max-width: 768px'),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

// Tablet viewport helper
export function setTabletViewport() {
  window.innerWidth = 768
  window.innerHeight = 1024
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query.includes('max-width: 1024px') && !query.includes('max-width: 768px'),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

// Desktop viewport helper
export function setDesktopViewport() {
  window.innerWidth = 1920
  window.innerHeight = 1080
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: !query.includes('max-width'),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

// Touch event helpers
export function createTouchEvent(type: string, touches: Array<{ clientX: number; clientY: number }>) {
  return new TouchEvent(type, {
    bubbles: true,
    cancelable: true,
    touches: touches.map(touch => ({
      ...touch,
      identifier: 0,
      target: document.body,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      force: 1,
    } as any)),
  })
}

// Swipe gesture helper
export async function swipeElement(
  element: HTMLElement,
  direction: 'left' | 'right' | 'up' | 'down',
  distance: number = 100
) {
  const startX = 100
  const startY = 100
  let endX = startX
  let endY = startY

  switch (direction) {
    case 'left':
      endX = startX - distance
      break
    case 'right':
      endX = startX + distance
      break
    case 'up':
      endY = startY - distance
      break
    case 'down':
      endY = startY + distance
      break
  }

  const touchStart = createTouchEvent('touchstart', [{ clientX: startX, clientY: startY }])
  const touchMove = createTouchEvent('touchmove', [{ clientX: endX, clientY: endY }])
  const touchEnd = createTouchEvent('touchend', [])

  element.dispatchEvent(touchStart)
  element.dispatchEvent(touchMove)
  element.dispatchEvent(touchEnd)

  // Wait for any animations
  await new Promise(resolve => setTimeout(resolve, 300))
}

// Performance measurement helper
export function measureRenderTime(callback: () => void): number {
  const start = performance.now()
  callback()
  return performance.now() - start
}

// Accessibility helpers
export function checkAccessibility(element: HTMLElement) {
  const checks = {
    hasRole: !!element.getAttribute('role'),
    hasAriaLabel: !!element.getAttribute('aria-label') || !!element.getAttribute('aria-labelledby'),
    isKeyboardAccessible: element.tabIndex >= 0,
    hasSufficientTouchTarget: () => {
      const rect = element.getBoundingClientRect()
      return rect.width >= 44 && rect.height >= 44
    },
  }

  return checks
}

// Mock API response helper
export function mockApiResponse<T>(data: T, delay: number = 0) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// Chart data generator
export function generateMockChartData(months: number = 12) {
  const data = []
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  for (let i = 0; i < months; i++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + i)
    
    data.push({
      date: date.toISOString().slice(0, 7),
      revenue: Math.floor(Math.random() * 50000) + 50000,
      expenses: Math.floor(Math.random() * 20000) + 10000,
      profit: 0, // Will be calculated
    })
  }

  // Calculate profit
  data.forEach(item => {
    item.profit = item.revenue - item.expenses
  })

  return data
}

// Wait for element helper
export async function waitForElement(
  selector: string,
  timeout: number = 5000
): Promise<HTMLElement> {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector)
    if (element) {
      return element as HTMLElement
    }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  throw new Error(`Element ${selector} not found within ${timeout}ms`)
}

// Custom user event with mobile gestures
export function createMobileUser() {
  const user = userEvent.setup()
  
  return {
    ...user,
    swipeLeft: (element: HTMLElement) => swipeElement(element, 'left'),
    swipeRight: (element: HTMLElement) => swipeElement(element, 'right'),
    swipeUp: (element: HTMLElement) => swipeElement(element, 'up'),
    swipeDown: (element: HTMLElement) => swipeElement(element, 'down'),
    longPress: async (element: HTMLElement, duration: number = 500) => {
      const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }])
      element.dispatchEvent(touchStart)
      await new Promise(resolve => setTimeout(resolve, duration))
      const touchEnd = createTouchEvent('touchend', [])
      element.dispatchEvent(touchEnd)
    },
  }
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'