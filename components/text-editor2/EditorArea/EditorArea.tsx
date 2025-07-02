"use client";

import { forwardRef, useRef, useEffect, useState, useCallback, memo } from "react";
import { Ruler } from "../Ruler";
import { useTextEditor2Store } from "@/stores/text-editor2-store";

// Memoized line numbers component to prevent re-renders
const LineNumbers = memo(({ content }: { content: string }) => {
  const lines = content.split('\n');
  return (
    <div className="w-12 bg-gray-50 dark:bg-gray-900 border-r text-right p-2 select-none">
      {lines.map((_, index) => (
        <div key={index} className="text-xs text-gray-500 h-6 leading-6">
          {index + 1}
        </div>
      ))}
    </div>
  );
});

LineNumbers.displayName = 'LineNumbers';

interface EditorAreaProps {
  content: string;
  onChange: (content: string) => void;
  focusMode: boolean;
}

export const EditorArea = forwardRef<HTMLDivElement, EditorAreaProps>(
  ({ content, onChange, focusMode }, ref) => {
    const editorContentRef = useRef<HTMLDivElement>(null);
    const lastContentRef = useRef(content);
    const updateTimerRef = useRef<NodeJS.Timeout>();
    
    const { 
      fontSize, fontFamily, lineHeight, zoomLevel,
      showRuler, showLineNumbers, wordWrap,
      setCursorPosition, setSelectionStats,
      updateStats
    } = useTextEditor2Store();

    // Initialize content only once
    useEffect(() => {
      if (editorContentRef.current && !editorContentRef.current.textContent) {
        editorContentRef.current.textContent = content || '';
        editorContentRef.current.focus();
      }
    }, []);

    // Handle input with minimal overhead
    const handleInput = useCallback(() => {
      if (!editorContentRef.current) return;
      
      const newContent = editorContentRef.current.textContent || '';
      
      // Update parent state without blocking typing
      lastContentRef.current = newContent;
      
      // Clear existing timer
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      
      // Batch updates with a small delay
      updateTimerRef.current = setTimeout(() => {
        onChange(newContent);
        updateStats(newContent);
      }, 100);
      
    }, [onChange, updateStats]);


    // Update cursor position - debounced
    const updateCursorPosition = useCallback(() => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount || !editorContentRef.current) return;

      requestAnimationFrame(() => {
        const range = selection.getRangeAt(0);
        const text = editorContentRef.current?.textContent || "";
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editorContentRef.current!);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        
        const caretOffset = preCaretRange.toString().length;
        const lines = text.substring(0, caretOffset).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        setCursorPosition({ line, column });

        // Update selection stats if text is selected
        if (!selection.isCollapsed) {
          const selectedText = selection.toString();
          const words = selectedText.trim().split(/\s+/).filter(w => w.length > 0).length;
          const chars = selectedText.length;
          const charsNoSpaces = selectedText.replace(/\s/g, "").length;
          
          setSelectionStats({ words, chars, charsNoSpaces });
        } else {
          setSelectionStats(null);
        }
      });
    }, [setCursorPosition, setSelectionStats]);

    // Keyboard shortcuts - let the default behavior work
    const handleKeyDown = (e: React.KeyboardEvent) => {
      // The browser handles Ctrl+B, Ctrl+I, Ctrl+U natively for contentEditable
      // We just need to update our content after the command executes
      if ((e.ctrlKey || e.metaKey) && ['b', 'i', 'u'].includes(e.key.toLowerCase())) {
        setTimeout(handleInput, 10);
      }
    };

    // Apply zoom level
    const editorStyle = {
      fontSize: `${fontSize * (zoomLevel / 100)}px`,
      fontFamily: fontFamily,
      lineHeight: lineHeight,
      zoom: `${zoomLevel}%`,
    };

    return (
      <div ref={ref} className="flex-1 flex flex-col bg-white dark:bg-gray-950 relative">
        {showRuler && !focusMode && <Ruler />}
        
        <div className="flex-1 flex overflow-auto">
          {showLineNumbers && !focusMode && (
            <LineNumbers content={lastContentRef.current || ''} />
          )}
          
          <div className="flex-1 p-8 relative bg-gray-100">
            <div className="max-w-[816px] mx-auto bg-white shadow-lg min-h-[1056px] relative">
              {/* Page layout simulation - margin guides */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[144px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                <div className="absolute right-[108px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
              </div>
              
              <div
                ref={editorContentRef}
                contentEditable
                className={`outline-none min-h-full relative z-10 ${
                  wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
                } ${focusMode ? 'focus-mode-editor' : ''}`}
                style={{
                  ...editorStyle,
                  paddingTop: '72px', // 1 inch
                  paddingBottom: '72px', // 1 inch
                  paddingLeft: '144px', // 2 inches
                  paddingRight: '108px', // 1.5 inches
                  textIndent: '36px', // 0.5 inch first line indent
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onMouseUp={updateCursorPosition}
                onKeyUp={updateCursorPosition}
                suppressContentEditableWarning
                spellCheck
              />

              {/* Page break indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
        </div>

      </div>
    );
  }
);

EditorArea.displayName = "EditorArea";