# Vergil Design System

A comprehensive design system documentation site for Vergil, an AI orchestration platform. This site serves as both a living showcase of components and a reference that Claude Code can use when building Vergil products.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the design system.

## 📁 Project Structure

```
vergil-design-system/
├── app/                    # Next.js app router pages
├── components/
│   ├── ui/                 # Base UI components
│   ├── docs/               # Documentation components
│   └── vergil/             # Vergil-specific components
├── lib/                    # Utilities and helpers
├── content/                # MDX documentation files
├── public/                 # Static assets
└── styles/                 # Global styles and tokens
```

## 🧩 Components

### UI Components
- **Button** - Interactive button with multiple variants and states
- **Card** - Flexible container for content presentation
- **Code Block** - Syntax-highlighted code display with copy functionality
- **Component Preview** - Live component demonstration wrapper

### Vergil Components
- **Neural Network** - Animated neural network visualization
- **Living System** - Breathing animations and organic interactions

## 🎨 Design Tokens

The design system includes comprehensive design tokens:

### Colors
- **Vergil Purple** - Primary brand color (#6366F1)
- **Vergil Violet** - Secondary brand color (#A78BFA)
- **Vergil Indigo** - Accent color (#818CF8)
- **Vergil Cyan** - Success/growth color (#10B981)
- **Vergil Blue** - Information color (#3B82F6)

### Typography
- **Primary Font** - Inter (system font)
- **Secondary Font** - Lato
- **Serif Font** - Georgia

### Animations
- **Breathing** - Subtle scale animation (1-1.03)
- **Pulse Glow** - Opacity animation for highlights
- **Synaptic** - Neural connection animations

## 🤖 AI-Friendly Features

This design system is optimized for AI assistants like Claude Code:

- **Semantic HTML** - Components use semantic markup with data attributes
- **Comprehensive JSDoc** - Detailed documentation with examples and props
- **ARIA Labels** - Built-in accessibility features
- **Usage Examples** - Copy-paste ready code examples
- **Component Composition** - Clear patterns for building complex UIs

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Adding New Components

1. Create component in `components/ui/` or `components/vergil/`
2. Add comprehensive JSDoc documentation
3. Include @vergil-semantic annotations
4. Create documentation page in `app/components/[component]/page.tsx`
5. Add to navigation in `components/docs/docs-layout.tsx`

### Design Principles

1. **Living System** - Everything should feel alive with subtle animations
2. **AI-Optimized** - Clear semantic structure for AI understanding
3. **Accessibility First** - Built-in ARIA support and keyboard navigation
4. **Developer Experience** - Easy to use, well-documented components

## 📖 Documentation

Visit the live documentation site to explore:

- **Getting Started** - Introduction and setup
- **Foundations** - Colors, typography, spacing, motion
- **Components** - Interactive component library
- **Patterns** - Vergil-specific design patterns
- **AI Guide** - How to use with Claude Code

## 🔮 Living System Philosophy

Vergil's design system embodies the concept of a "living system" where:

- Elements breathe and pulse with life
- Interactions feel organic and responsive
- Neural network patterns create connections
- Gradients shift and flow naturally
- Everything responds to user presence

This creates an interface that feels intelligent and alive, perfect for an AI orchestration platform.

## 🤝 Contributing

This design system is built for internal use at Vergil. Components should:

1. Follow accessibility best practices
2. Include comprehensive documentation
3. Use semantic HTML structure
4. Support the living system aesthetic
5. Be optimized for AI assistant usage

---

Built with ❤️ for the future of AI orchestration.
