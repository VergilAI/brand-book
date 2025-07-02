"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Undo, Redo, Copy, Scissors, Clipboard,
  Search, Table, Minus, Smile,
  Maximize2, Eye, Ruler, Hash,
  Type, Paintbrush, PaintBucket,
  ZoomIn, ZoomOut, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useTextEditor2Store } from "@/stores/text-editor2-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolbarProps {
  onFullscreen: () => void;
  onFocusMode: () => void;
  editorRef: React.RefObject<HTMLDivElement>;
}

const fontFamilies = [
  { value: "Inter", label: "Inter" },
  { value: "Lato", label: "Lato" },
  { value: "Georgia", label: "Georgia" },
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
];

const fontSizes = [
  "8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"
];

const lineSpacings = [
  { value: "1", label: "Single" },
  { value: "1.15", label: "1.15" },
  { value: "1.5", label: "1.5" },
  { value: "2", label: "Double" },
  { value: "2.5", label: "2.5" },
  { value: "3", label: "Triple" },
];

export function Toolbar({ onFullscreen, onFocusMode, editorRef }: ToolbarProps) {
  const { 
    fontSize, fontFamily, lineHeight, zoomLevel,
    setFontSize, setFontFamily, setLineHeight, setZoomLevel,
    toggleRuler, toggleLineNumbers, showRuler, showLineNumbers,
    formatting, toggleBold, toggleItalic, 
    toggleUnderline, toggleStrikethrough, setAlignment, setFormatting
  } = useTextEditor2Store();

  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#FFFF00");

  // Get the actual contentEditable element
  const getEditor = useCallback(() => {
    if (!editorRef.current) return null;
    const contentEditable = editorRef.current.querySelector('[contenteditable="true"]');
    return contentEditable as HTMLDivElement;
  }, [editorRef]);

  // Execute formatting command
  const executeCommand = useCallback((command: string, value?: string) => {
    const editor = getEditor();
    if (!editor) return;
    
    // Focus the editor to ensure the command works
    editor.focus();
    
    // Execute the command
    document.execCommand(command, false, value);
    
    // Update the formatting state after a short delay
    setTimeout(() => {
      try {
        const isBold = document.queryCommandState('bold');
        const isItalic = document.queryCommandState('italic');
        const isUnderline = document.queryCommandState('underline');
        const isStrikethrough = document.queryCommandState('strikeThrough');
        
        // Get alignment
        let alignment: "left" | "center" | "right" | "justify" = "left";
        if (document.queryCommandState('justifyCenter')) alignment = "center";
        else if (document.queryCommandState('justifyRight')) alignment = "right";
        else if (document.queryCommandState('justifyFull')) alignment = "justify";
        
        setFormatting({
          isBold,
          isItalic,
          isUnderline,
          isStrikethrough,
          alignment
        });
      } catch (e) {
        // Ignore errors in formatting state detection
      }
    }, 10);
  }, [getEditor, setFormatting]);

  // Update formatting state based on current selection
  const updateFormattingState = useCallback(() => {
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isStrikethrough = document.queryCommandState('strikeThrough');
      
      // Get alignment
      let alignment: "left" | "center" | "right" | "justify" = "left";
      if (document.queryCommandState('justifyCenter')) alignment = "center";
      else if (document.queryCommandState('justifyRight')) alignment = "right";
      else if (document.queryCommandState('justifyFull')) alignment = "justify";
      
      setFormatting({
        isBold,
        isItalic,
        isUnderline,
        isStrikethrough,
        alignment
      });
    } catch (e) {
      // Ignore errors in formatting state detection
    }
  }, [setFormatting]);

  // Listen for selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      updateFormattingState();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    
    // Also listen for clicks and keyups on the editor
    const editor = getEditor();
    if (editor) {
      editor.addEventListener('click', updateFormattingState);
      editor.addEventListener('keyup', updateFormattingState);
    }

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (editor) {
        editor.removeEventListener('click', updateFormattingState);
        editor.removeEventListener('keyup', updateFormattingState);
      }
    };
  }, [getEditor, updateFormattingState]);

  // Format handlers
  const handleBold = useCallback(() => {
    executeCommand('bold');
  }, [executeCommand]);

  const handleItalic = useCallback(() => {
    executeCommand('italic');
  }, [executeCommand]);

  const handleUnderline = useCallback(() => {
    executeCommand('underline');
  }, [executeCommand]);

  const handleStrikethrough = useCallback(() => {
    executeCommand('strikeThrough');
  }, [executeCommand]);

  const handleAlignment = useCallback((align: "left" | "center" | "right" | "justify") => {
    const alignCommand = align === 'left' ? 'justifyLeft' : 
                        align === 'center' ? 'justifyCenter' : 
                        align === 'right' ? 'justifyRight' : 'justifyFull';
    executeCommand(alignCommand);
  }, [executeCommand]);

  const handleList = useCallback((type: 'bullet' | 'numbered') => {
    executeCommand(type === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList');
  }, [executeCommand]);

  const handleIndent = useCallback((direction: 'increase' | 'decrease') => {
    executeCommand(direction === 'increase' ? 'indent' : 'outdent');
  }, [executeCommand]);

  const handleZoomIn = () => {
    const newZoom = Math.min(200, zoomLevel + 10);
    setZoomLevel(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(50, zoomLevel - 10);
    setZoomLevel(newZoom);
  };

  return (
    <TooltipProvider>
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 p-3 flex-wrap">

          {/* Edit Operations */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 shadow-sm">
            <ToolbarButton icon={Undo} label="Undo" shortcut="Ctrl+Z" onClick={() => executeCommand('undo')} />
            <ToolbarButton icon={Redo} label="Redo" shortcut="Ctrl+Y" onClick={() => executeCommand('redo')} />
            <ToolbarButton icon={Scissors} label="Cut" shortcut="Ctrl+X" onClick={() => executeCommand('cut')} />
            <ToolbarButton icon={Copy} label="Copy" shortcut="Ctrl+C" onClick={() => executeCommand('copy')} />
            <ToolbarButton icon={Clipboard} label="Paste" shortcut="Ctrl+V" onClick={() => executeCommand('paste')} />
          </div>

          <Separator orientation="vertical" className="h-7 bg-gray-300 dark:bg-gray-600" />

          {/* Font Controls */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 shadow-sm">
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-32 h-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(parseInt(v))}>
              <SelectTrigger className="w-16 h-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-7 bg-gray-300 dark:bg-gray-600" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 shadow-sm">
            <ToolbarButton icon={Bold} label="Bold" shortcut="Ctrl+B" onClick={handleBold} active={formatting.isBold} />
            <ToolbarButton icon={Italic} label="Italic" shortcut="Ctrl+I" onClick={handleItalic} active={formatting.isItalic} />
            <ToolbarButton icon={Underline} label="Underline" shortcut="Ctrl+U" onClick={handleUnderline} active={formatting.isUnderline} />
            <ToolbarButton icon={Strikethrough} label="Strikethrough" onClick={handleStrikethrough} active={formatting.isStrikethrough} />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-white hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200">
                  <Paintbrush className="h-4 w-4" style={{ color: textColor === '#000000' ? undefined : textColor }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Color</label>
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-white hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200">
                  <PaintBucket className="h-4 w-4" style={{ color: highlightColor === '#FFFF00' ? undefined : highlightColor }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Highlight Color</label>
                  <input 
                    type="color" 
                    value={highlightColor} 
                    onChange={(e) => setHighlightColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Separator orientation="vertical" className="h-7 bg-gray-300 dark:bg-gray-600" />

          {/* Paragraph Formatting */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 shadow-sm">
            <ToolbarButton icon={AlignLeft} label="Align Left" onClick={() => handleAlignment("left")} active={formatting.alignment === "left"} />
            <ToolbarButton icon={AlignCenter} label="Align Center" onClick={() => handleAlignment("center")} active={formatting.alignment === "center"} />
            <ToolbarButton icon={AlignRight} label="Align Right" onClick={() => handleAlignment("right")} active={formatting.alignment === "right"} />
            <ToolbarButton icon={AlignJustify} label="Justify" onClick={() => handleAlignment("justify")} active={formatting.alignment === "justify"} />
            
            <Select value={lineHeight} onValueChange={setLineHeight}>
              <SelectTrigger className="w-24 h-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lineSpacings.map(spacing => (
                  <SelectItem key={spacing.value} value={spacing.value}>
                    {spacing.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ToolbarButton icon={Outdent} label="Decrease Indent" onClick={() => handleIndent('decrease')} />
            <ToolbarButton icon={Indent} label="Increase Indent" onClick={() => handleIndent('increase')} />
            <ToolbarButton icon={List} label="Bullet List" onClick={() => handleList('bullet')} />
            <ToolbarButton icon={ListOrdered} label="Numbered List" onClick={() => handleList('numbered')} />
          </div>

          <Separator orientation="vertical" className="h-7 bg-gray-300 dark:bg-gray-600" />

          {/* Insert Options */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 shadow-sm">
            <ToolbarButton icon={Table} label="Insert Table" />
            <ToolbarButton icon={Minus} label="Horizontal Line" />
            <ToolbarButton icon={Smile} label="Emoji" />
            <ToolbarButton icon={Search} label="Find & Replace" shortcut="Ctrl+F" />
          </div>

          <Separator orientation="vertical" className="h-7 bg-gray-300 dark:bg-gray-600" />

          {/* View Controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 shadow-sm">
            <div className="flex items-center gap-2 px-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <ToolbarButton icon={ZoomOut} label="Zoom Out" onClick={handleZoomOut} />
              <span className="text-sm font-medium w-12 text-center text-gray-700 dark:text-gray-300">{zoomLevel}%</span>
              <ToolbarButton icon={ZoomIn} label="Zoom In" onClick={handleZoomIn} />
            </div>
            
            <ToolbarButton 
              icon={Ruler} 
              label="Toggle Ruler" 
              onClick={toggleRuler}
              active={showRuler}
            />
            <ToolbarButton 
              icon={Hash} 
              label="Toggle Line Numbers" 
              onClick={toggleLineNumbers}
              active={showLineNumbers}
            />
            <ToolbarButton icon={Eye} label="Focus Mode" onClick={onFocusMode} />
            <ToolbarButton icon={Maximize2} label="Fullscreen" onClick={onFullscreen} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface ToolbarButtonProps {
  id?: string;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  active?: boolean;
}

function ToolbarButton({ id, icon: Icon, label, shortcut, onClick, active }: ToolbarButtonProps) {
  if (!Icon) {
    console.error(`Icon is undefined for button with label: ${label}`);
    return null;
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          id={id}
          variant={active ? "default" : "ghost"} 
          size="sm" 
          className={`h-8 w-8 p-0 transition-all duration-200 ${active ? 'bg-cosmic-purple text-white hover:bg-electric-violet shadow-md' : 'text-gray-600 dark:text-white hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm'}`}
          onClick={onClick}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col">
          <span>{label}</span>
          {shortcut && <span className="text-xs text-muted-foreground">{shortcut}</span>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}