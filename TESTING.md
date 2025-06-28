# Vergil Investor Portal - Testing Documentation

## Overview

This document provides comprehensive guidance on testing the Vergil Investor Portal, with a focus on mobile responsiveness, accessibility, performance, and visual regression testing.

## Test Architecture

### Testing Stack

- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Visual Regression**: Playwright
- **Accessibility Testing**: jest-axe + axe-playwright
- **Performance Testing**: Playwright + Lighthouse CI
- **CI/CD**: GitHub Actions

### Test Categories

1. **Unit Tests** - Component logic and behavior
2. **Integration Tests** - Component interactions
3. **E2E Tests** - User flows and scenarios
4. **Visual Regression Tests** - UI consistency
5. **Performance Tests** - Load times and responsiveness
6. **Accessibility Tests** - WCAG compliance

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run mobile-specific tests
npm run test:mobile

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run accessibility tests
npm run test:a11y

# Run visual regression tests
npx playwright test --project=visual-regression
```

### CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`

## Test Structure

### Unit Tests

Located in `__tests__` directories next to components:

```
components/investors/
├── MobileNav.tsx
├── __tests__/
│   ├── MobileNav.test.tsx
│   ├── SwipeableCard.test.tsx
│   └── ResponsiveTable.test.tsx
```

#### Mobile Testing Focus

Key areas for mobile unit tests:

1. **Touch Interactions**
   - Swipe gestures
   - Touch targets (minimum 44x44px)
   - Multi-touch prevention

2. **Responsive Layouts**
   - Viewport-based rendering
   - Breakpoint transitions
   - Orientation changes

3. **Performance**
   - Render times
   - Memory usage
   - Animation performance

Example mobile test:

```typescript
describe('MobileNav', () => {
  it('renders hamburger menu on mobile', () => {
    window.innerWidth = 375
    render(<MobileNav />)
    
    const menuButton = screen.getByLabelText('Open menu')
    expect(menuButton).toBeInTheDocument()
  })
  
  it('handles touch events properly', async () => {
    render(<MobileNav />)
    const menuButton = screen.getByLabelText('Open menu')
    
    fireEvent.touchStart(menuButton)
    fireEvent.touchEnd(menuButton)
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })
})
```

### E2E Tests

Located in `tests/e2e/`:

```
tests/e2e/
├── visual/
│   └── investors-dashboard.visual.spec.ts
├── performance/
│   └── charts.perf.spec.ts
└── accessibility/
    └── investors.a11y.spec.ts
```

#### Visual Regression Tests

Visual tests capture screenshots across viewports:

```typescript
test('dashboard overview - mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  
  await expect(page).toHaveScreenshot('dashboard-mobile.png', {
    fullPage: true,
    animations: 'disabled',
  })
})
```

Viewports tested:
- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080

#### Performance Tests

Performance tests measure:
- Initial load time
- Chart rendering speed
- Interaction responsiveness
- Memory usage

```typescript
test('chart initial render performance', async ({ page }) => {
  const startTime = Date.now()
  
  await page.goto('/investors/financials')
  await page.waitForSelector('.recharts-wrapper')
  
  const loadTime = Date.now() - startTime
  expect(loadTime).toBeLessThan(2000)
})
```

### Accessibility Tests

Accessibility tests ensure WCAG 2.1 AA compliance:

```typescript
test('dashboard meets WCAG 2.1 AA standards', async ({ page }) => {
  await page.goto('/investors')
  await injectAxe(page)
  
  await checkA11y(page, undefined, {
    detailedReport: true,
  })
})
```

Key checks:
- Color contrast ratios
- Keyboard navigation
- Screen reader support
- Focus management
- Touch target sizes

## Test Data

### Mock Data Strategy

Use realistic mock data that represents actual use cases:

```typescript
const mockFinancialData = [
  { date: '2024-01', revenue: 50000, expenses: 15000 },
  { date: '2024-02', revenue: 55000, expenses: 16000 },
  // ... more months
]
```

### Test User Accounts

For E2E tests requiring authentication:

```
Admin: admin@test.vergil.ai / test123
Investor: investor@test.vergil.ai / test123
```

## Mobile Testing Guidelines

### Viewport Testing

Always test these viewports:

1. **Mobile Portrait**: 375x667
2. **Mobile Landscape**: 667x375
3. **Tablet Portrait**: 768x1024
4. **Tablet Landscape**: 1024x768
5. **Desktop**: 1920x1080

### Touch Interaction Testing

