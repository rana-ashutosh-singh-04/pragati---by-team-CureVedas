import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons based on village status
const createCustomIcon = (status, gapScore) => {
  let color = '#3b82f6' // default blue
  let size = [25, 41]
  
  if (status === 'completed' || gapScore <= 25) {
    color = '#10b981' // green
  } else if (status === 'in_progress' || gapScore <= 50) {
    color = '#f59e0b' // yellow
  } else {
    color = '#ef4444' // red
  }
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: ${size[0]}px;
      height: ${size[1]}px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-weight: bold;
        font-size: 12px;
        margin-top: -2px;
      ">${gapScore || '?'}%</div>
    </div>`,
    iconSize: size,
    iconAnchor: [size[0]/2, size[1]],
    popupAnchor: [0, -size[1]]
  })
}

// Component to fit map bounds to markers
const FitBounds = ({ villages }) => {
  const map = useMap()
  
  React.useEffect(() => {
    if (villages.length > 0) {
      const bounds = villages
        .filter(village => village.latitude && village.longitude)
        .map(village => [village.latitude, village.longitude])
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] })
      }
    }
  }, [villages, map])
  
  return null
}

const VillageMap = ({ villages, selectedVillage, onVillageSelect }) => {
  // Default center (India)
  const defaultCenter = [20.5937, 78.9629]
  
  // Generate sample coordinates for villages without lat/lng
  const villagesWithCoords = villages.map((village, index) => {
    if (!village.latitude || !village.longitude) {
      // Generate sample coordinates based on village index
      const lat = defaultCenter[0] + (Math.random() - 0.5) * 10
      const lng = defaultCenter[1] + (Math.random() - 0.5) * 10
      return {
        ...village,
        latitude: lat,
        longitude: lng
      }
    }
    return village
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <MapPin className="w-4 h-4 text-blue-600" />
    }
  }

  const getGapScoreColor = (score) => {
    if (score <= 25) return 'text-green-600 bg-green-100'
    if (score <= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds villages={villagesWithCoords} />
        
        {villagesWithCoords.map((village) => (
          <Marker
            key={village.id}
            position={[village.latitude, village.longitude]}
            icon={createCustomIcon(village.status, village.gapScore)}
            eventHandlers={{
              click: () => onVillageSelect && onVillageSelect(village)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {village.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(village.status)}
                    <span className="text-sm font-medium text-gray-600">
                      {village.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {village.district}, {village.state}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gap Score:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGapScoreColor(village.gapScore)}`}>
                      {village.gapScore}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Population:</span>
                    <span className="text-sm font-medium">{village.population?.toLocaleString() || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SC Population:</span>
                    <span className="text-sm font-medium">{village.scPercentage}%</span>
                  </div>
                </div>
                
                {village.infrastructure && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Infrastructure Progress:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(village.infrastructure).map(([type, percentage]) => (
                        <div key={type} className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="capitalize text-gray-600">{type}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                percentage >= 80 ? 'bg-green-500' :
                                percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default VillageMap