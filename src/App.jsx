import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './store/useUserStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import TradePage from './pages/TradePage'
import History from './pages/History'
import Settings from './pages/Settings'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'

function App() {
  const { isLoggedIn } = useUserStore()

  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={!isLoggedIn ? <Home /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/login" 
            element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/register" 
            element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/trade" 
            element={isLoggedIn ? <Layout><TradePage /></Layout> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/history" 
            element={isLoggedIn ? <Layout><History /></Layout> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/settings" 
            element={isLoggedIn ? <Layout><Settings /></Layout> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

