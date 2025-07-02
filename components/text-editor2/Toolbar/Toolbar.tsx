"use client";

import { useState } from "react";
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Undo, Redo, Copy, Scissors, Clipboard,
  Save, FileText, FolderOpen, Printer,
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

export function Toolbar({ onFullscreen, onFocusMode }: ToolbarProps) {
  const { 
    fontSize, fontFamily, lineHeight, zoomLevel,
    setFontSize, setFontFamily, setLineHeight, setZoomLevel,
    toggleRuler, toggleLineNumbers, showRuler, showLineNumbers,
    updateLastSaved
  } = useTextEditor2Store();

  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#FFFF00");

  const handleSave = () => {
    updateLastSaved();
    // Visual feedback
    const button = document.getElementById("save-button");
    button?.classList.add("animate-pulse");
    setTimeout(() => button?.classList.remove("animate-pulse"), 1000);
  };

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
      <div className="border-b bg-white dark:bg-obsidian-black shadow-sm">
        <div className="flex items-center gap-1 p-2 flex-wrap">
          {/* File Operations */}
          <div className="flex items-center gap-1">
            <ToolbarButton icon={FileText} label="New Document" shortcut="Ctrl+N" />
            <ToolbarButton icon={FolderOpen} label="Open" shortcut="Ctrl+O" />
            <ToolbarButton 
              id="save-button"
              icon={Save} 
              label="Save" 
              shortcut="Ctrl+S"
              onClick={handleSave}
            />
            <ToolbarButton icon={Printer} label="Print Preview" shortcut="Ctrl+P" />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Edit Operations */}
          <div className="flex items-center gap-1">
            <ToolbarButton icon={Undo} label="Undo" shortcut="Ctrl+Z" />
            <ToolbarButton icon={Redo} label="Redo" shortcut="Ctrl+Y" />
            <ToolbarButton icon={Scissors} label="Cut" shortcut="Ctrl+X" />
            <ToolbarButton icon={Copy} label="Copy" shortcut="Ctrl+C" />
            <ToolbarButton icon={Clipboard} label="Paste" shortcut="Ctrl+V" />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Font Controls */}
          <div className="flex items-center gap-2">
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-32 h-8">
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
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <ToolbarButton icon={Bold} label="Bold" shortcut="Ctrl+B" />
            <ToolbarButton icon={Italic} label="Italic" shortcut="Ctrl+I" />
            <ToolbarButton icon={Underline} label="Underline" shortcut="Ctrl+U" />
            <ToolbarButton icon={Strikethrough} label="Strikethrough" />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paintbrush className="h-4 w-4" style={{ color: textColor }} />
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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <PaintBucket className="h-4 w-4" style={{ color: highlightColor }} />
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

          <Separator orientation="vertical" className="h-6" />

          {/* Paragraph Formatting */}
          <div className="flex items-center gap-1">
            <ToolbarButton icon={AlignLeft} label="Align Left" />
            <ToolbarButton icon={AlignCenter} label="Align Center" />
            <ToolbarButton icon={AlignRight} label="Align Right" />
            <ToolbarButton icon={AlignJustify} label="Justify" />
            
            <Select value={lineHeight} onValueChange={setLineHeight}>
              <SelectTrigger className="w-24 h-8">
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

            <ToolbarButton icon={Outdent} label="Decrease Indent" />
            <ToolbarButton icon={Indent} label="Increase Indent" />
            <ToolbarButton icon={List} label="Bullet List" />
            <ToolbarButton icon={ListOrdered} label="Numbered List" />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Insert Options */}
          <div className="flex items-center gap-1">
            <ToolbarButton icon={Table} label="Insert Table" />
            <ToolbarButton icon={Minus} label="Horizontal Line" />
            <ToolbarButton icon={Smile} label="Emoji" />
            <ToolbarButton icon={Search} label="Find & Replace" shortcut="Ctrl+F" />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View Controls */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 px-2">
              <ToolbarButton icon={ZoomOut} label="Zoom Out" onClick={handleZoomOut} />
              <span className="text-sm font-medium w-12 text-center">{zoomLevel}%</span>
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
          className={`h-8 w-8 p-0 ${active ? 'bg-cosmic-purple text-white hover:bg-electric-violet' : ''}`}
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