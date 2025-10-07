import { Link } from 'react-router-dom'
import { useVillages } from '../contexts/VillageContext'
import { 
  MapPin, 
  BarChart3, 
  Upload, 
  Users, 
  Target, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

const Home = () => {
  const { stats, loading } = useVillages()

  const features = [
    {
      icon: MapPin,
      title: 'Village Mapping',
      description: 'Visualize SC-majority villages on interactive maps with gap analysis',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Gap Analysis',
      description: 'Comprehensive scoring system for infrastructure and amenities',
      color: 'text-green-600'
    },
    {
      icon: Upload,
      title: 'Data Upload',
      description: 'Upload CSV/GeoJSON files to update village data in real-time',
      color: 'text-purple-600'
    },
    {
      icon: Target,
      title: 'Priority Ranking',
      description: 'AI-powered recommendations for Adarsh Gram interventions',
      color: 'text-orange-600'
    }
  ]

  const statusCards = [
    {
      title: 'Total Villages',
      value: stats?.totalVillages || 0,
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Avg Gap Score',
      value: stats?.averageGapScore ? Math.round(stats.averageGapScore) : 0,
      icon: BarChart3,
      color: 'bg-amber-500',
      change: '-5%'
    },
    {
      title: 'Declared Adarsh',
      value: stats?.statusBreakdown?.find(s => s._id === 'declared')?.count || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'In Progress',
      value: stats?.statusBreakdown?.find(s => s._id === 'in-progress')?.count || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-4xl">🌾</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AdarshGramGapFinder
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Identify infrastructure gaps in SC-majority villages for 
              <span className="font-semibold text-green-600"> Adarsh Gram</span> declaration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <MapPin size={20} />
                <span>Explore Dashboard</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/upload"
                className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <Upload size={20} />
                <span>Upload Data</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Current Status Overview
            </h2>
            <p className="text-lg text-gray-600">
              Real-time insights into village infrastructure gaps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statusCards.map((card, index) => {
              const Icon = card.icon
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {loading ? '...' : card.value}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        {card.change}
                      </p>
                    </div>
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools for village infrastructure analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                  <div className={`${feature.color} mb-4 flex justify-center`}>
                    <Icon size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About Adarsh Gram Yojana
            </h2>
            <p className="text-lg text-gray-600">
              Understanding the mission behind infrastructure development
            </p>
          </div>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-700 leading-relaxed">
              The <strong>Adarsh Gram Yojana</strong> is a flagship program aimed at developing 
              model villages with comprehensive infrastructure and amenities. This platform 
              specifically focuses on SC-majority villages, helping identify gaps in:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Education & Healthcare</h4>
                  <p className="text-gray-600 text-sm">Schools, health centers, and medical facilities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Basic Infrastructure</h4>
                  <p className="text-gray-600 text-sm">Water supply, electricity, and road connectivity</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Sanitation & Hygiene</h4>
                  <p className="text-gray-600 text-sm">Toilets, waste management, and clean water</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Digital Connectivity</h4>
                  <p className="text-gray-600 text-sm">Internet, mobile networks, and digital services</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              Our platform provides district officers and policymakers with data-driven insights 
              to prioritize interventions and track progress towards Adarsh Gram status.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Villages?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Start analyzing infrastructure gaps and planning interventions today
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/public"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BarChart3 size={20} />
              <span>View Progress</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <MapPin size={20} />
              <span>Get Started</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home



