'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Image, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
  Type,
  Palette,
  Table,
  Video,
  Upload
} from 'lucide-react'
import { Button } from '@/components/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/popover'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing your content...',
  className 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleFormatting = (command: string, value?: string) => {
    executeCommand(command, value)
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        
        const link = document.createElement('a')
        link.href = linkUrl
        link.textContent = linkText
        link.className = 'text-cosmic-purple hover:text-cosmic-purple/80 underline'
        
        range.insertNode(link)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
      
      setLinkUrl('')
      setLinkText('')
      setShowLinkDialog(false)
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      const img = `<img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="max-w-full h-auto rounded-lg my-4" />`
      executeCommand('insertHTML', img)
      
      setImageUrl('')
      setImageAlt('')
      setShowImageDialog(false)
    }
  }

  const insertTable = () => {
    const table = `
      <table class="border-collapse border border-gray-300 w-full my-4">
        <tr>
          <td class="border border-gray-300 p-2">Cell 1</td>
          <td class="border border-gray-300 p-2">Cell 2</td>
        </tr>
        <tr>
          <td class="border border-gray-300 p-2">Cell 3</td>
          <td class="border border-gray-300 p-2">Cell 4</td>
        </tr>
      </table>
    `
    executeCommand('insertHTML', table)
  }

  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', tag)
  }

  const insertCodeBlock = () => {
    const codeBlock = `<pre class="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto my-4"><code>// Your code here</code></pre>`
    executeCommand('insertHTML', codeBlock)
  }

  const insertQuote = () => {
    executeCommand('formatBlock', 'blockquote')
    // Add styling to blockquote
    const selection = window.getSelection()
    if (selection && selection.focusNode) {
      const blockquote = selection.focusNode.parentElement?.closest('blockquote')
      if (blockquote) {
        blockquote.className = 'border-l-4 border-cosmic-purple pl-4 italic text-gray-700 my-4'
      }
    }
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-3">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Select onValueChange={(value) => formatBlock(value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p">Paragraph</SelectItem>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Basic Formatting */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('underline')}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('insertUnorderedList')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('insertOrderedList')}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('justifyLeft')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('justifyCenter')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('justifyRight')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Insert Elements */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="link-text">Link Text</Label>
                    <Input
                      id="link-text"
                      placeholder="Enter link text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowLinkDialog(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={insertLink}>
                      Insert Link
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={showImageDialog} onOpenChange={setShowImageDialog}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Image className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="img-url">Image URL</Label>
                    <Input
                      id="img-url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="img-alt">Alt Text</Label>
                    <Input
                      id="img-alt"
                      placeholder="Describe the image"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowImageDialog(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={insertImage}>
                      Insert Image
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={insertTable}
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>

          {/* Special Blocks */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={insertQuote}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={insertCodeBlock}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('undo')}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleFormatting('redo')}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        suppressContentEditableWarning={true}
        style={{
          lineHeight: '1.6',
        }}
      />
      
      {/* Placeholder */}
      {!content && (
        <div className="absolute top-16 left-4 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  )
}