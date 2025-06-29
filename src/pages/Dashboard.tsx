import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Tractor, 
  Calendar, 
  Star, 
  Settings, 
  BarChart3,
  FileText,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import MyEquipment from '../components/dashboard/MyEquipment'
import MyBookings from '../components/dashboard/MyBookings'
import Reviews from '../components/dashboard/Reviews'
import Analytics from '../components/dashboard/Analytics'
import MaintenanceRecords from '../components/dashboard/MaintenanceRecords'
import DamageReports from '../components/dashboard/DamageReports'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, current: location.pathname === '/dashboard' },
    { name: 'My Equipment', href: '/dashboard/equipment', icon: Tractor, current: location.pathname === '/dashboard/equipment' },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar, current: location.pathname === '/dashboard/bookings' },
    { name: 'Reviews', href: '/dashboard/reviews', icon: Star, current: location.pathname === '/dashboard/reviews' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, current: location.pathname === '/dashboard/analytics' },
    { name: 'Maintenance', href: '/dashboard/maintenance', icon: Settings, current: location.pathname === '/dashboard/maintenance' },
    { name: 'Damage Reports', href: '/dashboard/damage-reports', icon: AlertTriangle, current: location.pathname === '/dashboard/damage-reports' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.full_name}</p>
          </div>
          
          <nav className="px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    item.current
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/equipment" element={<MyEquipment />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/maintenance" element={<MaintenanceRecords />} />
            <Route path="/damage-reports" element={<DamageReports />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard