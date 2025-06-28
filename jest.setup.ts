import '@testing-library/jest-dom'

// Add custom matchers for accessibility testing
expect.extend({
  toBeAccessible(received) {
    const pass = received.getAttribute('aria-label') || received.getAttribute('aria-labelledby')
    return {
      pass,
      message: () => pass
        ? `expected element not to have accessible label`
        : `expected element to have aria-label or aria-labelledby attribute`,
    }
  },
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})