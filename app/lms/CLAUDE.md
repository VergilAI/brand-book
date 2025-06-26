# LMS Module

## Overview

The LMS (Learning Management System) module is a demo interface showcasing how Vergil's design system can be applied to educational platforms. It demonstrates authentication flows, course management, and admin interfaces.

## Module Structure

```
app/lms/
├── page.tsx              # LMS dashboard/home
├── login/                # Authentication flow
│   └── page.tsx         # Login interface
├── forgot-password/      # Password recovery
│   └── page.tsx         # Recovery flow
├── courses/              # Course management
│   └── page.tsx         # Course listing
├── admin/                # Admin interfaces
│   └── page.tsx         # Admin dashboard
└── CLAUDE.md            # This file

Related components in:
- /components/lms/        # LMS-specific components
```

## Key Features

### Authentication System
- Login page with form validation
- Password recovery flow
- Session management (demo)
- Branded authentication UI

### Course Interface
- Course listing and filtering
- Course cards with metadata
- Progress tracking visualization
- Interactive course navigation

### Admin Dashboard
- User management interface
- Course creation tools
- Analytics visualization
- System settings

## Component Guidelines

### LMS Components (`/components/lms/`)
- Follow Vergil brand guidelines
- Use breathing animations sparingly
- Focus on clarity and usability
- Maintain accessibility standards

### Form Patterns
- Use Vergil-styled inputs
- Clear validation messages
- Loading states with brand spinner
- Success/error feedback

### Data Visualization
- Use Graph Constellation for relationships
- Apply brand colors to charts
- Animate data transitions
- Keep visualizations clean

## Design Principles

1. **Educational Focus**
   - Clear information hierarchy
   - Intuitive navigation
   - Progress visibility
   - Learner-centric design

2. **Brand Integration**
   - Subtle use of living animations
   - Brand colors for accents
   - Neural patterns for backgrounds
   - Consistent typography

3. **Accessibility**
   - WCAG AA compliance
   - Keyboard navigation
   - Screen reader support
   - Clear focus states

## Common Patterns

```tsx
// Course card
<Card variant="interactive">
  <CardHeader>
    <CardTitle>{course.title}</CardTitle>
    <CardDescription>{course.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <Progress value={course.progress} />
  </CardContent>
</Card>

// Login form
<form>
  <Input 
    type="email" 
    placeholder="Enter your email"
    className="mb-4"
  />
  <Input 
    type="password" 
    placeholder="Enter your password"
    className="mb-4"
  />
  <Button variant="default" className="w-full">
    Sign In
  </Button>
</form>
```

## Future Enhancements

- Real authentication integration
- Course content management
- Student progress tracking
- Interactive assessments
- Video player integration
- Discussion forums
- Notification system

## Notes

This is a demo implementation showcasing design system application. For production use:
- Implement proper authentication
- Add database integration
- Set up API endpoints
- Add error handling
- Implement security measures