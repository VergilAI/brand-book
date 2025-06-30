# Vergil Learn Landing Module

## Overview

This module contains the Vergil Learn landing page, focusing on the educational platform built on Vergil's AI infrastructure.

## Module Structure

```
app/(vergil-learn)/
├── page.tsx          # Vergil Learn landing page
├── contact/          # Contact page
│   └── page.tsx     # Contact information
├── layout.tsx       # Module layout
└── CLAUDE.md        # This file
```

## Page Description

### Vergil Learn Landing (`/page.tsx`)
Product-specific landing for the educational platform featuring:
- LearnHero component with video demo modal
- User journey visualization carousel
- Adaptive learning capabilities
- Educational transformation messaging
- Learn-specific footer

### Contact Page (`/contact/page.tsx`)
- Company contact information
- Leadership team details
- Office locations

## Key Features

1. **Education Focus**
   - Adaptive learning that evolves with students
   - Personalized learning journeys
   - Real-time content adaptation
   - Learning retention optimization

2. **User Journey Showcase**
   - Interactive carousel demonstrating student progression
   - Before/after learning transformations
   - Success metrics visualization

3. **Demo Integration**
   - Video modal for product demonstration
   - Interactive examples
   - Clear educational benefits

## Components Used

### Vergil Learn Specific
- `LearnHero` - Specialized hero for education
- `UserJourneyCarousel` - Interactive journey showcase
- `LearnFooter` - Education-specific footer
- `Navigation` - Landing page navigation

### Shared Components
- `RadialHeatmap` - Skills visualization
- UI components from `/components/ui/`

## Design Principles

1. **Educational & Approachable**
   - Warm, inviting design
   - Clear learning benefits
   - Student-centric messaging

2. **Transformation Focus**
   - Show learning progression
   - Highlight adaptive features
   - Demonstrate personalization

3. **Trust Building**
   - Educational credibility
   - Success stories
   - Clear outcomes

## Modal Implementation

The page includes a demo video modal:
- Opens on "Watch Demo" click
- Fullscreen overlay
- Placeholder for video content
- Smooth open/close animations

## Deployment

This module can be deployed independently using:
```bash
cp .gitignore.vergil-learn .gitignore
```

## Future Enhancements

- Real video integration
- Student testimonials
- Course previews
- Pricing tiers
- Free trial signup
- Integration with LMS demo
- Success metrics dashboard