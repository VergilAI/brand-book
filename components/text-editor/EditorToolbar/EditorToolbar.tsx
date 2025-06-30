'use client';

import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Undo,
  Redo,
  Palette,
  Highlighter,
  Search,
  Replace,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColorPalette } from '../ColorPalette';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor?: Editor;
  onFind?: () => void;
  onFindReplace?: () => void;
}

export function EditorToolbar({ editor, onFind, onFindReplace }: EditorToolbarProps) {
  const handleColorChange = useCallback((color: string) => {
    editor?.chain().focus().setColor(color).run();
  }, [editor]);

  const handleHighlightChange = useCallback((color: string) => {
    editor?.chain().focus().toggleHighlight({ color }).run();
  }, [editor]);

  const getAlignmentIcon = () => {
    if (editor?.isActive({ textAlign: 'center' })) return <AlignCenter className="h-4 w-4" />;
    if (editor?.isActive({ textAlign: 'right' })) return <AlignRight className="h-4 w-4" />;
    if (editor?.isActive({ textAlign: 'justify' })) return <AlignJustify className="h-4 w-4" />;
    return <AlignLeft className="h-4 w-4" />;
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    title, 
    disabled,
    children 
  }: { 
    onClick: () => void;
    isActive?: boolean;
    title: string;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full h-9 w-9 hover:bg-cosmic-purple/10 dark:hover:bg-cosmic-purple/20 transition-all duration-200",
        isActive ? 'bg-cosmic-purple/20 text-cosmic-purple dark:bg-cosmic-purple/30 dark:text-electric-violet' : 'text-stone-gray dark:text-gray-400 hover:text-deep-space dark:hover:text-gray-200'
      )}
      title={title}
    >
      {children}
    </Button>
  );

  const ToolbarSeparator = () => (
    <div className="w-px h-6 bg-mist-gray/50 mx-1" />
  );

  return (
    <div className="bg-pure-light/95 dark:bg-gray-800/95 backdrop-blur-md rounded-full shadow-2xl border border-mist-gray/20 dark:border-gray-700 p-2">
      <div className="flex items-center gap-1">
          {/* Text formatting group */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (⌘B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (⌘I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Underline (⌘U)"
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <ToolbarSeparator />

          {/* Color group */}
          <div className="flex items-center">
            <ColorPalette
              icon={<Palette className="h-4 w-4" />}
              onColorSelect={handleColorChange}
              title="Text color"
            />
            <ColorPalette
              icon={<Highlighter className="h-4 w-4" />}
              onColorSelect={handleHighlightChange}
              title="Highlight color"
            />
          </div>

          <ToolbarSeparator />

          {/* Alignment dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                title="Text alignment"
                className="rounded-full h-9 w-9 hover:bg-cosmic-purple/10 dark:hover:bg-cosmic-purple/20 text-stone-gray dark:text-gray-400 hover:text-deep-space dark:hover:text-gray-200"
              >
                {getAlignmentIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                <AlignLeft className="h-4 w-4 mr-2" />
                Align left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                <AlignCenter className="h-4 w-4 mr-2" />
                Align center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                <AlignRight className="h-4 w-4 mr-2" />
                Align right
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
                <AlignJustify className="h-4 w-4 mr-2" />
                Justify
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolbarSeparator />

          {/* List group */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet list"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered list"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().liftListItem('listItem').run()}
              disabled={!editor.can().liftListItem('listItem')}
              title="Outdent (Shift+Tab)"
            >
              <Outdent className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
              disabled={!editor.can().sinkListItem('listItem')}
              title="Indent (Tab)"
            >
              <Indent className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <ToolbarSeparator />

          {/* History group */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (⌘Z)"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (⌘⇧Z)"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <ToolbarSeparator />

          {/* Find/Replace dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                title="Find"
                className="rounded-full h-9 w-9 hover:bg-cosmic-purple/10 dark:hover:bg-cosmic-purple/20 text-stone-gray dark:text-gray-400 hover:text-deep-space dark:hover:text-gray-200"
              >
                <Search className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              <DropdownMenuItem onClick={onFind}>
                <Search className="h-4 w-4 mr-2" />
                Find (⌘F)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onFindReplace}>
                <Replace className="h-4 w-4 mr-2" />
                Find & Replace (⌘H)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolbarSeparator />

          {/* Word/character count */}
          <div className="flex items-center gap-3 px-2 text-xs text-stone-gray dark:text-gray-400">
            <span>{editor.storage.characterCount?.words() || 0} words</span>
            <span>·</span>
            <span>{editor.storage.characterCount?.characters() || 0} chars</span>
        </div>
      </div>
    </div>
  );
}