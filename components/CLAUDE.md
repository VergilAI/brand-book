# Components Library Documentation

## Current Component Structure

### UI Components (`/components/ui/`)
Core UI components used by the Investors Portal:
- `button.tsx` - Button with variants (default, secondary, ghost, destructive, outline, link)
- `card.tsx` - Card component with variants
- `input.tsx` - Form input component  
- `label.tsx` - Form label component
- `badge.tsx` - Badge component
- `sidebar.tsx` - Sidebar navigation system
- `separator.tsx` - Visual separator
- `breadcrumb.tsx` - Breadcrumb navigation

### Vergil Brand Components (`/components/vergil/`)
Brand-specific components:
- `vergil-logo.tsx` - Official logo component (variants: logo, mark, wordmark)
- `iris-pattern.tsx` - Iris pattern visualization

### Investors Components (`/components/investors/`)
Investor portal specific components:
- `FinancialSummary.tsx` - Key metrics cards
- `RevenueBreakdown.tsx` - Revenue table
- `RecurringExpenses.tsx` - Expense table
- `BurnrateChart.tsx` - D3.js runway chart
- `ProjectedRevenue.tsx` - Revenue projections
- `HypotheticalDeals.tsx` - Deal management
- `HypotheticalModal.tsx` - Deal creation form
- `AggregateCharts.tsx` - Bar chart analytics
- `AdminDashboard.tsx` - Admin panel interface
- `UserManagement.tsx` - User administration
- `DataControls.tsx` - Data export/import
- `SecuritySettings.tsx` - Security configuration
- `HistoricalAnalysis.tsx` - Historical data viewer

## Component Standards

### TypeScript & Props
- All components are fully typed
- Props include JSDoc documentation
- Use interfaces over types for props
- Export prop types for reuse

### Accessibility
- WCAG AA compliance required
- Proper ARIA labels
- Keyboard navigation support
- Focus management

### Animation Guidelines
- Use `breathing` class for living feel
- Keep animations subtle (scale 1-1.03)
- Respect prefers-reduced-motion
- Performance over complexity

### Styling Approach
- Tailwind CSS v4 utilities
- CVA for variant management
- CSS variables for theming
- Mobile-first responsive design

## Best Practices

1. **Composition over Inheritance**
   - Build complex components from simple ones
   - Use compound component patterns
   - Keep components focused

2. **Performance**
   - Lazy load heavy components
   - Optimize re-renders with memo
   - Use dynamic imports for code splitting

3. **Testing**
   - Write tests for interactive components
   - Test accessibility features
   - Verify animation performance

4. **Documentation**
   - Include usage examples
   - Document all props
   - Show common patterns
   - Note accessibility features