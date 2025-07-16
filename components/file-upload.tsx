"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  onFileSelect?: (file: File) => void
  onError?: (error: string) => void
  className?: string
  disabled?: boolean
}

export function FileUpload({
  accept,
  maxSize = 5,
  onFileSelect,
  onError,
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeInBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      return `File size exceeds ${maxSize}MB limit`
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
      const fileMimeType = file.type

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase()
        }
        return fileMimeType.startsWith(type)
      })

      if (!isAccepted) {
        return `File type not accepted. Please upload ${accept} files only.`
      }
    }

    return null
  }

  const handleFile = (file: File) => {
    const error = validateFile(file)
    if (error) {
      onError?.(error)
      return
    }

    setFile(file)
    onFileSelect?.(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div
      className={cn(
        "relative cursor-pointer",
        "border-2 border-dashed",
        "rounded-lg p-spacing-md", // 16px - more compact padding
        "transition-all duration-normal", // 200ms
        "bg-secondary", // #F5F5F7
        isDragging
          ? "border-brand bg-brand-light" // #7B00FF, #F3E6FF
          : "border-default hover:border-emphasis", // rgba(0,0,0,0.1), rgba(123, 0, 255, 0.1)
        disabled && "cursor-not-allowed opacity-disabled",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center space-y-spacing-sm"> {/* 8px - reduced spacing */}
        <div
          className={cn(
            "rounded-full p-spacing-sm", // 8px - reduced padding
            "transition-all duration-normal",
            isDragging
              ? "bg-brand text-inverse" // #7B00FF, #F5F5F7
              : "bg-emphasis text-secondary" // #F0F0F2, #6C6C6D
          )}
        >
          <Upload className="h-8 w-8" />
        </div>

        <div className="text-center space-y-spacing-sm"> {/* 8px */}
          {file ? (
            <>
              <p className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
                {file.name}
              </p>
              <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
                Maximum file size: {maxSize}MB
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  )
}