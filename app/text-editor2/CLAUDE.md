# Text Editor 2 - Module Documentation

## Overview
A modern, sophisticated text editor built with Next.js and React, featuring professional writing tools and a clean, distraction-free interface following Vergil's design system.

## Features

### Core Editing
- Rich text editing with contentEditable
- Real-time word/character counting
- Auto-save every 30 seconds with visual indicator
- Spell check support (browser native)
- Multiple cursor support
- Smart quotes and auto-closing brackets

### Toolbar Features
- **File Operations**: New, Open, Save, Print Preview (visual only)
- **Edit Operations**: Undo, Redo, Cut, Copy, Paste
- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Font Controls**: Font family, size (8-72pt), text/highlight color
- **Paragraph**: Alignment, line spacing, indent, lists
- **Insert**: Tables, horizontal lines, emojis
- **View**: Zoom (50-200%), ruler, line numbers, focus mode, fullscreen

### Left Sidebar
- **Document Structure**: Auto-generated heading outline, bookmarks
- **Search Panel**: Find/replace with regex, case sensitivity, whole word
- **Statistics**: Word count, character count, paragraphs, reading time

### Editor Area
- A4/Letter page simulation with margins
- Draggable margin ruler (inches/cm)
- Line numbers (toggleable)
- Active line highlighting
- Page break indicators
- Focus mode for distraction-free writing

### Status Bar
- Cursor position (line, column)
- Document statistics
- Selection statistics
- Auto-save status
- Last saved timestamp

## Architecture

### State Management
Uses Zustand store (`/stores/text-editor2-store.ts`) for:
- Document content
- Editor preferences
- UI state
- Statistics

### Component Structure
```
/components/text-editor2/
├── TextEditor/      # Main container
├── Toolbar/         # Top toolbar with all controls
├── Sidebar/         # Left panel with tabs
├── EditorArea/      # Main writing area
├── Ruler/           # Margin ruler component
└── StatusBar/       # Bottom status bar
```

### Styling
- Tailwind CSS v4
- Vergil brand colors (cosmic-purple, electric-violet)
- Custom animations (breathing, fade-in-out)
- Dark mode support
- Print-friendly styles

## Key Implementation Details

### Performance Optimizations
- Debounced input handling
- Virtual scrolling for long documents
- Lazy loading for panels
- Efficient DOM updates

### Accessibility
- Full keyboard navigation
- ARIA labels on controls
- Keyboard shortcuts with tooltips
- Screen reader compatible

### Responsive Design
- Collapsible sidebar
- Adaptive toolbar with overflow
- Maintains usability down to 768px width

## Usage

Navigate to `/text-editor2` to access the editor. All features are front-end only with visual feedback for file operations.

## Future Enhancements
- Real file system integration
- Cloud sync
- Collaborative editing
- Plugin system
- Export to multiple formats