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
      onStateChange(prev => ({ ...prev, currentStep: 'extracting', isProcessing: true }))
      onNext()
    }
  }

  return (
    <div className="space-y-spacing-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
          Upload Your Learning Materials
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Upload PDF documents, Word files, or text files containing your educational content. 
          Our AI will analyze and transform them into interactive learning experiences.
        </p>
      </div>

     
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-spacing-xl transition-all duration-normal cursor-pointer", // 32px, 200ms
          "hover:border-border-brand hover:bg-bg-brand/5", // #7B00FF
          isDragActive && "border-border-brand bg-bg-brand/10",
          state.uploadedFiles.length === 0 ? "border-border-default" : "border-border-subtle" // rgba(0,0,0,0.1), rgba(0,0,0,0.05)
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="w-12 h-12 text-text-brand mx-auto mb-spacing-md" />
          <p className="text-lg font-medium text-text-primary mb-spacing-xs">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-text-secondary mb-spacing-md">
            or click to browse your computer
          </p>
          <div className="flex items-center justify-center gap-spacing-sm text-sm text-text-tertiary">
            <Badge variant="secondary">PDF</Badge>
            <Badge variant="secondary">DOCX</Badge>
            <Badge variant="secondary">TXT</Badge>
            <Badge variant="secondary">MD</Badge>
          </div>
          <p className="text-sm text-text-tertiary mt-spacing-sm">
            Maximum file size: 50MB
          </p>
        </div>
      </div>

     
      {state.uploadedFiles.length > 0 && (
        <div className="space-y-spacing-sm">
          <h3 className="text-lg font-medium text-text-primary">
            Uploaded Files ({state.uploadedFiles.length})
          </h3>
          <div className="space-y-spacing-sm">
            {state.uploadedFiles.map(file => (
              <Card
                key={file.id}
                className="p-spacing-md flex items-center gap-spacing-md" // 16px
              >
                <FileText className="w-10 h-10 text-text-brand flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {formatFileSize(file.size)}
                  </p>
                  {file.status === 'pending' && uploadProgress[file.id] < 100 && (
                    <Progress
                      value={uploadProgress[file.id] || 0}
                      size="sm"
                      className="mt-spacing-xs" // 4px
                    />
                  )}
                </div>

                <div className="flex items-center gap-spacing-sm">
                  {file.status === 'pending' && uploadProgress[file.id] < 100 && (
                    <Loader2 className="w-5 h-5 text-text-brand animate-spin" />
                  )}
                  {file.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-text-error" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="ml-spacing-xs" // 4px
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

     
      <div className="flex justify-between items-center pt-spacing-lg">
        <div className="text-sm text-text-secondary">
          {state.uploadedFiles.length === 0 && "Upload at least one file to continue"}
          {state.uploadedFiles.length > 0 && !canProceed && "Wait for uploads to complete"}
          {canProceed && "Ready to process your materials"}
        </div>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!canProceed}
        >
          Process Materials
          <ArrowRight className="w-5 h-5 ml-spacing-sm" />
        </Button>
      </div>
    </div>
  )
}