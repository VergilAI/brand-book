"use client";

import { FileText, Type, Hash, MousePointer, Clock } from "lucide-react";
import { useTextEditor2Store } from "@/stores/text-editor2-store";

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  paragraphCount: number;
  cursorPosition: { line: number; column: number };
  selectionStats: { words: number; chars: number; charsNoSpaces: number } | null;
}

export function StatusBar({
  wordCount,
  charCount,
  charCountNoSpaces,
  paragraphCount,
  cursorPosition,
  selectionStats,
}: StatusBarProps) {
  const { lastSaved, autoSaveEnabled } = useTextEditor2Store();

  const formatTime = (date: Date | null) => {
    if (!date) return "Not saved";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="h-8 bg-gray-100 dark:bg-gray-900 border-t flex items-center px-4 text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-6 flex-1">
        {/* Cursor Position */}
        <div className="flex items-center gap-1">
          <MousePointer className="h-3 w-3" />
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </div>

        {/* Document Stats */}
        <div className="flex items-center gap-1">
          <Type className="h-3 w-3" />
          <span>{wordCount.toLocaleString()} words</span>
        </div>

        <div className="flex items-center gap-1">
          <Hash className="h-3 w-3" />
          <span>{charCount.toLocaleString()} characters</span>
        </div>

        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>{paragraphCount} {paragraphCount === 1 ? 'paragraph' : 'paragraphs'}</span>
        </div>

        {/* Selection Stats */}
        {selectionStats && (
          <>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-4">
              <span className="text-cosmic-purple font-medium">Selection:</span>
              <span>{selectionStats.words} words</span>
              <span>{selectionStats.chars} characters</span>
            </div>
          </>
        )}
      </div>

      {/* Save Status */}
      <div className="flex items-center gap-2">
        {autoSaveEnabled && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
            <span>Auto-save on</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Saved {formatTime(lastSaved)}</span>
        </div>
      </div>
    </div>
  );
}