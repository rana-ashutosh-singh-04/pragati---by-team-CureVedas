import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Search,
  Filter,
  Building2,
  Droplets,
  Zap,
  Navigation,
  Wifi,
  CreditCard,
  ShoppingCart,
  Trash2,
  Lightbulb,
  BookOpen,
  Heart,
  Map
} from 'lucide-react'
import VillageMap from '../components/VillageMap'

const PublicDashboard = () => {
  const [villages, setVillages] = useState([])
  const [filteredVillages, setFilteredVillages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [selectedVillage, setSelectedVillage] = useState(null)
  const [stats, setStats] = useState({
    totalVillages: 0,
    completedVillages: 0,
    inProgressVillages: 0,
    pendingVillages: 0
  })

  // Fetch village data
  useEffect(() => {
    fetchVillages()
  }, [])

  // Filter villages based on search and district
  useEffect(() => {
    let filtered = villages

    if (searchTerm) {
      filtered = filtered.filter(village => 
        village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.state.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDistrict) {
      filtered = filtered.filter(village => village.district === selectedDistrict)
    }

    setFilteredVillages(filtered)
  }, [villages, searchTerm, selectedDistrict])

  const fetchVillages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/villages/public')
      const data = await response.json()
      
      if (data.success) {
        setVillages(data.data)
        calculateStats(data.data)
      } else {
        console.error('Failed to fetch villages:', data.message)
      }
    } catch (error) {
      console.error('Error fetching villages:', error)
      // Use sample data if API fails
      const sampleData = [
        {
          id: 1,
          name: 'Village A',
          district: 'District 1',
          state: 'State 1',
          population: 1200,
          scPercentage: 65,
          gapScore: 25,
          status: 'completed',
          infrastructure: {
            roads: 90,
            electricity: 85,
            water: 80,
            education: 75,
            healthcare: 70
          }
        },
        {
          id: 2,
          name: 'Village B',
          district: 'District 1',
          state: 'State 1',
          population: 800,
          scPercentage: 45,
          gapScore: 45,
          status: 'in_progress',
          infrastructure: {
            roads: 60,
            electricity: 70,
            water: 55,
            education: 50,
            healthcare: 40
          }
        },
        {
          id: 3,
          name: 'Village C',
          district: 'District 2',
          state: 'State 1',
          population: 1500,
          scPercentage: 55,
          gapScore: 70,
          status: 'pending',
          infrastructure: {
            roads: 30,
            electricity: 40,
            water: 35,
            education: 25,
            healthcare: 20
          }
        }
      ]
      setVillages(sampleData)
      calculateStats(sampleData)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (villageData) => {
    const total = villageData.length
    const completed = villageData.filter(v => v.gapScore <= 25).length
    const inProgress = villageData.filter(v => v.gapScore > 25 && v.gapScore <= 50).length
    const pending = villageData.filter(v => v.gapScore > 50).length

    setStats({
      totalVillages: total,
      completedVillages: completed,
      inProgressVillages: inProgress,
      pendingVillages: pending
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getGapScoreColor = (score) => {
    if (score <= 25) return 'text-green-600 bg-green-100'
    if (score <= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getInfrastructureIcon = (type) => {
    switch (type) {
      case 'roads': return <Navigation className="w-4 h-4" />
      case 'electricity': return <Zap className="w-4 h-4" />
      case 'water': return <Droplets className="w-4 h-4" />
      case 'education': return <BookOpen className="w-4 h-4" />
      case 'healthcare': return <Heart className="w-4 h-4" />
      default: return <Building2 className="w-4 h-4" />
    }
  }

  const districts = [...new Set(villages.map(v => v.district))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading village data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Adarsh Gram Progress Dashboard
              </h1>
              <p className="text-gray-600">
                Track infrastructure development in SC-majority villages
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Public View • No Login Required
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Villages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVillages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedVillages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressVillages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingVillages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Village Progress ({filteredVillages.length} villages)
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Map View</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Villages
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by village, district, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDistrict('')
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Villages Display */}
        {viewMode === 'map' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <VillageMap 
              villages={filteredVillages}
              selectedVillage={selectedVillage}
              onVillageSelect={setSelectedVillage}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Village List
              </h2>
            </div>

          <div className="divide-y divide-gray-200">
            {filteredVillages.map((village) => (
              <div key={village.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {village.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {village.district}, {village.state}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Gap Score</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGapScoreColor(village.gapScore)}`}>
                        {village.gapScore}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(village.status)}`}>
                        {village.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(village.infrastructure).map(([type, percentage]) => (
                    <div key={type} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {getInfrastructureIcon(type)}
                        <span className="ml-1 text-xs font-medium text-gray-600 capitalize">
                          {type}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage >= 80 ? 'bg-green-500' :
                            percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{percentage}%</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Population: {village.population?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <span>SC Population: {village.scPercentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVillages.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No villages found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicDashboard

