import { 
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  FilePlus,
  FileMinus,
  FileCheck,
  FileX,
  Folder,
  FolderOpen,
  FolderPlus,
  Paperclip,
  Archive
} from 'lucide-react'
import { IconDefinition } from '../types'

export const fileIcons: IconDefinition[] = [
  {
    icon: File,
    name: 'File',
    category: 'file',
    description: 'Generic file',
    keywords: ['file', 'document', 'page']
  },
  {
    icon: FileText,
    name: 'FileText',
    category: 'file',
    description: 'Text document',
    keywords: ['file', 'text', 'document', 'doc']
  },
  {
    icon: FileImage,
    name: 'FileImage',
    category: 'file',
    description: 'Image file',
    keywords: ['file', 'image', 'picture', 'photo']
  },
  {
    icon: FileVideo,
    name: 'FileVideo',
    category: 'file',
    description: 'Video file',
    keywords: ['file', 'video', 'movie', 'media']
  },
  {
    icon: FileAudio,
    name: 'FileAudio',
    category: 'file',
    description: 'Audio file',
    keywords: ['file', 'audio', 'music', 'sound']
  },
  {
    icon: FileCode,
    name: 'FileCode',
    category: 'file',
    description: 'Code file',
    keywords: ['file', 'code', 'script', 'programming']
  },
  {
    icon: FileArchive,
    name: 'FileArchive',
    category: 'file',
    description: 'Archive or zip file',
    keywords: ['file', 'archive', 'zip', 'compressed']
  },
  {
    icon: FilePlus,
    name: 'FilePlus',
    category: 'file',
    description: 'Add new file',
    keywords: ['file', 'add', 'new', 'create']
  },
  {
    icon: FileCheck,
    name: 'FileCheck',
    category: 'file',
    description: 'File approved',
    keywords: ['file', 'check', 'approved', 'done']
  },
  {
    icon: FileX,
    name: 'FileX',
    category: 'file',
    description: 'File error or rejected',
    keywords: ['file', 'error', 'rejected', 'delete']
  },
  {
    icon: Folder,
    name: 'Folder',
    category: 'file',
    description: 'Folder or directory',
    keywords: ['folder', 'directory', 'container']
  },
  {
    icon: FolderOpen,
    name: 'FolderOpen',
    category: 'file',
    description: 'Open folder',
    keywords: ['folder', 'open', 'directory', 'expanded']
  },
  {
    icon: FolderPlus,
    name: 'FolderPlus',
    category: 'file',
    description: 'Create new folder',
    keywords: ['folder', 'add', 'new', 'create']
  },
  {
    icon: Paperclip,
    name: 'Paperclip',
    category: 'file',
    description: 'Attachment',
    keywords: ['attach', 'paperclip', 'file', 'document']
  },
  {
    icon: Archive,
    name: 'Archive',
    category: 'file',
    description: 'Archive or storage',
    keywords: ['archive', 'box', 'storage', 'backup']
  }
]