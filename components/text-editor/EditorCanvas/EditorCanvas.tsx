'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import { useTextEditorStore } from '@/stores/text-editor-store';
import { MarginRuler } from '../MarginRuler';

interface EditorCanvasProps {
  editor: Editor | null;
}

// Constants
const PAGE_WIDTH = 816; // Wider page for better screen usage (~11.3 inches)
const PAGE_HEIGHT = 792; // Letter height in points (11 inches)
const DEFAULT_MARGIN = 60; // Slightly smaller margins for screen
const PAGE_PADDING = 120; // Top + bottom margins (60pt each)

export function EditorCanvas({ editor }: EditorCanvasProps) {
  const { getActiveDocument, activeDocumentId } = useTextEditorStore();
  const activeDocument = getActiveDocument();
  
  const [leftMargin, setLeftMargin] = useState(DEFAULT_MARGIN);
  const [rightMargin, setRightMargin] = useState(DEFAULT_MARGIN);
  const [pageCount, setPageCount] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleMarginsChange = useCallback((left: number, right: number) => {
    setLeftMargin(left);
    setRightMargin(right);
  }, []);

  // Calculate available height for content on each page
  const availableHeight = PAGE_HEIGHT - PAGE_PADDING;

  // Sync editor content with active document
  useEffect(() => {
    if (!editor || !activeDocument) return;
    
    try {
      const currentContent = editor.getHTML();
      if (currentContent !== activeDocument.content) {
        editor.commands.setContent(activeDocument.content);
      }
    } catch (error) {
      // Silently handle sync errors
    }
  }, [activeDocumentId, activeDocument, editor]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      
      const store = useTextEditorStore.getState();
      
      switch (e.key) {
        case 'n':
          e.preventDefault();
          store.createDocument();
          break;
        case 'w':
          e.preventDefault();
          if (store.documents.length > 1 && store.activeDocumentId) {
            store.deleteDocument(store.activeDocumentId);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pagination logic
  useEffect(() => {
    if (!editor || !editorRef.current) return;

    let timeoutId: NodeJS.Timeout;
    let resizeObserver: ResizeObserver | null = null;

    const calculatePages = () => {
      const editorElement = editorRef.current?.querySelector('.ProseMirror');
      if (!editorElement) return;

      // Get actual content height
      const contentHeight = (editorElement as HTMLElement).scrollHeight;
      
      // Calculate required pages
      let requiredPages = 1;
      if (contentHeight > availableHeight) {
        requiredPages = Math.ceil(contentHeight / availableHeight);
      }
      
      // Update page count if changed
      if (requiredPages !== pageCount) {
        setPageCount(requiredPages);
      }
    };

    // Debounce calculations
    const debouncedCalculate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculatePages, 50);
    };

    // Set up ResizeObserver
    const editorElement = editorRef.current?.querySelector('.ProseMirror');
    if (editorElement) {
      resizeObserver = new ResizeObserver(debouncedCalculate);
      resizeObserver.observe(editorElement);
    }

    // Listen to editor updates
    editor.on('update', debouncedCalculate);
    
    // Initial calculation
    setTimeout(calculatePages, 100);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver?.disconnect();
      editor.off('update', debouncedCalculate);
    };
  }, [editor, pageCount, availableHeight]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex flex-col h-full overflow-auto bg-mist-gray dark:bg-black"
    >
      <div className="flex flex-col items-center pt-16 pb-8">
        {/* Margin Ruler */}
        <div className="relative z-40 -mb-px">
          <MarginRuler 
            onMarginsChange={handleMarginsChange} 
            maxWidth={PAGE_WIDTH} 
          />
        </div>
        
        {/* Document container - single continuous flow */}
        <div className="relative" style={{ width: `${PAGE_WIDTH}px` }}>
          {/* Page backgrounds - purely visual, no interaction */}
          {Array.from({ length: pageCount }, (_, pageIndex) => (
            <div
              key={pageIndex}
              className="absolute pointer-events-none"
              style={{
                top: `${pageIndex * PAGE_HEIGHT}px`,
                width: `${PAGE_WIDTH}px`,
                height: `${PAGE_HEIGHT}px`,
              }}
            >
              {/* Page background */}
              <div className="absolute inset-0 bg-pure-light dark:bg-gray-900 shadow-xl" />
              
              {/* Visual page break line */}
              {pageIndex > 0 && (
                <div 
                  className="absolute -top-px left-0 right-0 h-px bg-gray-300 dark:bg-gray-600"
                  style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
                />
              )}
              
              {/* Page number */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-stone-gray dark:text-gray-500">
                Page {pageIndex + 1}
              </div>

              {/* Margin indicators */}
              <div 
                className="absolute top-0 bottom-0 w-px bg-cosmic-purple/20"
                style={{ left: `${leftMargin}px` }}
              />
              <div 
                className="absolute top-0 bottom-0 w-px bg-cosmic-purple/20"
                style={{ right: `${rightMargin}px` }}
              />
            </div>
          ))}
          
          {/* Single continuous editor */}
          <div 
            ref={editorRef}
            className="relative z-20"
            style={{
              paddingLeft: `${leftMargin}px`,
              paddingRight: `${rightMargin}px`,
              paddingTop: `${DEFAULT_MARGIN}px`,
              paddingBottom: `${DEFAULT_MARGIN}px`,
              minHeight: `${PAGE_HEIGHT * pageCount}px`,
            }}
          >
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}