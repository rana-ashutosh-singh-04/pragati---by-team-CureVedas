import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const VillageContext = createContext()

export const useVillages = () => {
  const context = useContext(VillageContext)
  if (!context) {
    throw new Error('useVillages must be used within a VillageProvider')
  }
  return context
}

export const VillageProvider = ({ children }) => {
  const [villages, setVillages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [selectedVillage, setSelectedVillage] = useState(null)

  const fetchVillages = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key])
      })
      
      const response = await axios.get(`/api/villages?${params}`)
      setVillages(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch villages')
      console.error('Error fetching villages:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchVillageDetails = async (id) => {
    try {
      const response = await axios.get(`/api/villages/${id}`)
      setSelectedVillage(response.data.data)
      return response.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch village details')
      console.error('Error fetching village details:', err)
      return null
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/villages/stats/summary')
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const updateVillage = async (id, data) => {
    try {
      const response = await axios.put(`/api/villages/${id}`, data)
      // Update the village in the list
      setVillages(prev => 
        prev.map(village => 
          village._id === id ? response.data.data : village
        )
      )
      return response.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update village')
      console.error('Error updating village:', err)
      return null
    }
  }

  const uploadData = async (file, type) => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const endpoint = type === 'csv' ? '/api/upload/csv' : '/api/upload/geojson'
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Refresh villages after upload
      await fetchVillages()
      await fetchStats()
      
      return { success: true, data: response.data.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Upload failed'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    fetchVillages()
    fetchStats()
  }, [])

  const value = {
    villages,
    loading,
    error,
    stats,
    selectedVillage,
    setSelectedVillage,
    fetchVillages,
    fetchVillageDetails,
    fetchStats,
    updateVillage,
    uploadData
  }

  return (
    <VillageContext.Provider value={value}>
      {children}
    </VillageContext.Provider>
  )
}




