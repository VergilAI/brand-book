"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Toolbar } from "../Toolbar";
import { Sidebar } from "../Sidebar";
import { EditorArea } from "../EditorArea";
import { StatusBar } from "../StatusBar";
import { useTextEditor2Store } from "@/stores/text-editor2-store";

export function TextEditor() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Use shallow comparison for store subscription
  const content = useTextEditor2Store(state => state.content);
  const setContent = useTextEditor2Store(state => state.setContent);
  const wordCount = useTextEditor2Store(state => state.wordCount);
  const charCount = useTextEditor2Store(state => state.charCount);
  const charCountNoSpaces = useTextEditor2Store(state => state.charCountNoSpaces);
  const paragraphCount = useTextEditor2Store(state => state.paragraphCount);
  const cursorPosition = useTextEditor2Store(state => state.cursorPosition);
  const selectionStats = useTextEditor2Store(state => state.selectionStats);

  useEffect(() => {
    if (fullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullscreen]);
  
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, [setContent]);

  return (
    <div className={`flex flex-col h-screen bg-white dark:bg-gray-950 ${focusMode ? 'focus-mode' : ''}`}>
      {!focusMode && (
        <Toolbar 
          onFullscreen={() => setFullscreen(!fullscreen)}
          onFocusMode={() => setFocusMode(!focusMode)}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {!focusMode && (
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}
        
        <EditorArea 
          ref={editorRef}
          content={content}
          onChange={handleContentChange}
          focusMode={focusMode}
        />
      </div>
      
      {!focusMode && (
        <StatusBar 
          wordCount={wordCount}
          charCount={charCount}
          charCountNoSpaces={charCountNoSpaces}
          paragraphCount={paragraphCount}
          cursorPosition={cursorPosition}
          selectionStats={selectionStats}
        />
      )}

      {focusMode && (
        <button
          className="fixed top-4 right-4 p-2 rounded-md bg-cosmic-purple/10 hover:bg-cosmic-purple/20 text-cosmic-purple transition-colors"
          onClick={() => setFocusMode(false)}
          aria-label="Exit focus mode"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}