# Device Testing Matrix for Investors Portal

## Priority Devices

### High Priority (Must Test)
1. **iPhone 14 Pro** (390 x 844px) - Latest iOS flagship
2. **iPhone SE 2022** (375 x 667px) - Smallest modern iPhone
3. **Samsung Galaxy S23** (360 x 800px) - Android flagship
4. **iPad Air** (820 x 1180px) - Most common tablet

### Medium Priority
1. **iPhone 14 Pro Max** (430 x 932px) - Large iOS device
2. **Google Pixel 7** (412 x 915px) - Stock Android
3. **iPad Pro 11"** (834 x 1194px) - Professional tablet
4. **Samsung Galaxy Tab S8** (800 x 1280px) - Android tablet

### Low Priority
1. **iPhone 12 mini** (375 x 812px) - Compact iOS
2. **OnePlus 11** (412 x 915px) - Alternative Android
3. **Surface Duo** (540 x 720px) - Dual screen
4. **Galaxy Fold** (280 x 653px folded, 512 x 853px unfolded)

## Breakpoint System

```scss
// Mobile-first breakpoints
$mobile-sm: 320px;   // Small phones
$mobile-md: 375px;   // Standard phones
$mobile-lg: 425px;   // Large phones
$tablet: 768px;      // Tablets
$desktop: 1024px;    // Desktop
$desktop-lg: 1440px; // Large screens

// Usage in Tailwind v4
@media (min-width: 375px) { /* mobile-md */ }
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

## Browser Testing Requirements

### iOS
- Safari (latest 2 versions)
- Chrome iOS (latest)
- In-app browsers (WebKit)

### Android
- Chrome (latest 2 versions)
- Samsung Internet (latest)
- Firefox Mobile (optional)

## Testing Checklist per Device

- [ ] Layout renders correctly
- [ ] Navigation is accessible
- [ ] Touch targets are adequate (44x44px minimum)
- [ ] Scrolling is smooth
- [ ] Charts are interactive
- [ ] Forms are usable
- [ ] Modals display properly
- [ ] No horizontal scroll
- [ ] Text is readable without zooming
- [ ] Performance is acceptable

## Automated Testing Setup

```javascript
// Cypress viewport configurations
export const viewports = {
  'iphone-se': [375, 667],
  'iphone-14': [390, 844],
  'ipad-air': [820, 1180],
  'samsung-s23': [360, 800],
  'desktop': [1440, 900]
};

// Test example
describe('Mobile Responsiveness', () => {
  Object.entries(viewports).forEach(([device, [width, height]]) => {
    context(`${device} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
      });
      
      it('displays dashboard correctly', () => {
        cy.visit('/investors/dashboard');
        cy.get('[data-testid="dashboard"]').should('be.visible');
        // Add specific assertions
      });
    });
  });
});
```