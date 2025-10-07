import { useState } from 'react'
import { useVillages } from '../contexts/VillageContext'
import { 
  X, 
  MapPin, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BookOpen,
  Heart,
  Droplets,
  Zap,
  Route,
  Wifi,
  CreditCard,
  ShoppingCart,
  Trash2,
  Lightbulb,
  ExternalLink
} from 'lucide-react'

const VillageModal = ({ village, onClose }) => {
  const { updateVillage } = useVillages()
  const [activeTab, setActiveTab] = useState('overview')
  const [isUpdating, setIsUpdating] = useState(false)

  const getGapScoreColor = (score) => {
    if (score <= 25) return 'text-green-600 bg-green-100'
    if (score <= 50) return 'text-blue-600 bg-blue-100'
    if (score <= 75) return 'text-amber-600 bg-amber-100'
    return 'text-red-600 bg-red-100'
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
          label: 'Adarsh Gram Declared',
          className: 'status-declared',
          description: 'This village has achieved Adarsh Gram status'
        }
      case 'in-progress':
        return {
          icon: Clock,
          label: 'In Progress',
          className: 'status-in-progress',
          description: 'Interventions are being implemented'
        }
      default:
        return {
          icon: AlertCircle,
          label: 'Not Started',
          className: 'status-not-started',
          description: 'No interventions started yet'
        }
    }
  }

  const getAmenityIcon = (category) => {
    const icons = {
      education: BookOpen,
      healthcare: Heart,
      water: Droplets,
      sanitation: Trash2,
      electricity: Zap,
      roads: Route,
      connectivity: Wifi,
      banking: CreditCard,
      market: ShoppingCart
    }
    return icons[category] || AlertCircle
  }

  const getAmenityLabel = (category) => {
    const labels = {
      education: 'Education',
      healthcare: 'Healthcare',
      water: 'Water Supply',
      sanitation: 'Sanitation',
      electricity: 'Electricity',
      roads: 'Routes & Transport',
      connectivity: 'Connectivity',
      banking: 'Banking',
      market: 'Market & Commerce'
    }
    return labels[category] || category
  }

  const generateRecommendations = (village) => {
    const recommendations = []
    
    Object.entries(village.amenities).forEach(([category, amenities]) => {
      const missingAmenities = amenities.filter(amenity => !amenity.available)
      if (missingAmenities.length > 0) {
        recommendations.push({
          category,
          priority: missingAmenities.length,
          items: missingAmenities.map(amenity => amenity.name),
          schemes: getRecommendedSchemes(category)
        })
      }
    })
    
    return recommendations.sort((a, b) => b.priority - a.priority)
  }

  const getRecommendedSchemes = (category) => {
    const schemes = {
      education: [
        { name: 'Samagra Shiksha', url: 'https://samagra.education.gov.in/' },
        { name: 'Mid-Day Meal Scheme', url: 'https://mdm.nic.in/' }
      ],
      healthcare: [
        { name: 'National Health Mission', url: 'https://nhm.gov.in/' },
        { name: 'Ayushman Bharat', url: 'https://pmjay.gov.in/' }
      ],
      water: [
        { name: 'Jal Jeevan Mission', url: 'https://jaljeevanmission.gov.in/' },
        { name: 'Swachh Bharat Mission', url: 'https://swachhbharatmission.gov.in/' }
      ],
      electricity: [
        { name: 'Saubhagya Scheme', url: 'https://saubhagya.gov.in/' },
        { name: 'Deen Dayal Upadhyaya Gram Jyoti Yojana', url: 'https://ddugjy.gov.in/' }
      ],
      roads: [
        { name: 'Pradhan Mantri Gram Sadak Yojana', url: 'https://pmgsy.nic.in/' }
      ],
      connectivity: [
        { name: 'Digital India', url: 'https://digitalindia.gov.in/' },
        { name: 'BharatNet', url: 'https://bharatnet.gov.in/' }
      ]
    }
    return schemes[category] || []
  }

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true)
    try {
      await updateVillage(village._id, { adarshGramStatus: newStatus })
      onClose()
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const statusInfo = getStatusInfo(village.adarshGramStatus)
  const StatusIcon = statusInfo.icon
  const recommendations = generateRecommendations(village)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'amenities', label: 'Amenities', icon: CheckCircle },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{village.name}</h2>
                  <p className="text-sm text-gray-600">
                    {village.district}, {village.state}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status and Gap Score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                    <div className="flex items-center space-x-3 mb-3">
                      <StatusIcon className="w-6 h-6" />
                      <div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.className}`}>
                          {statusInfo.label}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{statusInfo.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gap Analysis</h3>
                    <div className="text-center">
                      <div className={`text-4xl font-bold px-4 py-2 rounded-lg ${getGapScoreColor(village.gapScore)}`}>
                        {village.gapScore}%
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {getGapScoreLabel(village.gapScore)} Infrastructure Coverage
                      </p>
                    </div>
                  </div>
                </div>

                {/* Population Info */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Population Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {village.population.total.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">Total Population</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {village.population.scPopulation.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">SC Population</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {village.population.scPercentage}%
                      </div>
                      <p className="text-sm text-gray-600">SC Percentage</p>
                    </div>
                  </div>
                </div>

                {/* Priority Rank */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Assessment</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-amber-600">
                        #{village.priorityRank || 'N/A'}
                      </div>
                      <p className="text-sm text-gray-600">Priority Rank</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Based on:</p>
                      <ul className="text-sm text-gray-500 mt-1">
                        <li>• Gap Score: {village.gapScore}%</li>
                        <li>• SC Population: {village.population.scPercentage}%</li>
                        <li>• Infrastructure Needs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div className="space-y-6">
                {Object.entries(village.amenities).map(([category, amenities]) => {
                  const Icon = getAmenityIcon(category)
                  const availableCount = amenities.filter(a => a.available).length
                  const totalCount = amenities.length
                  const percentage = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0

                  return (
                    <div key={category} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-6 h-6 text-primary-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getAmenityLabel(category)}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {availableCount}/{totalCount}
                          </div>
                          <p className="text-sm text-gray-600">{percentage}% Available</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full ${
                                amenity.available ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <span className="text-sm font-medium text-gray-900">
                                {amenity.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {amenity.quality && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  amenity.quality === 'excellent' ? 'bg-green-100 text-green-800' :
                                  amenity.quality === 'good' ? 'bg-blue-100 text-blue-800' :
                                  amenity.quality === 'fair' ? 'bg-amber-100 text-amber-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {amenity.quality}
                                </span>
                              )}
                              {amenity.distance > 0 && (
                                <span className="text-xs text-gray-500">
                                  {amenity.distance}km away
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recommended Interventions
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Based on the current infrastructure gaps, here are the priority interventions:
                  </p>
                  
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => {
                      const Icon = getAmenityIcon(rec.category)
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <Icon className="w-4 h-4 text-primary-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {getAmenityLabel(rec.category)}
                              </h4>
                              <div className="space-y-2">
                                {rec.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                  </div>
                                ))}
                              </div>
                              
                              {rec.schemes.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-sm font-medium text-gray-900 mb-2">
                                    Recommended Schemes:
                                  </p>
                                  <div className="space-y-1">
                                    {rec.schemes.map((scheme, schemeIndex) => (
                                      <a
                                        key={schemeIndex}
                                        href={scheme.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                                      >
                                        <span>{scheme.name}</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Last updated: {new Date(village.lastUpdated).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-3">
              {village.adarshGramStatus !== 'declared' && (
                <button
                  onClick={() => handleStatusUpdate('declared')}
                  disabled={isUpdating}
                  className="btn-success text-sm"
                >
                  {isUpdating ? 'Updating...' : 'Mark as Declared'}
                </button>
              )}
              {village.adarshGramStatus === 'not-started' && (
                <button
                  onClick={() => handleStatusUpdate('in-progress')}
                  disabled={isUpdating}
                  className="btn-primary text-sm"
                >
                  {isUpdating ? 'Updating...' : 'Start Intervention'}
                </button>
              )}
              <button
                onClick={onClose}
                className="btn-secondary text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VillageModal




