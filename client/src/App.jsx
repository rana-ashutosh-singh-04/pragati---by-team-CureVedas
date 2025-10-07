import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Login from './pages/Login'
import PublicDashboard from './pages/PublicDashboard'
import { AuthProvider } from './contexts/AuthContext'
import { VillageProvider } from './contexts/VillageContext'

function App() {
  return (
    <AuthProvider>
      <VillageProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/login" element={<Login />} />
              <Route path="/public" element={<PublicDashboard />} />
            </Routes>
          </main>
        </div>
      </VillageProvider>
    </AuthProvider>
  )
}

export default App



