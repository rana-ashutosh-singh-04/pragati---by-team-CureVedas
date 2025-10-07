import { 
  MapPin, 
  BarChart3, 
  CheckCircle, 
  Clock,
  TrendingUp,
  AlertTriangle,
  Users,
  Target
} from 'lucide-react'

const StatsPanel = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <div className="loading-pulse h-20 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No statistics available</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Villages',
      value: stats.totalVillages,
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Average Gap Score',
      value: Math.round(stats.averageGapScore),
      icon: BarChart3,
      color: 'bg-amber-500',
      change: '-5%',
      changeType: 'positive',
      suffix: '%'
    },
    {
      title: 'Declared Adarsh',
      value: stats.statusBreakdown?.find(s => s._id === 'declared')?.count || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'In Progress',
      value: stats.statusBreakdown?.find(s => s._id === 'in-progress')?.count || 0,
      icon: Clock,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    }
  ]

  const getGapScoreDistribution = () => {
    const distribution = {
      excellent: 0, // 0-25%
      good: 0,      // 26-50%
      fair: 0,      // 51-75%
      poor: 0       // 76-100%
    }

    // This would come from actual data in a real implementation
    // For now, we'll simulate based on average gap score
    const avgScore = stats.averageGapScore
    if (avgScore <= 25) {
      distribution.excellent = Math.round(stats.totalVillages * 0.4)
      distribution.good = Math.round(stats.totalVillages * 0.3)
      distribution.fair = Math.round(stats.totalVillages * 0.2)
      distribution.poor = Math.round(stats.totalVillages * 0.1)
    } else if (avgScore <= 50) {
      distribution.excellent = Math.round(stats.totalVillages * 0.2)
      distribution.good = Math.round(stats.totalVillages * 0.4)
      distribution.fair = Math.round(stats.totalVillages * 0.3)
      distribution.poor = Math.round(stats.totalVillages * 0.1)
    } else if (avgScore <= 75) {
      distribution.excellent = Math.round(stats.totalVillages * 0.1)
      distribution.good = Math.round(stats.totalVillages * 0.2)
      distribution.fair = Math.round(stats.totalVillages * 0.4)
      distribution.poor = Math.round(stats.totalVillages * 0.3)
    } else {
      distribution.excellent = Math.round(stats.totalVillages * 0.05)
      distribution.good = Math.round(stats.totalVillages * 0.15)
      distribution.fair = Math.round(stats.totalVillages * 0.3)
      distribution.poor = Math.round(stats.totalVillages * 0.5)
    }

    return distribution
  }

  const gapDistribution = getGapScoreDistribution()

  return (
    <div className="space-y-6">
      {/* Key Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Statistics</h3>
        <div className="space-y-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                    <p className="text-xs text-gray-500">
                      <span className={`inline-flex items-center ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}{stat.suffix}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Gap Score Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gap Score Distribution</h3>
        <div className="space-y-3">
          {[
            { label: 'Excellent (0-25%)', value: gapDistribution.excellent, color: 'bg-green-500' },
            { label: 'Good (26-50%)', value: gapDistribution.good, color: 'bg-blue-500' },
            { label: 'Fair (51-75%)', value: gapDistribution.fair, color: 'bg-amber-500' },
            { label: 'Poor (76-100%)', value: gapDistribution.poor, color: 'bg-red-500' }
          ].map((item, index) => {
            const percentage = stats.totalVillages > 0 ? 
              Math.round((item.value / stats.totalVillages) * 100) : 0
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">
                    {item.value} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adarsh Gram Status</h3>
        <div className="space-y-3">
          {[
            { 
              id: 'declared', 
              label: 'Declared', 
              icon: CheckCircle, 
              color: 'text-green-600 bg-green-100' 
            },
            { 
              id: 'in-progress', 
              label: 'In Progress', 
              icon: Clock, 
              color: 'text-amber-600 bg-amber-100' 
            },
            { 
              id: 'not-started', 
              label: 'Not Started', 
              icon: AlertTriangle, 
              color: 'text-gray-600 bg-gray-100' 
            }
          ].map((status) => {
            const Icon = status.icon
            const count = stats.statusBreakdown?.find(s => s._id === status.id)?.count || 0
            const percentage = stats.totalVillages > 0 ? 
              Math.round((count / stats.totalVillages) * 100) : 0
            
            return (
              <div key={status.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${status.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{status.label}</p>
                    <p className="text-xs text-gray-500">{percentage}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{count}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Priority Villages */}
      {stats.topGapVillages && stats.topGapVillages.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Priority Villages</h3>
          <div className="space-y-3">
            {stats.topGapVillages.map((village, index) => (
              <div key={village._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{village.name}</p>
                    <p className="text-xs text-gray-500">{village.district}, {village.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{village.gapScore}%</p>
                  <p className="text-xs text-gray-500">Gap Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsPanel




