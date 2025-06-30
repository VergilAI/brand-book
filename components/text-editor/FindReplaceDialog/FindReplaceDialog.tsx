'use client';

import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { X, Search, Replace, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FindReplaceDialogProps {
  editor: Editor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'find' | 'replace';
}

export function FindReplaceDialog({ editor, open, onOpenChange, mode }: FindReplaceDialogProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  const highlightMatches = useCallback(() => {
    if (!editor || !findText) {
      setTotalMatches(0);
      setCurrentMatch(0);
      return;
    }
    
    const content = editor.getText();
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    
    if (matches) {
      setTotalMatches(matches.length);
      setCurrentMatch(1);
    } else {
      setTotalMatches(0);
      setCurrentMatch(0);
    }
  }, [editor, findText]);

  const findNext = useCallback(() => {
    if (currentMatch < totalMatches) {
      setCurrentMatch(currentMatch + 1);
    } else if (totalMatches > 0) {
      setCurrentMatch(1);
    }
  }, [currentMatch, totalMatches]);

  const findPrevious = useCallback(() => {
    if (currentMatch > 1) {
      setCurrentMatch(currentMatch - 1);
    } else if (totalMatches > 0) {
      setCurrentMatch(totalMatches);
    }
  }, [currentMatch, totalMatches]);

  const replaceOne = useCallback(() => {
    if (!editor || !findText) return;
    
    const html = editor.getHTML();
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const newHtml = html.replace(regex, replaceText);
    
    if (newHtml !== html) {
      editor.commands.setContent(newHtml);
      highlightMatches();
    }
  }, [editor, findText, replaceText, highlightMatches]);

  const replaceAll = useCallback(() => {
    if (!editor || !findText) return;
    
    const html = editor.getHTML();
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const newHtml = html.replace(regex, replaceText);
    
    if (newHtml !== html) {
      editor.commands.setContent(newHtml);
      setFindText('');
      setReplaceText('');
      setTotalMatches(0);
      setCurrentMatch(0);
    }
  }, [editor, findText, replaceText]);

  useEffect(() => {
    highlightMatches();
  }, [findText, highlightMatches]);

  useEffect(() => {
    if (!open) {
      setFindText('');
      setReplaceText('');
      setTotalMatches(0);
      setCurrentMatch(0);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'find' ? 'Find' : 'Find & Replace'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="find">Find</Label>
            <div className="flex gap-2">
              <Input
                id="find"
                placeholder="Search for..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    findNext();
                  }
                }}
                autoFocus
              />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={findPrevious}
                  disabled={totalMatches === 0}
                  title="Previous match"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={findNext}
                  disabled={totalMatches === 0}
                  title="Next match"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {findText && (
              <p className="text-sm text-stone-gray">
                {totalMatches > 0 
                  ? `${currentMatch} of ${totalMatches} matches`
                  : 'No matches found'
                }
              </p>
            )}
          </div>

          {mode === 'replace' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="replace">Replace with</Label>
                <Input
                  id="replace"
                  placeholder="Replace with..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      replaceOne();
                    }
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={replaceOne}
                  disabled={totalMatches === 0}
                  variant="outline"
                  size="sm"
                >
                  Replace
                </Button>
                <Button
                  onClick={replaceAll}
                  disabled={totalMatches === 0}
                  variant="outline"
                  size="sm"
                >
                  Replace All
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}