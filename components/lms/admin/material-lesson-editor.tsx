'use client'

import { useState } from 'react'
import {
  Video,
  Type,
  Upload,
  Link,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  FileText,
  X,
  Image as ImageIcon,
  Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RichTextEditor } from './rich-text-editor'
import { cn } from '@/lib/utils'

interface MaterialLessonContent {
  materialType: 'video' | 'text'
  videoUrl?: string
  videoFile?: File | null
  videoSettings?: {
    autoPlay: boolean
    showControls: boolean
    loop: boolean
  }
  videoMetadata?: {
    duration?: number
    thumbnail?: string
    captions?: File | null
  }
  richTextContent?: string
}

interface MaterialLessonEditorProps {
  content: MaterialLessonContent
  onChange: (content: MaterialLessonContent) => void
}

export function MaterialLessonEditor({ content, onChange }: MaterialLessonEditorProps) {
  const [dragActive, setDragActive] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const updateContent = (updates: Partial<MaterialLessonContent>) => {
    onChange({ ...content, ...updates })
  }

  const handleVideoUpload = (file: File) => {
    updateContent({
      videoFile: file,
      videoUrl: undefined, // Clear URL when file is uploaded
      videoMetadata: {
        ...content.videoMetadata,
        duration: 0 // Will be calculated after upload
      }
    })

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
  }

  const handleVideoUrl = (url: string) => {
    updateContent({
      videoUrl: url,
      videoFile: null, // Clear file when URL is provided
      videoMetadata: {
        ...content.videoMetadata,
        duration: 0
      }
    })
    setVideoPreview(url)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/')) {
        handleVideoUpload(file)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('video/')) {
        handleVideoUpload(file)
      }
    }
  }

  const removeVideo = () => {
    updateContent({
      videoFile: null,
      videoUrl: undefined,
      videoMetadata: undefined
    })
    setVideoPreview(null)
  }

  const handleCaptionsUpload = (file: File) => {
    updateContent({
      videoMetadata: {
        ...content.videoMetadata,
        captions: file
      }
    })
  }

  const getVideoSource = () => {
    if (content.videoFile) {
      return `Video file: ${content.videoFile.name}`
    } else if (content.videoUrl) {
      return content.videoUrl
    }
    return null
  }

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const isVimeoUrl = (url: string) => {
    return url.includes('vimeo.com')
  }

  return (
    <div className="space-y-6">
      {/* Material Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Material Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={content.materialType}
            onValueChange={(value: 'video' | 'text') => updateContent({ materialType: value })}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video Material
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text Material
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="space-y-6 mt-6">
              {/* Video Upload/URL Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Video Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Method Toggle */}
                  <div>
                    <Label className="text-sm font-medium">Video Source</Label>
                    <Select
                      value={content.videoFile ? 'upload' : content.videoUrl ? 'url' : ''}
                      onValueChange={(value) => {
                        if (value === 'upload') {
                          updateContent({ videoUrl: undefined })
                        } else if (value === 'url') {
                          updateContent({ videoFile: null })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose video source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upload">Upload Video File</SelectItem>
                        <SelectItem value="url">Video URL (YouTube/Vimeo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* File Upload Area */}
                  {(!content.videoUrl && !content.videoFile) && (
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                        dragActive ? "border-cosmic-purple bg-cosmic-purple/5" : "border-gray-300"
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">Upload Video File</p>
                      <p className="text-gray-500 mb-4">Drag and drop your video here, or click to browse</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="video-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="video-upload" className="cursor-pointer">
                          Browse Files
                        </label>
                      </Button>
                      <p className="text-sm text-gray-400 mt-2">Supports MP4, MOV, AVI (Max 500MB)</p>
                    </div>
                  )}

                  {/* URL Input */}
                  {(!content.videoFile) && (
                    <div>
                      <Label htmlFor="video-url">Video URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="video-url"
                          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                          value={content.videoUrl || ''}
                          onChange={(e) => handleVideoUrl(e.target.value)}
                        />
                        {content.videoUrl && (
                          <Button variant="outline" onClick={() => handleVideoUrl('')}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {content.videoUrl && (
                        <div className="mt-2">
                          {isYouTubeUrl(content.videoUrl) && (
                            <Badge variant="outline" className="text-red-600">YouTube Video</Badge>
                          )}
                          {isVimeoUrl(content.videoUrl) && (
                            <Badge variant="outline" className="text-blue-600">Vimeo Video</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video Preview */}
                  {(content.videoFile || content.videoUrl) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Video Preview</Label>
                        <Button variant="outline" size="sm" onClick={removeVideo}>
                          <X className="h-4 w-4 mr-2" />
                          Remove Video
                        </Button>
                      </div>
                      
                      <div className="bg-black rounded-lg overflow-hidden">
                        {videoPreview && (
                          <video
                            controls
                            className="w-full max-h-64"
                            src={videoPreview}
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <strong>Source:</strong> {getVideoSource()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Video Settings */}
              {(content.videoFile || content.videoUrl) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Video Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Auto-play</Label>
                          <p className="text-xs text-gray-500">Start playing when lesson loads</p>
                        </div>
                        <Switch
                          checked={content.videoSettings?.autoPlay || false}
                          onCheckedChange={(checked) =>
                            updateContent({
                              videoSettings: {
                                ...content.videoSettings,
                                autoPlay: checked,
                                showControls: content.videoSettings?.showControls || true,
                                loop: content.videoSettings?.loop || false
                              }
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Show Controls</Label>
                          <p className="text-xs text-gray-500">Display play/pause controls</p>
                        </div>
                        <Switch
                          checked={content.videoSettings?.showControls !== false}
                          onCheckedChange={(checked) =>
                            updateContent({
                              videoSettings: {
                                ...content.videoSettings,
                                showControls: checked,
                                autoPlay: content.videoSettings?.autoPlay || false,
                                loop: content.videoSettings?.loop || false
                              }
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Loop Playback</Label>
                          <p className="text-xs text-gray-500">Repeat video automatically</p>
                        </div>
                        <Switch
                          checked={content.videoSettings?.loop || false}
                          onCheckedChange={(checked) =>
                            updateContent({
                              videoSettings: {
                                ...content.videoSettings,
                                loop: checked,
                                autoPlay: content.videoSettings?.autoPlay || false,
                                showControls: content.videoSettings?.showControls !== false
                              }
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Video Metadata */}
              {(content.videoFile || content.videoUrl) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Video Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="video-duration">Duration (minutes)</Label>
                        <Input
                          id="video-duration"
                          type="number"
                          placeholder="Auto-detected"
                          value={content.videoMetadata?.duration || ''}
                          onChange={(e) =>
                            updateContent({
                              videoMetadata: {
                                ...content.videoMetadata,
                                duration: parseInt(e.target.value) || 0
                              }
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="video-thumbnail">Thumbnail URL</Label>
                        <Input
                          id="video-thumbnail"
                          placeholder="https://example.com/thumbnail.jpg"
                          value={content.videoMetadata?.thumbnail || ''}
                          onChange={(e) =>
                            updateContent({
                              videoMetadata: {
                                ...content.videoMetadata,
                                thumbnail: e.target.value
                              }
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Closed Captions</Label>
                      <div className="mt-2">
                        {content.videoMetadata?.captions ? (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">{content.videoMetadata.captions.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateContent({
                                  videoMetadata: {
                                    ...content.videoMetadata,
                                    captions: null
                                  }
                                })
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              accept=".vtt,.srt"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCaptionsUpload(e.target.files[0])
                                }
                              }}
                              className="hidden"
                              id="captions-upload"
                            />
                            <Button asChild variant="outline" size="sm">
                              <label htmlFor="captions-upload" className="cursor-pointer">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Captions (.vtt, .srt)
                              </label>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="text" className="mt-6">
              {/* Rich Text Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Text Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    content={content.richTextContent || ''}
                    onChange={(richTextContent) => updateContent({ richTextContent })}
                    placeholder="Start writing your lesson content..."
                  />
                </CardContent>
              </Card>

              {/* Content Structure Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Use the rich text editor above to:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Format text with headings, bold, italic, and underline</li>
                      <li>Create bullet points and numbered lists</li>
                      <li>Insert links, images, and tables</li>
                      <li>Add code blocks and quotes</li>
                      <li>Align text and adjust formatting</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Live Preview */}
      {(content.materialType === 'text' && content.richTextContent) || 
       (content.materialType === 'video' && (content.videoFile || content.videoUrl)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {content.materialType === 'video' && (
              <div className="bg-black rounded-lg overflow-hidden">
                {videoPreview && (
                  <video
                    controls={content.videoSettings?.showControls !== false}
                    autoPlay={content.videoSettings?.autoPlay || false}
                    loop={content.videoSettings?.loop || false}
                    className="w-full"
                    src={videoPreview}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
            
            {content.materialType === 'text' && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content.richTextContent || '' }}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}