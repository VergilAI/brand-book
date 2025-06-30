'use client';

import { useEffect, useState } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import { useTextEditorStore } from '@/stores/text-editor-store';
import { MarginRuler } from '../MarginRuler';

interface EditorCanvasProps {
  editor: Editor | null;
  toolbar?: React.ReactNode;
}

export function EditorCanvas({ editor, toolbar }: EditorCanvasProps) {
  const { getActiveDocument, activeDocumentId } = useTextEditorStore();
  const activeDocument = getActiveDocument();
  // A3 standard: 297mm x 420mm = 842pt x 1191pt
  // Default margins: 2.54cm (1 inch) = 72pt
  const [leftMargin, setLeftMargin] = useState(72); // 1 inch = 72pt
  const [rightMargin, setRightMargin] = useState(72);
  const pageWidth = 842; // A3 width in points
  const pageHeight = 1191; // A3 height in points

  const handleMarginsChange = (left: number, right: number) => {
    setLeftMargin(left);
    setRightMargin(right);
  };

  useEffect(() => {
    if (editor && activeDocument) {
      const currentContent = editor.getHTML();
      if (currentContent !== activeDocument.content) {
        editor.commands.setContent(activeDocument.content);
      }
    }
  }, [activeDocumentId, activeDocument, editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            useTextEditorStore.getState().createDocument();
            break;
          case 'w':
            e.preventDefault();
            const store = useTextEditorStore.getState();
            if (store.documents.length > 1 && store.activeDocumentId) {
              store.deleteDocument(store.activeDocumentId);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-mist-gray dark:bg-black">
      {/* Document container with toolbar */}
      <div className="min-h-full flex flex-col items-center pt-20 pb-8">
        {/* Document wrapper for proper alignment */}
        <div className="relative" style={{ width: `${pageWidth}px` }}>
          {/* Floating toolbar positioned above the document */}
          {toolbar && (
            <div className="absolute -top-16 left-0 right-0 flex justify-center">
              {toolbar}
            </div>
          )}
          
          {/* Margin Ruler */}
          <MarginRuler onMarginsChange={handleMarginsChange} maxWidth={pageWidth} />
          
          {/* A3 Page Container */}
          <div 
            className="relative bg-pure-light dark:bg-gray-900 shadow-xl"
            style={{ 
              width: `${pageWidth}px`,
              minHeight: `${pageHeight}px`
            }}
          >
            {/* Margin indicators */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-cosmic-purple/20"
              style={{ left: `${leftMargin}px` }}
            />
            <div 
              className="absolute top-0 bottom-0 w-px bg-cosmic-purple/20"
              style={{ right: `${rightMargin}px` }}
            />
            
            {/* Editor content with margins */}
            <div
              className="min-h-full"
              style={{
                paddingLeft: `${leftMargin}px`,
                paddingRight: `${rightMargin}px`,
                paddingTop: '72px', // 1 inch top margin
                paddingBottom: '72px', // 1 inch bottom margin
              }}
            >
              <EditorContent
                editor={editor}
                className="min-h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}