import { ExcelUploadForm } from '@/components/excel-upload-form'

/**
 * Admin page for uploading Excel audit files
 * Protected by password in the upload form
 */
export const metadata = {
  title: 'Admin - Upload Excel Data',
  description: 'Upload Excel files to update the audit dashboard',
}

export default function AdminUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Upload and manage audit data files</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Upload Form */}
          <div>
            <ExcelUploadForm />
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Upload Instructions</h2>
            
            <div className="space-y-6 text-sm text-gray-600">
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">File Format</h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Excel files (.xlsx or .xls)</li>
                  <li>Required sheets: "Dry Data", "Tanker Data", "Int. Audit Category", "Saf. Insp. category"</li>
                  <li>Filename must contain the year (e.g., "2024-IAnSISCHEDULE.xlsx")</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-gray-900">Required Columns</h3>
                <ul className="list-inside list-disc space-y-1">
                  <li><strong>Dry Data / Tanker Data:</strong> Vessel, Audit Date, Auditor, NC, Observations</li>
                  <li><strong>Category Sheets:</strong> Category name, values by year</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-gray-900">Data Processing</h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Files are securely processed on the server</li>
                  <li>Data is stored in encrypted format</li>
                  <li>Original Excel files are backed up for audit purposes</li>
                  <li>Dashboard updates automatically after successful upload</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-gray-900">Password</h3>
                <p>
                  Set the upload password in your environment variables as <code className="rounded bg-gray-100 px-2 py-1 font-mono">UPLOAD_PASSWORD</code>
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-blue-700">
                  <strong>Tip:</strong> You can upload files for different years. The dashboard will automatically detect and organize them by year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
