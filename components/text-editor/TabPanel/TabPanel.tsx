'use client';

import { useState } from 'react';
import { Plus, X, FileText, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextEditorStore } from '@/stores/text-editor-store';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function TabPanel() {
  const {
    documents,
    activeDocumentId,
    createDocument,
    deleteDocument,
    setActiveDocument,
    updateDocumentTitle,
  } = useTextEditorStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleRename = (docId: string, currentTitle: string) => {
    setEditingId(docId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = () => {
    if (editingId && editingTitle.trim()) {
      updateDocumentTitle(editingId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteDocument(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleTabClick = (docId: string) => {
    if (editingId !== docId) {
      setActiveDocument(docId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key >= '1' && e.key <= '9') {
        const targetIndex = parseInt(e.key) - 1;
        if (targetIndex < documents.length) {
          setActiveDocument(documents[targetIndex].id);
        }
      }
    }
  };

  return (
    <>
      <div className="w-64 h-full border-r border-mist-gray dark:border-gray-700 bg-soft-light dark:bg-gray-900 flex flex-col">
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <ThemeToggle />
          </div>
          <div className="mb-4">
          <Button
            onClick={createDocument}
            className="w-full justify-start"
            variant="outline"
            disabled={documents.length >= 10}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
          {documents.length >= 10 && (
            <p className="mt-2 text-xs text-stone-gray">Maximum 10 tabs reached</p>
          )}
        </div>

        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              className={cn(
                'group relative flex items-center rounded-md px-3 py-2 text-sm transition-all',
                'hover:bg-mist-gray dark:hover:bg-gray-800',
                activeDocumentId === doc.id && 'bg-cosmic-purple/10 text-cosmic-purple',
                'cursor-pointer'
              )}
              onClick={() => handleTabClick(doc.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={0}
            >
              <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
              
              {editingId === doc.id ? (
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={handleSaveRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveRename();
                    } else if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-6 px-1 py-0 text-sm"
                  autoFocus
                />
              ) : (
                <span className="flex-1 truncate">{doc.title}</span>
              )}

              {doc.isDirty && (
                <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-neural-pink animate-breathing" />
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleRename(doc.id, doc.title)}>
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteConfirmId(doc.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {documents.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(doc.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

          <div className="mt-auto pt-8 space-y-1 text-xs text-stone-gray dark:text-gray-400">
            <p>Keyboard shortcuts:</p>
            <p>⌘1-9: Switch tabs</p>
            <p>⌘N: New document</p>
            <p>⌘W: Close tab</p>
          </div>
        </div>
      </div>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              {deleteConfirmId && documents.find(d => d.id === deleteConfirmId)?.isDirty ? (
                <>This document has unsaved changes. Are you sure you want to delete it?</>
              ) : (
                <>Are you sure you want to delete this document? This action cannot be undone.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}