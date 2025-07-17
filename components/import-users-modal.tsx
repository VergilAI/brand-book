"use client"

import * as React from "react"
import { Modal } from "@/components/modal"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { FileText, Download, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ImportUser {
  name: string
  email: string
  role: string
  phone?: string
  location?: string
  department?: string
  manager?: string
}

export interface ImportUsersModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onImport?: (users: ImportUser[]) => void
  existingEmails?: string[]
  validRoles?: string[]
}

export function ImportUsersModal({
  open,
  onOpenChange,
  onImport,
  existingEmails = [],
  validRoles = ['Super Admin', 'Admin', 'Manager', 'Instructor'],
}: ImportUsersModalProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<ImportUser[]>([])
  const [errors, setErrors] = React.useState<string[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)

  const parseCSV = (text: string): ImportUser[] => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim())
      const user: any = {}
      
      headers.forEach((header, i) => {
        if (values[i]) {
          user[header] = values[i]
        }
      })
      
      return user as ImportUser
    })
  }

  const validateUsers = (users: ImportUser[]): string[] => {
    const errors: string[] = []
    const emails = new Set<string>()
    
    users.forEach((user, index) => {
      const row = index + 2 // Account for header row
      
      // Required fields
      if (!user.name) errors.push(`Row ${row}: Name is required`)
      if (!user.email) errors.push(`Row ${row}: Email is required`)
      if (!user.role) errors.push(`Row ${row}: Role is required`)
      
      // Email validation
      if (user.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(user.email)) {
          errors.push(`Row ${row}: Invalid email format`)
        }
        
        if (existingEmails.includes(user.email)) {
          errors.push(`Row ${row}: Email already exists`)
        }
        
        if (emails.has(user.email)) {
          errors.push(`Row ${row}: Duplicate email in file`)
        }
        emails.add(user.email)
      }
      
      // Role validation
      if (user.role && !validRoles.includes(user.role)) {
        errors.push(`Row ${row}: Invalid role. Must be one of: ${validRoles.join(', ')}`)
      }
    })
    
    return errors
  }

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setIsProcessing(true)
    setErrors([])
    setPreview([])
    
    try {
      const text = await selectedFile.text()
      const users = parseCSV(text)
      
      if (users.length === 0) {
        setErrors(['No users found in file'])
        return
      }
      
      const validationErrors = validateUsers(users)
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
      } else {
        setPreview(users)
      }
    } catch (error) {
      setErrors(['Failed to parse CSV file. Please check the format.'])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadTemplate = () => {
    const template = `Name,Email,Role,Phone,Location,Department,Manager
John Doe,john.doe@example.com,Manager,+1234567890,New York,Engineering,Jane Smith
Jane Smith,jane.smith@example.com,Admin,,San Francisco,HR,
Bob Johnson,bob.johnson@example.com,Instructor,+0987654321,Chicago,Sales,John Doe`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'user_import_template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (preview.length > 0 && errors.length === 0) {
      onImport?.(preview)
      handleReset()
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview([])
    setErrors([])
    setIsProcessing(false)
  }

  React.useEffect(() => {
    if (!open) {
      handleReset()
    }
  }, [open])

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Import Users"
      description="Upload a CSV file to import multiple users at once"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
            {file && errors.length === 0 && preview.length > 0
              ? `Ready to import ${preview.length} users`
              : 'Select a file to continue'}
          </p>
          <div className="flex gap-spacing-sm"> {/* 8px */}
            <Button
              variant="ghost"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!file || errors.length > 0 || preview.length === 0 || isProcessing}
            >
              Import Users
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-spacing-sm"> {/* 8px - minimal spacing between sections */}
        {!file ? (
          <>
            {/* File Upload Section */}
            <div>
              <FileUpload
                accept=".csv"
                maxSize={5}
                onFileSelect={handleFileSelect}
                onError={(error) => setErrors([error])}
              />
            </div>

            {/* Template Download Section */}
            <div>
              <Card className="bg-transparent border-2 border-border-brand rounded-lg shadow-none p-spacing-xl"> {/* Custom styling without hover effects */}
                <div className="flex items-start gap-spacing-lg"> {/* 24px - increased gap */}
                  <FileText className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" /> {/* #7B00FF */}
                  <div className="flex-1 space-y-spacing-xs"> {/* 4px - minimal spacing */}
                    <h4 className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
                      Need a template?
                    </h4>
                    <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
                      Download our CSV template with the correct format and example data
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDownloadTemplate}
                      className="mt-spacing-md" /* 16px - increased */
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Format Requirements Section */}
            <div>
              <div className="bg-secondary rounded-lg p-spacing-md space-y-spacing-xs"> {/* #F5F5F7, 12px, 16px, 4px - more compact */}
                <h4 className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
                  CSV Format Requirements
                </h4>
                <ul className="space-y-1 text-sm text-secondary"> {/* 4px, 14px, #6C6C6D - tighter list spacing */}
                  <li>• Required columns: Name, Email, Role</li>
                  <li>• Optional columns: Phone, Location, Department, Manager</li>
                  <li>• Roles must be one of: {validRoles.join(', ')}</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-spacing-sm"> {/* 8px - minimal spacing between sections */}
            {/* File Info */}
            <Card className="p-spacing-md"> {/* 16px - reduced padding */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-spacing-md"> {/* 16px - reduced gap */}
                  <FileText className="w-5 h-5 text-brand flex-shrink-0" /> {/* #7B00FF */}
                  <div className="space-y-spacing-xs"> {/* 4px - added spacing between file info */}
                    <p className="text-base font-medium text-primary">{file.name}</p> {/* 16px, 500, #1D1D1F */}
                    <p className="text-sm text-secondary"> {/* 14px, #6C6C6D */}
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null)
                    setPreview([])
                    setErrors([])
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>

            {/* Processing */}
            {isProcessing && (
              <div className="text-center py-spacing-xl"> {/* 32px */}
                <div className="inline-flex items-center gap-spacing-sm text-secondary"> {/* 8px, #6C6C6D */}
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  Processing file...
                </div>
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && !isProcessing && (
              <div className="bg-error-light border border-error rounded-lg p-spacing-lg"> {/* #FEF2F2, #FCA5A5, 12px, 24px - reduced padding */}
                <div className="flex items-start gap-spacing-sm"> {/* 8px - reduced gap */}
                  <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" /> {/* #E51C23 */}
                  <div className="flex-1 space-y-spacing-sm"> {/* 8px - reduced spacing */}
                    <h4 className="text-base font-medium text-error"> {/* 16px, 500, #E51C23 */}
                      Validation Errors
                    </h4>
                    <ul className="space-y-spacing-xs text-sm text-error"> {/* 4px, 14px, #E51C23 - better list spacing */}
                      {errors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {errors.length > 5 && (
                        <li className="text-secondary mt-spacing-sm"> {/* #6C6C6D, 8px - added margin */}
                          ... and {errors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {preview.length > 0 && !isProcessing && (
              <div className="space-y-spacing-md"> {/* 16px - increased spacing */}
                <h4 className="text-base font-medium text-primary"> {/* 16px, 500, #1D1D1F */}
                  Preview ({preview.length} users)
                </h4>
                <div className="border border-subtle rounded-lg overflow-hidden"> {/* rgba(0,0,0,0.05), 12px */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm"> {/* 14px */}
                      <thead className="bg-secondary border-b border-subtle"> {/* #F5F5F7, rgba(0,0,0,0.05) */}
                        <tr>
                          <th className="px-spacing-md py-spacing-sm text-left font-medium text-primary"> {/* 16px, 8px, 500, #1D1D1F */}
                            Name
                          </th>
                          <th className="px-spacing-md py-spacing-sm text-left font-medium text-primary">
                            Email
                          </th>
                          <th className="px-spacing-md py-spacing-sm text-left font-medium text-primary">
                            Role
                          </th>
                          <th className="px-spacing-md py-spacing-sm text-left font-medium text-primary">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-subtle"> {/* rgba(0,0,0,0.05) */}
                        {preview.slice(0, 5).map((user, index) => (
                          <tr key={index}>
                            <td className="px-spacing-md py-spacing-sm text-primary"> {/* 16px, 8px, #1D1D1F */}
                              {user.name}
                            </td>
                            <td className="px-spacing-md py-spacing-sm text-secondary"> {/* #6C6C6D */}
                              {user.email}
                            </td>
                            <td className="px-spacing-md py-spacing-sm text-secondary">
                              {user.role}
                            </td>
                            <td className="px-spacing-md py-spacing-sm">
                              <Badge variant="success" size="sm">Valid</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {preview.length > 5 && (
                    <div className="px-spacing-md py-spacing-sm bg-secondary text-sm text-secondary border-t border-subtle"> {/* 16px, 8px, #F5F5F7, 14px, #6C6C6D, rgba(0,0,0,0.05) */}
                      And {preview.length - 5} more users...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}