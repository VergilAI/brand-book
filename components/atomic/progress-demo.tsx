"use client"

import React from 'react'
import { Progress } from './progress'

export function ProgressDemo() {
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)

  const startUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  const courseProgress = [
    { name: 'Introduction to React', progress: 100, variant: 'success' as const },
    { name: 'State Management', progress: 75, variant: 'default' as const },
    { name: 'Advanced Patterns', progress: 45, variant: 'warning' as const },
    { name: 'Performance Optimization', progress: 0, variant: 'default' as const },
  ]

  return (
    <div className="max-w-2xl mx-auto p-spacing-lg space-y-spacing-xl">
      {/* Course Progress Section */}
      <section className="space-y-spacing-lg">
        <h2 className="text-2xl font-semibold text-primary">Course Progress</h2>
        <div className="space-y-spacing-md">
          {courseProgress.map((course) => (
            <div key={course.name} className="bg-secondary p-spacing-md rounded-lg space-y-spacing-xs">
              <Progress
                value={course.progress}
                variant={course.variant}
                label={course.name}
                showPercentage
                size="md"
              />
            </div>
          ))}
        </div>
      </section>

      {/* File Upload Section */}
      <section className="space-y-spacing-lg">
        <h2 className="text-2xl font-semibold text-primary">File Upload</h2>
        <div className="bg-secondary p-spacing-lg rounded-lg space-y-spacing-md">
          <Progress
            value={uploadProgress}
            variant={uploadProgress === 100 ? 'success' : 'default'}
            label={
              isUploading
                ? 'Uploading file...'
                : uploadProgress === 100
                ? 'Upload complete!'
                : 'Ready to upload'
            }
            showPercentage={isUploading || uploadProgress === 100}
            size="lg"
          />
          <button
            onClick={startUpload}
            disabled={isUploading}
            className="px-spacing-lg py-spacing-sm bg-primary text-primary rounded-md hover:bg-emphasis disabled:bg-disabled disabled:text-disabled transition-colors duration-normal"
          >
            {isUploading ? 'Uploading...' : uploadProgress === 100 ? 'Upload Another' : 'Start Upload'}
          </button>
        </div>
      </section>

      {/* System Resources Section */}
      <section className="space-y-spacing-lg">
        <h2 className="text-2xl font-semibold text-primary">System Resources</h2>
        <div className="grid gap-spacing-md">
          <div className="bg-secondary p-spacing-md rounded-lg">
            <Progress
              value={35}
              variant="default"
              label="CPU Usage"
              showPercentage
              size="sm"
            />
          </div>
          <div className="bg-secondary p-spacing-md rounded-lg">
            <Progress
              value={68}
              variant="warning"
              label="Memory Usage"
              showPercentage
              size="sm"
            />
          </div>
          <div className="bg-secondary p-spacing-md rounded-lg">
            <Progress
              value={92}
              variant="error"
              label="Storage Usage"
              showPercentage
              size="sm"
            />
          </div>
        </div>
      </section>

      {/* Custom Styled Progress */}
      <section className="space-y-spacing-lg">
        <h2 className="text-2xl font-semibold text-primary">Custom Styling</h2>
        <div className="bg-secondary p-spacing-lg rounded-lg">
          <Progress
            value={75}
            label="Achievement Progress"
            showPercentage
            size="lg"
            className="bg-brand/10"
            indicatorClassName="bg-gradient-to-r from-brand to-brand-accent"
          />
        </div>
      </section>
    </div>
  )
}