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

interface FormattingState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  alignment: "left" | "center" | "right" | "justify";
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
  formatting: FormattingState;
  searchQuery: string;
  searchMatches: number[];
  currentMatchIndex: number;
  
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
  setFormatting: (formatting: Partial<FormattingState>) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleStrikethrough: () => void;
  setAlignment: (alignment: "left" | "center" | "right" | "justify") => void;
  setSearchQuery: (query: string) => void;
  findMatches: (query: string, content: string) => void;
  goToNextMatch: () => void;
  goToPreviousMatch: () => void;
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
  lineHeight: "1.8",
  zoomLevel: 100,
  showRuler: true,
  showLineNumbers: false,
  wordWrap: true,
  theme: "light",
  formatting: {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    alignment: "left",
  },
  searchQuery: "",
  searchMatches: [],
  currentMatchIndex: -1,
  
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
  setFormatting: (formatting) => set((state) => ({ 
    formatting: { ...state.formatting, ...formatting } 
  })),
  toggleBold: () => set((state) => ({ 
    formatting: { ...state.formatting, isBold: !state.formatting.isBold } 
  })),
  toggleItalic: () => set((state) => ({ 
    formatting: { ...state.formatting, isItalic: !state.formatting.isItalic } 
  })),
  toggleUnderline: () => set((state) => ({ 
    formatting: { ...state.formatting, isUnderline: !state.formatting.isUnderline } 
  })),
  toggleStrikethrough: () => set((state) => ({ 
    formatting: { ...state.formatting, isStrikethrough: !state.formatting.isStrikethrough } 
  })),
  setAlignment: (alignment) => set((state) => ({ 
    formatting: { ...state.formatting, alignment } 
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  findMatches: (query, content) => {
    if (!query) {
      set({ searchMatches: [], currentMatchIndex: -1 });
      return;
    }
    
    const matches: number[] = [];
    const lowerQuery = query.toLowerCase();
    const lowerContent = content.toLowerCase();
    let index = 0;
    
    while ((index = lowerContent.indexOf(lowerQuery, index)) !== -1) {
      matches.push(index);
      index += query.length;
    }
    
    set({ searchMatches: matches, currentMatchIndex: matches.length > 0 ? 0 : -1 });
  },
  goToNextMatch: () => set((state) => ({
    currentMatchIndex: state.searchMatches.length > 0 
      ? (state.currentMatchIndex + 1) % state.searchMatches.length 
      : -1
  })),
  goToPreviousMatch: () => set((state) => ({
    currentMatchIndex: state.searchMatches.length > 0 
      ? (state.currentMatchIndex - 1 + state.searchMatches.length) % state.searchMatches.length 
      : -1
  })),
}));