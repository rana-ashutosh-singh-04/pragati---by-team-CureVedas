import { useState } from 'react'
import { useVillages } from '../contexts/VillageContext'
import { useAuth } from '../contexts/AuthContext'
import { 
  Upload as UploadIcon, 
  FileText, 
  Map, 
  CheckCircle, 
  AlertCircle,
  Download,
  Info,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

const Upload = () => {
  const { uploadData, loading } = useVillages()
  const { isAuthenticated } = useAuth()
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadType, setUploadType] = useState('csv')
  const [uploadResult, setUploadResult] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file) => {
    const allowedTypes = uploadType === 'csv' 
      ? ['.csv', 'text/csv', 'application/vnd.ms-excel']
      : ['.json', '.geojson', 'application/json']
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    const isValidType = allowedTypes.includes(file.type) || allowedTypes.includes(fileExtension)
    
    if (!isValidType) {
      toast.error(`Please select a valid ${uploadType.toUpperCase()} file`)
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }
    
    setSelectedFile(file)
    setUploadResult(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload')
      return
    }

    try {
      const result = await uploadData(selectedFile, uploadType)
      
      if (result.success) {
        setUploadResult(result.data)
        toast.success(`Successfully uploaded ${result.data.inserted} villages`)
        setSelectedFile(null)
      } else {
        toast.error(result.message || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.')
      console.error('Upload error:', error)
    }
  }

  const downloadTemplate = () => {
    const csvTemplate = `name,district,state,pincode,latitude,longitude,totalPopulation,scPopulation,adarshGramStatus
Rampur,Gaya,Bihar,823001,24.8,85.0,2500,1500,not-started
Banshi,Banda,UP,210001,25.3,80.2,3200,2240,in-progress
Dhoba,Satna,MP,485001,24.4,80.8,1800,1080,not-started`

    const blob = new Blob([csvTemplate], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'village_template.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to upload village data
          </p>
          <a href="/login" className="btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Village Data
          </h1>
          <p className="text-lg text-gray-600">
            Upload CSV or GeoJSON files to update village infrastructure data
          </p>
        </div>

        {/* Upload Type Selection */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Upload Format</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUploadType('csv')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                uploadType === 'csv'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-6 h-6 text-primary-600" />
                <span className="font-semibold text-gray-900">CSV Format</span>
              </div>
              <p className="text-sm text-gray-600">
                Upload village data in CSV format with columns for name, district, state, coordinates, population, and amenities.
              </p>
            </button>
            
            <button
              onClick={() => setUploadType('geojson')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                uploadType === 'geojson'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Map className="w-6 h-6 text-primary-600" />
                <span className="font-semibold text-gray-900">GeoJSON Format</span>
              </div>
              <p className="text-sm text-gray-600">
                Upload village data with geographic coordinates in GeoJSON format for precise mapping.
              </p>
            </button>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : selectedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your {uploadType.toUpperCase()} file here
                  </p>
                  <p className="text-sm text-gray-600">
                    or click to browse files
                  </p>
                </div>
                <input
                  type="file"
                  accept={uploadType === 'csv' ? '.csv' : '.json,.geojson'}
                  onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        {selectedFile && (
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to Upload</h3>
                <p className="text-sm text-gray-600">
                  Click the button below to process and upload your village data
                </p>
              </div>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4" />
                    <span>Upload Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className="card mb-8">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Successful
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• {uploadResult.inserted} villages uploaded successfully</p>
                  {uploadResult.errors > 0 && (
                    <p>• {uploadResult.errors} errors encountered</p>
                  )}
                </div>
                {uploadResult.errorDetails && uploadResult.errorDetails.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {uploadResult.errorDetails.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CSV Format Instructions */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">CSV Format</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Columns:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• name - Village name</li>
                  <li>• district - District name</li>
                  <li>• state - State name</li>
                  <li>• latitude - Latitude coordinate</li>
                  <li>• longitude - Longitude coordinate</li>
                  <li>• totalPopulation - Total population</li>
                  <li>• scPopulation - SC population</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Optional Columns:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• pincode - Postal code</li>
                  <li>• adarshGramStatus - Status (declared/in-progress/not-started)</li>
                  <li>• amenities - JSON string of amenities data</li>
                </ul>
              </div>
              <button
                onClick={downloadTemplate}
                className="btn-secondary flex items-center space-x-2 w-full"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV Template</span>
              </button>
            </div>
          </div>

          {/* GeoJSON Format Instructions */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Map className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">GeoJSON Format</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Structure:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• FeatureCollection with Point geometries</li>
                  <li>• Properties must include village details</li>
                  <li>• Coordinates in [longitude, latitude] format</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Example Properties:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• name, district, state</li>
                  <li>• totalPopulation, scPopulation</li>
                  <li>• adarshGramStatus</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    GeoJSON files should follow the standard GeoJSON specification with proper coordinate systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Best Practices:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure coordinates are accurate and within India</li>
                <li>• Use consistent naming conventions</li>
                <li>• Validate population data before upload</li>
                <li>• Keep file size under 10MB</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Common Issues:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Missing required columns</li>
                <li>• Invalid coordinate formats</li>
                <li>• Duplicate village names</li>
                <li>• Incorrect file encoding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload




