import Layout from './components/Layout'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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
import NotFound from './pages/NotFound'
import { Routes, Route } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <Layout>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api" element={<Api />} />
        <Route path="/admin/providers" element={<Providers />} />
        <Route path="/admin/provider-models" element={<Models />} />
        <Route path="/admin/service-routes" element={<ServiceRoutes />} />
        <Route path="/keys" element={<Keys />} />
        <Route path="/usage" element={<Usage />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/user" element={<User />} />
        <Route path="/webhooks" element={<Webhooks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Layout>
  )
}
