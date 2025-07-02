'use client';

import { useEffect, useState } from 'react';
import { useTextEditorStore } from '@/stores/text-editor-store';
import { useTextEditor } from '@/hooks/use-text-editor';
import { EditorToolbar } from '../EditorToolbar';
import { TabPanel } from '../TabPanel';
import { EditorCanvas } from '../EditorCanvas';
import { FindReplaceDialog } from '../FindReplaceDialog';
import { ToolsPanel } from '../ToolsPanel';

export function TextEditor() {
  const { documents, activeDocumentId, createDocument, hasUnsavedChanges } = useTextEditorStore();
  const editor = useTextEditor();
  const [showFind, setShowFind] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);

  useEffect(() => {
    if (documents.length === 0) {
      createDocument();
    }
  }, [documents.length, createDocument]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'f') {
          e.preventDefault();
          setShowFind(true);
          setShowFindReplace(false);
        } else if (e.key === 'h') {
          e.preventDefault();
          setShowFindReplace(true);
          setShowFind(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!activeDocumentId) {
    return null;
  }

  return (
    <div className="h-screen flex bg-whisper-gray dark:bg-black overflow-hidden">
      {/* Fixed Tab Panel */}
      <div className="h-full">
        <TabPanel />
      </div>
      
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative">
        <EditorCanvas editor={editor} />
        <EditorToolbar 
          editor={editor}
          onFind={() => setShowFind(true)}
          onFindReplace={() => setShowFindReplace(true)}
          pageWidth={816} // Wider page width
        />
      </div>
      
      {/* Fixed Tools Panel */}
      <ToolsPanel />
      
      <FindReplaceDialog
        editor={editor}
        open={showFind}
        onOpenChange={setShowFind}
        mode="find"
      />
      
      <FindReplaceDialog
        editor={editor}
        open={showFindReplace}
        onOpenChange={setShowFindReplace}
        mode="replace"
      />
    </div>
  );
}