"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Progress } from "@/components/atomic/progress"
import { 
  Upload, 
  FileText, 
  X, 
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseGeneratorState, UploadedFile } from "../../types"

interface FileUploadStepProps {
  state: CourseGeneratorState
  onStateChange: React.Dispatch<React.SetStateAction<CourseGeneratorState>>
  onNext: () => void
}

export function FileUploadStep({ state, onStateChange, onNext }: FileUploadStepProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: 'pending' as const
    }))

    onStateChange(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...newFiles]
    }))

    // Simulate file upload progress
    newFiles.forEach(file => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(prev => ({ ...prev, [file.id]: progress }))
        
        if (progress >= 100) {
          clearInterval(interval)
          onStateChange(prev => ({
            ...prev,
            uploadedFiles: prev.uploadedFiles.map(f =>
              f.id === file.id ? { ...f, status: 'completed' } : f
            )
          }))
        }
      }, 200)
    })
  }, [onStateChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  })

  const removeFile = (fileId: string) => {
    onStateChange(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(f => f.id !== fileId)
    }))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileId]
      return newProgress
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const canProceed = state.uploadedFiles.some(f => f.status === 'completed')

  const handleNext = () => {
    if (canProceed) {
      onStateChange(prev => ({ ...prev, currentStep: 'extract', isProcessing: true }))
      onNext()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto space-y-spacing-lg pb-spacing-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
            Upload Your Learning Materials
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Upload PDF documents, Word files, or text files containing your educational content. 
            Our AI will analyze and transform them into interactive learning experiences.
          </p>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-spacing-lg transition-all duration-normal cursor-pointer",
            "hover:border-border-brand hover:bg-bg-brand/5",
            isDragActive && "border-border-brand bg-bg-brand/10",
            state.uploadedFiles.length === 0 ? "border-border-default" : "border-border-subtle"
          )}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="w-12 h-12 text-text-brand mx-auto mb-spacing-md" />
            <p className="text-lg font-medium text-text-primary mb-spacing-xs">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-text-secondary mb-spacing-sm">
              or click to browse your computer
            </p>
            <div className="flex items-center justify-center gap-spacing-xs text-sm">
              <Badge variant="secondary" size="sm">PDF</Badge>
              <Badge variant="secondary" size="sm">DOCX</Badge>
              <Badge variant="secondary" size="sm">TXT</Badge>
              <Badge variant="secondary" size="sm">MD</Badge>
            </div>
            <p className="text-xs text-text-tertiary mt-spacing-xs">
              Maximum file size: 50MB
            </p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {state.uploadedFiles.length > 0 && (
          <div className="space-y-spacing-sm">
            <h3 className="text-lg font-medium text-text-primary">
              Uploaded Files ({state.uploadedFiles.length})
            </h3>
            <div className="grid gap-spacing-sm max-h-[300px] overflow-y-auto">
              {state.uploadedFiles.map(file => (
                <Card
                  key={file.id}
                  className="p-spacing-sm flex items-center gap-spacing-sm"
                >
                  <FileText className="w-8 h-8 text-text-brand flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatFileSize(file.size)}
                    </p>
                    {file.status === 'pending' && uploadProgress[file.id] < 100 && (
                      <Progress
                        value={uploadProgress[file.id] || 0}
                        size="sm"
                        className="mt-spacing-xs"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-spacing-xs">
                    {file.status === 'pending' && uploadProgress[file.id] < 100 && (
                      <Loader2 className="w-4 h-4 text-text-brand animate-spin" />
                    )}
                    {file.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-text-error" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        {state.uploadedFiles.length === 0 && (
          <Card className="p-spacing-md bg-bg-brand/5 border-border-brand/20">
            <div className="flex items-start gap-spacing-sm">
              <AlertCircle className="w-5 h-5 text-text-brand mt-0.5" />
              <div>
                <h3 className="font-medium text-text-primary mb-spacing-xs">
                  Tips for best results
                </h3>
                <ul className="text-sm text-text-secondary space-y-spacing-xs">
                  <li>• Upload comprehensive learning materials with clear structure</li>
                  <li>• Include documents with headings, sections, and key points</li>
                  <li>• PDFs and Word documents work best for content extraction</li>
                  <li>• You can upload multiple files to create a complete course</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Sticky Footer with Navigation */}
      <div className="sticky bottom-0 bg-bg-primary border-t border-border-subtle pt-spacing-md">
        <div className="flex justify-between items-center">
          <div className="text-sm text-text-secondary">
            {state.uploadedFiles.length > 0 && (
              <span>{state.uploadedFiles.filter(f => f.status === 'completed').length} of {state.uploadedFiles.length} files ready</span>
            )}
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!canProceed}
          >
            Extract Content
            <ArrowRight className="w-5 h-5 ml-spacing-sm" />
          </Button>
        </div>
      </div>
    </div>
  )
}