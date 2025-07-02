"use client";

import { FileText, Type, Hash, MousePointer } from "lucide-react";
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
  const { zoomLevel } = useTextEditor2Store();

  return (
    <div className="h-7 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-700 flex items-center px-6 text-xs text-gray-500 dark:text-gray-400">
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
            <div className="w-px h-3 bg-gray-300 dark:bg-gray-600 opacity-50" />
            <div className="flex items-center gap-4">
              <span className="text-cosmic-purple dark:text-electric-violet font-medium">Selection:</span>
              <span>{selectionStats.words} words</span>
              <span>{selectionStats.chars} characters</span>
            </div>
          </>
        )}
      </div>

      {/* Zoom Level */}
      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
        <span className="font-medium">Zoom: {zoomLevel}%</span>
      </div>
    </div>
  );
}