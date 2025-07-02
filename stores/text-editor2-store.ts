import { create } from "zustand";

interface SelectionStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
}

interface CursorPosition {
  line: number;
  column: number;
}

interface TextEditor2State {
  content: string;
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  paragraphCount: number;
  readingTime: number;
  cursorPosition: CursorPosition;
  selectionStats: SelectionStats | null;
  fontSize: number;
  fontFamily: string;
  lineHeight: string;
  zoomLevel: number;
  showRuler: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
  theme: "light" | "dark";
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  
  setContent: (content: string) => void;
  updateStats: (content: string) => void;
  setCursorPosition: (position: CursorPosition) => void;
  setSelectionStats: (stats: SelectionStats | null) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setLineHeight: (height: string) => void;
  setZoomLevel: (level: number) => void;
  toggleRuler: () => void;
  toggleLineNumbers: () => void;
  toggleWordWrap: () => void;
  toggleTheme: () => void;
  toggleAutoSave: () => void;
  updateLastSaved: () => void;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function countParagraphs(text: string): number {
  return text.trim().split(/\n\n+/).filter(para => para.length > 0).length;
}

function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

export const useTextEditor2Store = create<TextEditor2State>((set) => ({
  content: "",
  wordCount: 0,
  charCount: 0,
  charCountNoSpaces: 0,
  paragraphCount: 0,
  readingTime: 0,
  cursorPosition: { line: 1, column: 1 },
  selectionStats: null,
  fontSize: 16,
  fontFamily: "Inter",
  lineHeight: "1.6",
  zoomLevel: 100,
  showRuler: true,
  showLineNumbers: false,
  wordWrap: true,
  theme: "light",
  autoSaveEnabled: true,
  lastSaved: null,
  
  setContent: (content) => set({ content }, false), // Don't notify subscribers immediately
  
  updateStats: (content) => {
    // Use requestIdleCallback for non-critical updates
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const words = countWords(content);
        const chars = content.length;
        const charsNoSpaces = content.replace(/\s/g, "").length;
        const paragraphs = countParagraphs(content);
        const readingTime = calculateReadingTime(words);
        
        set({
          wordCount: words,
          charCount: chars,
          charCountNoSpaces: charsNoSpaces,
          paragraphCount: paragraphs,
          readingTime,
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        const words = countWords(content);
        const chars = content.length;
        const charsNoSpaces = content.replace(/\s/g, "").length;
        const paragraphs = countParagraphs(content);
        const readingTime = calculateReadingTime(words);
        
        set({
          wordCount: words,
          charCount: chars,
          charCountNoSpaces: charsNoSpaces,
          paragraphCount: paragraphs,
          readingTime,
        });
      }, 0);
    }
  },
  
  setCursorPosition: (position) => set({ cursorPosition: position }),
  setSelectionStats: (stats) => set({ selectionStats: stats }),
  setFontSize: (size) => set({ fontSize: size }),
  setFontFamily: (family) => set({ fontFamily: family }),
  setLineHeight: (height) => set({ lineHeight: height }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  toggleRuler: () => set((state) => ({ showRuler: !state.showRuler })),
  toggleLineNumbers: () => set((state) => ({ showLineNumbers: !state.showLineNumbers })),
  toggleWordWrap: () => set((state) => ({ wordWrap: !state.wordWrap })),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  toggleAutoSave: () => set((state) => ({ autoSaveEnabled: !state.autoSaveEnabled })),
  updateLastSaved: () => set({ lastSaved: new Date() }),
}));