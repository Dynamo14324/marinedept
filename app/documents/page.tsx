'use client'

import { useState } from 'react'
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Share2,
  MoreVertical,
  Calendar,
  User,
  File,
  Search,
} from 'lucide-react'
import { FileUpload } from '@/components/file-upload'
import { cn } from '@/lib/utils'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'excel' | 'csv' | 'image' | 'other'
  size: number
  uploadedAt: string
  uploadedBy: string
  status: 'ready' | 'processing' | 'archived'
  tags: string[]
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: '2024_Q4_Financial_Report.xlsx',
      type: 'excel',
      size: 2048000,
      uploadedAt: '2024-12-15',
      uploadedBy: 'Admin',
      status: 'ready',
      tags: ['financial', 'quarterly'],
    },
    {
      id: '2',
      name: 'Marine_Operations_Summary.pdf',
      type: 'pdf',
      size: 1536000,
      uploadedAt: '2024-12-14',
      uploadedBy: 'Manager',
      status: 'ready',
      tags: ['operations', 'summary'],
    },
    {
      id: '3',
      name: 'Budget_Allocation_2025.csv',
      type: 'csv',
      size: 512000,
      uploadedAt: '2024-12-10',
      uploadedBy: 'Director',
      status: 'ready',
      tags: ['budget', 'planning'],
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleFileSelect = (file: File) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: (file.name.split('.').pop()?.toLowerCase() || 'other') as Document['type'],
      size: file.size,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      status: 'processing',
      tags: [],
    }

    setDocuments([newDocument, ...documents])
    setShowUploadModal(false)

    // Simulate processing
    setTimeout(() => {
      setDocuments(docs =>
        docs.map(d => (d.id === newDocument.id ? { ...d, status: 'ready' } : d))
      )
    }, 2000)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !filterTag || doc.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(documents.flatMap(d => d.tags)))

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return '📄'
      case 'excel':
        return '📊'
      case 'csv':
        return '📈'
      case 'image':
        return '🖼'
      default:
        return '📎'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent">
                <FileText className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Document Management</h1>
                <p className="text-sm text-muted-foreground">
                  Upload, organize, and manage financial documents
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg border border-border p-8 max-w-md w-full">
              <h2 className="text-xl font-semibold text-foreground mb-6">Upload Document</h2>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".xlsx,.xls,.csv,.pdf,.jpg,.png"
                maxSize={100 * 1024 * 1024}
              />
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-full mt-4 px-4 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-muted-foreground font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-border bg-secondary/20 p-6">
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Total Documents
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">{documents.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/20 p-6">
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Total Size
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {formatFileSize(documents.reduce((sum, d) => sum + d.size, 0))}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/20 p-6">
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Processing
            </p>
            <p className="text-3xl font-bold text-accent mt-2">
              {documents.filter(d => d.status === 'processing').length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/20 p-6">
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Archived
            </p>
            <p className="text-3xl font-bold text-muted-foreground mt-2">
              {documents.filter(d => d.status === 'archived').length}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag(null)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  !filterTag
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
                )}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    filterTag === tag
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {filteredDocuments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-muted p-12 text-center">
              <File className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-medium">No documents found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredDocuments.map(doc => (
              <div
                key={doc.id}
                className="rounded-lg border border-border bg-secondary/20 p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex gap-4">
                    <div className="text-3xl">{getFileIcon(doc.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground break-words truncate">
                        {doc.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {doc.uploadedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {doc.uploadedBy}
                        </span>
                        <span>{formatFileSize(doc.size)}</span>
                        {doc.status === 'processing' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                            Processing
                          </span>
                        )}
                        {doc.status === 'archived' && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">
                            Archived
                          </span>
                        )}
                      </div>
                      {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded-md bg-accent/20 text-accent text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <div className="relative group">
                      <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="hidden group-hover:block absolute right-0 mt-1 w-48 rounded-lg border border-border bg-background shadow-lg z-10">
                        <button className="w-full text-left px-4 py-2 hover:bg-secondary/50 text-sm text-foreground rounded-t-lg">
                          Rename
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-secondary/50 text-sm text-foreground">
                          Move to Archive
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-secondary/50 text-sm text-red-500 rounded-b-lg flex items-center gap-2">
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
