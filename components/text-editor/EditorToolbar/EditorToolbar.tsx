'use client';

import { useCallback, useEffect, useState, memo } from 'react';
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
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  pageWidth?: number;
}

const TEXT_SIZES = [
  { label: '12pt', value: '12pt' },
  { label: '14pt', value: '14pt' },
  { label: '16pt', value: '16pt' },
  { label: '18pt', value: '18pt' },
  { label: '20pt', value: '20pt' },
  { label: '24pt', value: '24pt' },
  { label: '28pt', value: '28pt' },
  { label: '32pt', value: '32pt' },
];

const TAB_PANEL_WIDTH = 256; // w-64 = 16rem = 256px

// Memoized toolbar button component
const ToolbarButton = memo(({ 
  onClick, 
  isActive = false, 
  title, 
  disabled = false,
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
));

ToolbarButton.displayName = 'ToolbarButton';

const ToolbarSeparator = () => (
  <div className="w-px h-6 bg-mist-gray/50 mx-1" />
);

export function EditorToolbar({ editor, onFind, onFindReplace }: EditorToolbarProps) {
  const [toolbarPosition, setToolbarPosition] = useState({ 
    left: '50%', 
    transform: 'translateX(-50%)' 
  });

  // Handlers
  const handleColorChange = useCallback((color: string) => {
    editor?.chain().focus().setColor(color).run();
  }, [editor]);

  const handleHighlightChange = useCallback((color: string) => {
    editor?.chain().focus().toggleHighlight({ color }).run();
  }, [editor]);

  const handleTextSizeChange = useCallback((size: string) => {
    editor?.chain().focus().setFontSize(size).run();
  }, [editor]);

  // Dynamic positioning based on viewport
  useEffect(() => {
    const updatePosition = () => {
      const viewportWidth = window.innerWidth;
      const documentAreaWidth = viewportWidth - TAB_PANEL_WIDTH;
      const documentCenterX = TAB_PANEL_WIDTH + (documentAreaWidth / 2);
      
      setToolbarPosition({
        left: `${documentCenterX}px`,
        transform: 'translateX(-50%)'
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  if (!editor) return null;

  const getAlignmentIcon = () => {
    if (editor.isActive({ textAlign: 'center' })) return <AlignCenter className="h-4 w-4" />;
    if (editor.isActive({ textAlign: 'right' })) return <AlignRight className="h-4 w-4" />;
    if (editor.isActive({ textAlign: 'justify' })) return <AlignJustify className="h-4 w-4" />;
    return <AlignLeft className="h-4 w-4" />;
  };

  const getCurrentTextSize = () => {
    return editor.getAttributes('textStyle')?.fontSize || '16pt';
  };

  return (
    <div 
      className="fixed top-4 z-[100]" 
      style={toolbarPosition}
    >
      <div className="bg-pure-light/95 dark:bg-gray-800/95 backdrop-blur-md rounded-full shadow-2xl border border-mist-gray/20 dark:border-gray-700 p-2">
        <div className="flex items-center gap-1">
          {/* Text size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-3 h-9 hover:bg-cosmic-purple/10 dark:hover:bg-cosmic-purple/20 text-stone-gray dark:text-gray-400 hover:text-deep-space dark:hover:text-gray-200 flex items-center gap-1"
              >
                <Type className="h-4 w-4" />
                <span className="text-xs">{getCurrentTextSize()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              {TEXT_SIZES.map((size) => (
                <DropdownMenuItem 
                  key={size.value}
                  onClick={() => handleTextSizeChange(size.value)}
                >
                  {size.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolbarSeparator />

          {/* Text formatting */}
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

          {/* Colors */}
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

          {/* Alignment */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-9 w-9 hover:bg-cosmic-purple/10 dark:hover:bg-cosmic-purple/20 text-stone-gray dark:text-gray-400 hover:text-deep-space dark:hover:text-gray-200"
              >
                {getAlignmentIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              {[
                { value: 'left', icon: AlignLeft, label: 'Align left' },
                { value: 'center', icon: AlignCenter, label: 'Align center' },
                { value: 'right', icon: AlignRight, label: 'Align right' },
                { value: 'justify', icon: AlignJustify, label: 'Justify' },
              ].map(({ value, icon: Icon, label }) => (
                <DropdownMenuItem 
                  key={value}
                  onClick={() => editor.chain().focus().setTextAlign(value).run()}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolbarSeparator />

          {/* Lists */}
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

          {/* History */}
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

          {/* Find/Replace */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
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

          {/* Stats */}
          <div className="flex items-center gap-3 px-2 text-xs text-stone-gray dark:text-gray-400">
            <span>{editor.storage.characterCount?.words() || 0} words</span>
            <span>·</span>
            <span>{editor.storage.characterCount?.characters() || 0} chars</span>
          </div>
        </div>
      </div>
    </div>
  );
}