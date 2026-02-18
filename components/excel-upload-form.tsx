'use client'

import { FormEvent, useState } from 'react'
import { uploadExcelFile } from '@/app/actions/upload-excel'
import { Button } from '@/components/ui/button'

/**
 * Excel file upload form with password protection
 */
export function ExcelUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage(null)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!file || !password) {
      setMessage({ type: 'error', text: 'Please provide both file and password' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadExcelFile(formData, password)

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setFile(null)
        setPassword('')
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Upload failed',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Upload Excel Data</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Excel File (.xlsx, .xls)
          </label>
          <input
            id="file"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={loading}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && <p className="mt-2 text-sm text-green-600">Selected: {file.name}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Admin Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="Enter admin password"
            className="mt-2 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded p-3 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !file || !password}
          className="w-full"
        >
          {loading ? 'Uploading...' : 'Upload Excel'}
        </Button>
      </form>

      <p className="mt-4 text-xs text-gray-500">
        Files are securely processed and stored. Only authorized users can upload.
      </p>
    </div>
  )
}