1. **Swipe Gestures**
   - Test swipe distance thresholds
   - Verify visual feedback
   - Check gesture cancellation

2. **Touch Targets**
   - Minimum 44x44px
   - Adequate spacing between targets
   - No overlapping hit areas

3. **Scroll Performance**
   - Smooth scrolling
   - Momentum scrolling on iOS
   - Pull-to-refresh where applicable

### Network Conditions

Test under various network conditions:

```typescript
// Simulate 3G
await page.route('**/*', route => {
  setTimeout(() => route.continue(), 1000)
})
```

## Visual Regression Testing

### Baseline Management

1. **Creating Baselines**
   ```bash
   npx playwright test --update-snapshots
   ```

2. **Reviewing Changes**
   - Check diff images in `test-results/`
   - Update baselines only for intentional changes

3. **Cross-Platform Considerations**
   - Use Docker for consistent rendering
   - Or maintain platform-specific baselines

### Best Practices

1. **Disable Animations**
   ```typescript
   await page.addStyleTag({
     content: '*, *::before, *::after { animation-duration: 0s !important; }'
   })
   ```

2. **Wait for Stability**
   ```typescript
   await page.waitForLoadState('networkidle')
   await page.waitForTimeout(500) // For any remaining animations
   ```

3. **Mask Dynamic Content**
   ```typescript
   await expect(page).toHaveScreenshot({
     mask: [page.locator('.timestamp')],
   })
   ```

## Performance Testing

### Metrics Tracked

1. **Core Web Vitals**
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

2. **Custom Metrics**
   - Chart render time < 500ms
   - Data table render < 300ms
   - Mobile menu animation < 200ms

### Performance Budgets

See `lighthouse-budget.json` for specific budgets per route.

## Accessibility Testing

### Automated Checks

1. **Color Contrast**
   - Text: 4.5:1 ratio
   - Large text: 3:1 ratio
   - Interactive elements: 3:1 ratio

2. **Keyboard Navigation**
   - All interactive elements reachable
   - Logical tab order
   - Visible focus indicators

3. **Screen Reader Support**
   - Proper ARIA labels
   - Live regions for updates
   - Semantic HTML structure

### Manual Testing Checklist

- [ ] Navigate using only keyboard
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify at 200% zoom
- [ ] Check with Windows High Contrast mode
- [ ] Test with browser extensions disabled

## CI/CD Integration

### GitHub Actions Workflow

Tests run in parallel for faster feedback:

1. **Unit Tests** - Multiple Node versions
2. **Mobile Tests** - Focused component tests
3. **E2E Tests** - Full browser automation
4. **Visual Tests** - Screenshot comparisons
5. **Accessibility Tests** - WCAG compliance
6. **Performance Tests** - Speed metrics
7. **Lighthouse CI** - Overall quality scores

### Test Reports

Access test results:

1. **GitHub Actions** - Check workflow runs
2. **Artifacts** - Download reports and screenshots
3. **Codecov** - Coverage trends
4. **Lighthouse** - Performance scores

## Debugging Tests

### Common Issues

1. **Flaky Tests**
   - Add explicit waits
   - Check for race conditions
   - Use data-testid attributes

2. **Visual Regression Failures**
   - Check for timestamp differences
   - Verify font loading
   - Consider OS rendering differences

3. **Mobile Test Failures**
   - Verify viewport is set correctly
   - Check touch event simulation
   - Test on real devices when possible

### Debug Commands

```bash
# Run specific test file
npm test MobileNav.test.tsx

# Run tests with debugging
npm test -- --detectOpenHandles

# Run Playwright with headed browser
npx playwright test --headed

# Debug specific Playwright test
npx playwright test --debug
```

## Best Practices

### Writing Tests

1. **Descriptive Names**
   ```typescript
   test('mobile navigation opens on hamburger click and traps focus')
   ```

2. **Arrange-Act-Assert**
   ```typescript
   // Arrange
   render(<Component />)
   
   // Act
   await user.click(button)
   
   // Assert
   expect(result).toBeVisible()
   ```

3. **Test User Behavior**
   - Test what users do, not implementation details
   - Focus on accessibility and usability

### Maintaining Tests

1. **Regular Updates**
   - Update snapshots intentionally
   - Review test coverage reports
   - Remove obsolete tests

2. **Performance Monitoring**
   - Track test execution time
   - Optimize slow tests
   - Parallelize where possible

3. **Documentation**
   - Document complex test scenarios
   - Explain workarounds
   - Keep this guide updated

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)