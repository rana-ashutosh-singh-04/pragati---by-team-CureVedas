import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const { login, sendOTP, verifyOTP } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  
  // Forgot password form state
  const [forgotForm, setForgotForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await login(loginForm.email, loginForm.password)
      
      if (result.success) {
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await sendOTP(forgotForm.email)
      
      if (result.success) {
        setOtpSent(true)
        toast.success('OTP sent successfully!')
        
        // In development, show OTP
        if (result.data.otp) {
          toast.success(`OTP: ${result.data.otp}`, { duration: 10000 })
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await verifyOTP(forgotForm.email, forgotForm.otp, forgotForm.newPassword)
      
      if (result.success) {
        setOtpVerified(true)
        toast.success('Password reset successful!')
        setTimeout(() => {
          setIsForgotPassword(false)
          setIsLogin(true)
          setOtpSent(false)
          setOtpVerified(false)
          setForgotForm({
            email: '',
            otp: '',
            newPassword: '',
            confirmPassword: ''
          })
        }, 2000)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const demoCredentials = [
    { role: 'Admin', email: 'admin@adarshgram.gov.in', password: 'password' },
    { role: 'District Officer', email: 'officer@district1.gov.in', password: 'password' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">🌾</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isForgotPassword 
              ? 'Enter your email to receive an OTP'
              : 'Sign in to your AdarshGramGapFinder account'
            }
          </p>
        </div>

        {/* Demo Credentials */}
        {isLogin && !isForgotPassword && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Demo Credentials:</h3>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="text-xs text-blue-800">
                  <span className="font-medium">{cred.role}:</span> {cred.email} / {cred.password}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Login Form */}
        {isLogin && !isForgotPassword && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Form */}
        {isForgotPassword && (
          <div className="mt-8 space-y-6">
            {!otpSent ? (
              // Step 1: Enter Email
              <form onSubmit={handleSendOTP}>
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      required
                      value={forgotForm.email}
                      onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                      className="input-field pl-10"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="btn-secondary flex items-center space-x-2 flex-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner w-4 h-4"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send OTP</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : !otpVerified ? (
              // Step 2: Enter OTP and New Password
              <form onSubmit={handleVerifyOTP}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      OTP Code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={forgotForm.otp}
                      onChange={(e) => setForgotForm({ ...forgotForm, otp: e.target.value })}
                      className="input-field"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="new-password"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={forgotForm.newPassword}
                        onChange={(e) => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                        className="input-field pl-10 pr-10"
                        placeholder="Enter new password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={forgotForm.confirmPassword}
                        onChange={(e) => setForgotForm({ ...forgotForm, confirmPassword: e.target.value })}
                        className="input-field pl-10"
                        placeholder="Confirm new password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setForgotForm({ ...forgotForm, otp: '', newPassword: '', confirmPassword: '' })
                    }}
                    className="btn-secondary flex items-center space-x-2 flex-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner w-4 h-4"></div>
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Step 3: Success
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Password Reset Successful!</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsForgotPassword(false)
                    setIsLogin(true)
                    setOtpSent(false)
                    setOtpVerified(false)
                    setForgotForm({
                      email: '',
                      otp: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                  }}
                  className="btn-primary w-full"
                >
                  Continue to Login
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Contact your administrator
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login




