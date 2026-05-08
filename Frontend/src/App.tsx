import { Outlet, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Providers from './pages/Providers'
import Models from './pages/Models'
import ServiceRoutes from './pages/ServiceRoutes'
import Keys from './pages/Keys'
import Usage from './pages/Usage'
import Billing from './pages/Billing'
import User from './pages/User'
import Webhooks from './pages/Webhooks'
import Api from './pages/Api'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import './App.css'

function AppLayout() {
  return (
    <Layout>
      <Navbar />
      <Outlet />
      <Footer />
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth page — standalone, no nav/footer */}
        <Route path="/login" element={<Login />} />

        {/* All other pages share the layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/api" element={<Api />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/webhooks" element={<Webhooks />} />

          {/* Protected routes — redirect to /login if not authenticated */}
          <Route path="/admin/providers" element={<ProtectedRoute><Providers /></ProtectedRoute>} />
          <Route path="/admin/provider-models" element={<ProtectedRoute><Models /></ProtectedRoute>} />
          <Route path="/admin/service-routes" element={<ProtectedRoute><ServiceRoutes /></ProtectedRoute>} />
          <Route path="/keys" element={<ProtectedRoute><Keys /></ProtectedRoute>} />
          <Route path="/usage" element={<ProtectedRoute><Usage /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
