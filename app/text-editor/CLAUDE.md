# Text Editor Module

## Overview

A sleek, intuitive multi-document text editor built with the Vergil design system. Features rich text editing, multi-tab document management, and comprehensive formatting options.

## Features

### Core Functionality
- Rich text editing with TipTap
- Multi-tab document management (max 10 tabs)
- Full formatting toolbar (bold, italic, underline, strikethrough)
- Text and highlight color pickers (full spectrum)
- Text alignment (left, center, right, justify)
- Bullet and numbered lists
- Undo/redo with history
- File import/export (.txt, .md)
- Unsaved changes warning
- Character and word count

### Keyboard Shortcuts
- **⌘B**: Bold
- **⌘I**: Italic
- **⌘U**: Underline
- **⌘Z/⌘⇧Z**: Undo/Redo
- **⌘C/⌘X/⌘V**: Copy/Cut/Paste
- **⌘A**: Select all
- **⌘S**: Save (exports file)
- **⌘N**: New document
- **⌘W**: Close current tab
- **⌘1-9**: Switch to tab 1-9
- **Tab/⇧Tab**: Indent/Outdent

## Technical Details

### State Management
- Zustand store for document management
- Browser LocalStorage for persistence (future)
- Tracks dirty state for unsaved changes

### Components
- `TextEditor`: Main container with layout
- `EditorToolbar`: Formatting controls and file operations
- `TabPanel`: Document tab management
- `EditorCanvas`: TipTap editor integration

### Storage Strategy
- Frontend-only implementation
- Manual save downloads files
- No cloud storage or backend
- Future: LocalStorage/IndexedDB for persistence

## Usage

Access the text editor at `/text-editor`.

## Development Notes

### Known Limitations
- Font size selector temporarily removed (TipTap version conflict)
- PDF export not yet implemented
- RTF import not yet implemented
- Find & Replace not yet implemented

### Future Enhancements
- LocalStorage/IndexedDB persistence
- More file formats (PDF export, RTF import)
- Find & Replace functionality
- Print support
- Focus mode (distraction-free)
- Line numbers toggle
- Custom themes