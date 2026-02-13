'use client'

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  label?: string
}

export function FileUpload({
  onFileSelect,
  accept = '.xlsx,.xls,.csv,.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  label = 'Upload File',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    setError('')
    
    // Validate file type
    const extension = selectedFile.name.split('.').pop()?.toLowerCase()
    const validExtensions = accept.split(',').map(ext => ext.trim().replace('.', ''))
    
    if (!validExtensions.includes(extension || '')) {
      setError(`File type not supported. Accepted: ${accept}`)
      return
    }

    // Validate file size
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
      return
    }

    setFile(selectedFile)
    onFileSelect(selectedFile)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0])
    }
  }

  const handleClear = () => {
    setFile(null)
    setError('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors',
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-muted hover:border-primary/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          aria-label={label}
        />

        {!file ? (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground">
                or drag and drop your file here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported: {accept}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/20">
                  <Upload className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
