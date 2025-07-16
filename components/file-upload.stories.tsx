import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from './file-upload'
import { useState } from 'react'

const meta = {
  title: 'UI/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A drag-and-drop file upload component with validation support. Features include file size limits, file type restrictions, and visual feedback during drag operations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    accept: {
      control: 'text',
      description: 'Accepted file types (e.g., ".csv,.xlsx", "image/*")',
      table: {
        type: { summary: 'string' },
      },
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in MB',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the file upload',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onFileSelect: {
      description: 'Callback when a file is selected',
      table: {
        type: { summary: '(file: File) => void' },
      },
    },
    onError: {
      description: 'Callback when validation fails',
      table: {
        type: { summary: '(error: string) => void' },
      },
    },
  },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

// Interactive FileUpload with state
const InteractiveFileUpload = (args: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-spacing-lg"> {/* 24px */}
      <FileUpload
        {...args}
        onFileSelect={(file) => {
          setSelectedFile(file)
          setError(null)
          console.log('File selected:', file)
        }}
        onError={(err) => {
          setError(err)
          setSelectedFile(null)
          console.error('Upload error:', err)
        }}
      />
      
      {selectedFile && (
        <div className="p-spacing-md bg-success-light border border-success rounded-lg"> {/* 16px, #F0FDF4, #86EFAC, 12px */}
          <p className="text-sm font-medium text-success"> {/* 14px, 500, #0F8A0F */}
            File selected successfully!
          </p>
          <p className="text-sm text-secondary mt-spacing-xs"> {/* 14px, #6C6C6D, 4px */}
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-spacing-md bg-error-light border border-error rounded-lg"> {/* 16px, #FEF2F2, #FCA5A5, 12px */}
          <p className="text-sm font-medium text-error"> {/* 14px, 500, #E51C23 */}
            Upload Error
          </p>
          <p className="text-sm text-secondary mt-spacing-xs"> {/* 14px, #6C6C6D, 4px */}
            {error}
          </p>
        </div>
      )}
    </div>
  )
}

export const Default: Story = {
  render: (args) => <InteractiveFileUpload {...args} />,
  args: {},
}

export const CSVOnly: Story = {
  render: (args) => <InteractiveFileUpload {...args} />,
  args: {
    accept: '.csv',
    maxSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload restricted to CSV files only with a 10MB limit.',
      },
    },
  },
}

export const ImagesOnly: Story = {
  render: (args) => <InteractiveFileUpload {...args} />,
  args: {
    accept: 'image/*',
    maxSize: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload restricted to image files with a 2MB limit.',
      },
    },
  },
}

export const MultipleTypes: Story = {
  render: (args) => <InteractiveFileUpload {...args} />,
  args: {
    accept: '.pdf,.doc,.docx,.txt',
    maxSize: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload accepting multiple document types.',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state of the file upload component.',
      },
    },
  },
}

export const CustomStyling: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-spacing-lg"> {/* 24px */}
      <div>
        <h3 className="text-lg font-medium text-primary mb-spacing-md"> {/* 20px, 500, #1D1D1F, 16px */}
          Compact Version
        </h3>
        <FileUpload {...args} className="p-spacing-md" /> {/* 16px */}
      </div>
      <div>
        <h3 className="text-lg font-medium text-primary mb-spacing-md">
          Large Version
        </h3>
        <FileUpload {...args} className="p-spacing-2xl" /> {/* 48px */}
      </div>
    </div>
  ),
  args: {
    accept: '.csv',
  },
  parameters: {
    docs: {
      description: {
        story: 'Examples of custom styling using className prop.',
      },
    },
  },
}

export const InModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-spacing-lg py-spacing-sm bg-brand text-inverse rounded-md font-medium hover:bg-brand-light transition-colors" // 24px, 8px, #7B00FF, #F5F5F7, 8px, 500, #9933FF
        >
          Open Upload Modal
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-overlay" onClick={() => setOpen(false)} /> {/* rgba(0, 0, 0, 0.5) */}
            <div className="relative bg-elevated rounded-xl p-spacing-xl shadow-modal max-w-lg w-full mx-4"> {/* #FFFFFF, 16px, 32px */}
              <h2 className="text-xl font-semibold text-primary mb-spacing-md"> {/* 24px, 600, #1D1D1F, 16px */}
                Import File
              </h2>
              
              <FileUpload
                accept=".csv"
                maxSize={5}
                onFileSelect={(f) => {
                  setFile(f)
                  console.log('File selected:', f)
                }}
              />
              
              <div className="flex gap-spacing-sm justify-end mt-spacing-lg"> {/* 8px, 24px */}
                <button
                  onClick={() => setOpen(false)}
                  className="px-spacing-md py-spacing-sm text-secondary hover:text-primary transition-colors" // 16px, 8px, #6C6C6D, #1D1D1F
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (file) {
                      console.log('Uploading file:', file)
                      setOpen(false)
                    }
                  }}
                  disabled={!file}
                  className="px-spacing-md py-spacing-sm bg-brand text-inverse rounded-md font-medium hover:bg-brand-light transition-colors disabled:opacity-disabled disabled:cursor-not-allowed" // 16px, 8px, #7B00FF, #F5F5F7, 8px, 500, #9933FF, 0.4
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of FileUpload component used inside a modal dialog.',
      },
    },
  },
}