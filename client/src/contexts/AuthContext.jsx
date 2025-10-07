import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token and get user profile
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/auth/profile')
      setUser(response.data.data)
    } catch (error) {
      console.error('Token verification failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data.data
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const sendOTP = async (email) => {
    try {
      const response = await axios.post('/api/auth/send-otp', { email })
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send OTP' 
      }
    }
  }

  const verifyOTP = async (email, otp, newPassword) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { 
        email, 
        otp, 
        newPassword 
      })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset password' 
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    sendOTP,
    verifyOTP,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}




