import { useState } from 'react'
import { 
  MapPin, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ChevronRight,
  Eye
} from 'lucide-react'

const VillageList = ({ villages, selectedVillage, onVillageSelect, loading }) => {
  const [sortBy, setSortBy] = useState('gapScore') // 'gapScore', 'name', 'district', 'priority'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'

  const getGapScoreColor = (score) => {
    if (score <= 25) return 'gap-score-excellent'
    if (score <= 50) return 'gap-score-good'
    if (score <= 75) return 'gap-score-fair'
    return 'gap-score-poor'
  }

  const getGapScoreLabel = (score) => {
    if (score <= 25) return 'Excellent'
    if (score <= 50) return 'Good'
    if (score <= 75) return 'Fair'
    return 'Poor'
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'declared':
        return {
          icon: CheckCircle,
          label: 'Declared',
          className: 'status-declared'
        }
      case 'in-progress':
        return {
          icon: Clock,
          label: 'In Progress',
          className: 'status-in-progress'
        }
      default:
        return {
          icon: AlertCircle,
          label: 'Not Started',
          className: 'status-not-started'
        }
    }
  }

  const sortedVillages = [...villages].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'district':
        aValue = a.district.toLowerCase()
        bValue = b.district.toLowerCase()
        break
      case 'priority':
        aValue = a.priorityRank || 0
        bValue = b.priorityRank || 0
        break
      default: // gapScore
        aValue = a.gapScore
        bValue = b.gapScore
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center space-x-1 text-sm font-medium hover:text-gray-900 ${
        sortBy === field ? 'text-primary-600' : 'text-gray-600'
      }`}
    >
      <span>{children}</span>
      {sortBy === field && (
        <span className="text-xs">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="loading-pulse h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (villages.length === 0) {
    return (
      <div className="p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No villages found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
          <div className="col-span-3">
            <SortButton field="name">Village Name</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="district">District</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="gapScore">Gap Score</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="priority">Priority</SortButton>
          </div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Village Rows */}
      <div className="divide-y divide-gray-100">
        {sortedVillages.map((village) => {
          const statusInfo = getStatusInfo(village.adarshGramStatus)
          const StatusIcon = statusInfo.icon
          const isSelected = selectedVillage?._id === village._id

          return (
            <div
              key={village._id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                isSelected ? 'bg-primary-50 border-l-4 border-primary-500' : ''
              }`}
              onClick={() => onVillageSelect(village)}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Village Name */}
                <div className="col-span-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {village.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {village.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* District */}
                <div className="col-span-2">
                  <p className="text-sm text-gray-900">{village.district}</p>
                </div>

                {/* Gap Score */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getGapScoreColor(village.gapScore)}`}>
                      {village.gapScore}%
                    </div>
                    <span className="text-xs text-gray-500">
                      {getGapScoreLabel(village.gapScore)}
                    </span>
                  </div>
                </div>

                {/* Priority */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-800">
                        {village.priorityRank || 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Population</div>
                      <div className="font-medium">
                        {village.population.scPercentage}% SC
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusInfo.label}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onVillageSelect(village)
                    }}
                    className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{village.population.total.toLocaleString()} total</span>
                    </div>
                    <div>
                      <span>{village.population.scPopulation.toLocaleString()} SC population</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Last updated:</span>
                    <span className="font-medium">
                      {new Date(village.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {villages.length} of {villages.length} villages
          </div>
          <div className="flex items-center space-x-4">
            <span>Sort by: {sortBy} ({sortOrder})</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VillageList




