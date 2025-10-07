import { useState } from 'react'
import { X, Filter, RotateCcw } from 'lucide-react'

const FilterPanel = ({ filters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      district: '',
      state: '',
      minGapScore: '',
      maxGapScore: '',
      status: ''
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'declared', label: 'Declared' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-started', label: 'Not Started' }
  ]

  const gapScoreRanges = [
    { min: '', max: '', label: 'All Scores' },
    { min: 0, max: 25, label: 'Excellent (0-25%)' },
    { min: 26, max: 50, label: 'Good (26-50%)' },
    { min: 51, max: 75, label: 'Fair (51-75%)' },
    { min: 76, max: 100, label: 'Poor (76-100%)' }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* District Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <input
            type="text"
            value={localFilters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
            placeholder="Enter district..."
            className="input-field"
          />
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={localFilters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            placeholder="Enter state..."
            className="input-field"
          />
        </div>

        {/* Min Gap Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Gap Score
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={localFilters.minGapScore}
            onChange={(e) => handleFilterChange('minGapScore', e.target.value)}
            placeholder="0"
            className="input-field"
          />
        </div>

        {/* Max Gap Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Gap Score
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={localFilters.maxGapScore}
            onChange={(e) => handleFilterChange('maxGapScore', e.target.value)}
            placeholder="100"
            className="input-field"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adarsh Gram Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input-field"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          {gapScoreRanges.slice(1).map((range) => (
            <button
              key={`${range.min}-${range.max}`}
              onClick={() => {
                handleFilterChange('minGapScore', range.min)
                handleFilterChange('maxGapScore', range.max)
              }}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                localFilters.minGapScore == range.min && localFilters.maxGapScore == range.max
                  ? 'bg-primary-100 text-primary-700 border-primary-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(localFilters.district || localFilters.state || localFilters.minGapScore || 
        localFilters.maxGapScore || localFilters.status) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.district && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                <span>District: {localFilters.district}</span>
                <button
                  onClick={() => handleFilterChange('district', '')}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {localFilters.state && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                <span>State: {localFilters.state}</span>
                <button
                  onClick={() => handleFilterChange('state', '')}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {(localFilters.minGapScore || localFilters.maxGapScore) && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                <span>
                  Gap Score: {localFilters.minGapScore || 0}-{localFilters.maxGapScore || 100}%
                </span>
                <button
                  onClick={() => {
                    handleFilterChange('minGapScore', '')
                    handleFilterChange('maxGapScore', '')
                  }}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {localFilters.status && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                <span>Status: {statusOptions.find(s => s.value === localFilters.status)?.label}</span>
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel




