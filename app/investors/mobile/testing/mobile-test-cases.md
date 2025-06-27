# Mobile Test Cases for Investors Portal

## Test Case Categories

### 1. Navigation Tests

#### TC-NAV-001: Mobile Menu Toggle
**Preconditions:** User on mobile device (< 768px)
**Steps:**
1. Load investors portal
2. Tap hamburger menu icon
3. Verify menu drawer opens
4. Tap outside drawer
5. Verify drawer closes

**Expected Result:** Menu opens/closes smoothly with proper animations

#### TC-NAV-002: Bottom Navigation
**Preconditions:** User on mobile device
**Steps:**
1. Scroll down on any page
2. Verify bottom nav remains fixed
3. Tap each nav item
4. Verify active state updates
5. Verify page navigation works

**Expected Result:** Bottom nav is always accessible and functional

#### TC-NAV-003: Swipe Navigation
**Preconditions:** Touch-enabled device
**Steps:**
1. Navigate to dashboard
2. Swipe left
3. Verify navigation to next section
4. Swipe right
5. Verify navigation to previous section

**Expected Result:** Swipe gestures navigate between main sections

### 2. Dashboard Tests

#### TC-DASH-001: Metric Cards Layout
**Preconditions:** Mobile viewport
**Steps:**
1. Load dashboard
2. Verify cards stack vertically
3. Check card spacing (16px)
4. Verify all content is visible
5. Test card tap interactions

**Expected Result:** Cards display in single column with proper spacing

#### TC-DASH-002: Chart Responsiveness
**Preconditions:** Various screen sizes
**Steps:**
1. Load dashboard with charts
2. Rotate device
3. Verify chart resizes
4. Test touch interactions
5. Verify tooltips work on tap

**Expected Result:** Charts adapt to screen size and support touch

#### TC-DASH-003: Data Loading States
**Preconditions:** Slow network (3G)
**Steps:**
1. Clear cache
2. Load dashboard on 3G
3. Verify skeleton screens appear
4. Wait for data load
5. Verify smooth transition

**Expected Result:** Loading states prevent layout shift

### 3. Table Tests

#### TC-TABLE-001: Table to Card Transform
**Preconditions:** Mobile viewport
**Steps:**
1. Navigate to reports section
2. Verify tables display as cards
3. Check all data is accessible
4. Test card interactions
5. Verify sorting still works

**Expected Result:** Tables transform to readable card format

#### TC-TABLE-002: Horizontal Scroll Prevention
**Preconditions:** Small screen (320px)
**Steps:**
1. Load any table view
2. Attempt horizontal scroll
3. Verify no overflow
4. Check all content fits
5. Test with long text values

**Expected Result:** No horizontal scrolling required

### 4. Form Tests

#### TC-FORM-001: Touch Input Focus
**Preconditions:** Touch device
**Steps:**
1. Navigate to any form
2. Tap input field
3. Verify keyboard appears
4. Verify viewport adjusts
5. Test field navigation

**Expected Result:** Smooth input focus with proper keyboard handling

#### TC-FORM-002: Form Validation
**Preconditions:** Mobile device
**Steps:**
1. Submit empty form
2. Verify error messages appear
3. Check error visibility
4. Fix errors
5. Verify successful submission

**Expected Result:** Clear, accessible error messaging

### 5. Performance Tests

#### TC-PERF-001: Initial Load Time
**Preconditions:** 4G network
**Steps:**
1. Clear cache
2. Load portal
3. Measure time to interactive
4. Verify < 3 seconds
5. Check all critical content loads

**Expected Result:** Page interactive within 3 seconds

#### TC-PERF-002: Scroll Performance
**Preconditions:** Long content page
**Steps:**
1. Navigate to reports list
2. Scroll quickly
3. Monitor for jank
4. Check FPS stays > 30
5. Verify smooth scrolling

**Expected Result:** 60fps scrolling performance

### 6. Accessibility Tests

#### TC-A11Y-001: Touch Target Size
**Preconditions:** Mobile device
**Steps:**
1. Audit all interactive elements
2. Verify minimum 44x44px
3. Check spacing between targets
4. Test with large fingers
5. Verify no accidental taps

**Expected Result:** All targets meet minimum size requirements

#### TC-A11Y-002: Screen Reader Navigation
**Preconditions:** VoiceOver/TalkBack enabled
**Steps:**
1. Navigate with screen reader
2. Verify all content readable
3. Check navigation order
4. Test interactive elements
5. Verify announcements

**Expected Result:** Full functionality with screen reader

### 7. Orientation Tests

#### TC-ORIENT-001: Portrait to Landscape
**Preconditions:** Tablet device
**Steps:**
1. Hold device in portrait
2. Load dashboard
3. Rotate to landscape
4. Verify layout adapts
5. Check no content cut off

**Expected Result:** Smooth transition between orientations

### 8. Offline Tests

#### TC-OFFLINE-001: Offline Message
**Preconditions:** Device offline
**Steps:**
1. Go offline
2. Try to load new data
3. Verify offline message
4. Check cached data available
5. Go online and verify sync

**Expected Result:** Clear offline state with cached data access

## Test Execution Matrix

| Test Case | iPhone SE | iPhone 14 | Galaxy S23 | iPad | Priority |
|-----------|-----------|-----------|------------|------|----------|
| TC-NAV-001 | ✓ | ✓ | ✓ | ✓ | High |
| TC-NAV-002 | ✓ | ✓ | ✓ | - | High |
| TC-DASH-001 | ✓ | ✓ | ✓ | ✓ | High |
| TC-DASH-002 | ✓ | ✓ | ✓ | ✓ | High |
| TC-TABLE-001 | ✓ | ✓ | ✓ | - | Medium |
| TC-FORM-001 | ✓ | ✓ | ✓ | ✓ | Medium |
| TC-PERF-001 | ✓ | ✓ | ✓ | ✓ | High |
| TC-A11Y-001 | ✓ | ✓ | ✓ | ✓ | High |

## Automated Test Implementation

```typescript
// Example Cypress test implementation
describe('Mobile Navigation Tests', () => {
  beforeEach(() => {
    cy.viewport('iphone-14');
    cy.visit('/investors');
  });

  it('TC-NAV-001: Mobile Menu Toggle', () => {
    // Check hamburger menu is visible
    cy.get('[data-testid="mobile-menu-trigger"]').should('be.visible');
    
    // Open menu
    cy.get('[data-testid="mobile-menu-trigger"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
    
    // Close menu by clicking outside
    cy.get('body').click(0, 0);
    cy.get('[data-testid="mobile-menu"]').should('not.exist');
  });

  it('TC-NAV-002: Bottom Navigation', () => {
    // Verify bottom nav is visible
    cy.get('[data-testid="bottom-nav"]').should('be.visible');
    
    // Test each nav item
    cy.get('[data-testid="bottom-nav-dashboard"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.get('[data-testid="bottom-nav-reports"]').click();
    cy.url().should('include', '/reports');
  });
});
```

## Manual Testing Checklist

Before each release, manually verify:

- [ ] All test cases pass on priority devices
- [ ] No horizontal scrolling issues
- [ ] Touch interactions feel natural
- [ ] Loading states prevent layout shift
- [ ] Forms are easy to complete
- [ ] Navigation is intuitive
- [ ] Performance meets targets
- [ ] Accessibility requirements met
- [ ] Content is readable without zoom
- [ ] Offline experience is acceptable