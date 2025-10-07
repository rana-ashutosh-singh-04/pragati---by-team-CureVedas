import { useState, useEffect } from 'react'
import { useVillages } from '../contexts/VillageContext'
import { useAuth } from '../contexts/AuthContext'
import VillageMap from '../components/VillageMap'
import VillageList from '../components/VillageList'
import VillageModal from '../components/VillageModal'
import StatsPanel from '../components/StatsPanel'
import FilterPanel from '../components/FilterPanel'
import { 
  Map, 
  List, 
  Filter, 
  Search,
  Download,
  RefreshCw
} from 'lucide-react'

const Dashboard = () => {
  const { 
    villages, 
    loading, 
    error, 
    stats, 
    selectedVillage, 
    setSelectedVillage,
    fetchVillages,
    fetchStats 
  } = useVillages()
  const { isAuthenticated } = useAuth()
  
  const [viewMode, setViewMode] = useState('map') // 'map' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    district: '',
    state: '',
    minGapScore: '',
    maxGapScore: '',
    status: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Apply filters and search
  useEffect(() => {
    const filteredFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    fetchVillages(filteredFilters)
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleRefresh = () => {
    fetchVillages(filters)
    fetchStats()
  }

  const filteredVillages = villages.filter(village =>
    village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access the dashboard
          </p>
          <a
            href="/login"
            className="btn-primary"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Village Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                {villages.length} villages • {stats?.totalVillages || 0} total
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search villages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map size={16} />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={16} />
                  <span>List</span>
                </button>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showFilters
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>
              
              {/* Refresh */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-1">
            <StatsPanel stats={stats} loading={loading} />
          </div>
          
          {/* Map/List View */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {viewMode === 'map' ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-96 lg:h-[600px]">
                  <VillageMap
                    villages={filteredVillages}
                    selectedVillage={selectedVillage}
                    onVillageSelect={setSelectedVillage}
                    loading={loading}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <VillageList
                  villages={filteredVillages}
                  selectedVillage={selectedVillage}
                  onVillageSelect={setSelectedVillage}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Village Detail Modal */}
      {selectedVillage && (
        <VillageModal
          village={selectedVillage}
          onClose={() => setSelectedVillage(null)}
        />
      )}
    </div>
  )
}

export default Dashboard




