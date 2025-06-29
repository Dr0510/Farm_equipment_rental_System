import React, { useState, useEffect } from 'react'
import { Tractor, Calendar, DollarSign, Star, TrendingUp, Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Booking, Equipment } from '../../types'
import { formatCurrency } from '../../lib/utils'
import LoadingSpinner from '../ui/LoadingSpinner'

const DashboardOverview: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingBookings: 0,
    completedBookings: 0
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [topEquipment, setTopEquipment] = useState<Equipment[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch equipment count
      const { count: equipmentCount } = await supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)

      // Fetch bookings data
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          equipment:equipment(title, images)
        `)
        .or(`owner_id.eq.${user.id},renter_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      // Fetch top equipment
      const { data: equipment } = await supabase
        .from('equipment')
        .select('*')
        .eq('owner_id', user.id)
        .order('total_bookings', { ascending: false })
        .limit(5)

      // Calculate stats
      const activeBookings = bookings?.filter(b => b.status === 'active').length || 0
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0
      
      const totalRevenue = bookings
        ?.filter(b => b.owner_id === user.id && b.payment_status === 'paid')
        .reduce((sum, b) => sum + b.total_amount, 0) || 0

      setStats({
        totalEquipment: equipmentCount || 0,
        activeBookings,
        totalRevenue,
        averageRating: user.rating,
        pendingBookings,
        completedBookings
      })

      setRecentBookings(bookings?.slice(0, 5) || [])
      setTopEquipment(equipment || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Equipment',
      value: stats.totalEquipment,
      icon: Tractor,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your equipment.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No recent bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.equipment?.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(booking.total_amount)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'active' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Equipment */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Equipment</h3>
          {topEquipment.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Tractor className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No equipment listed yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topEquipment.map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={equipment.images[0] || 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={equipment.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{equipment.title}</p>
                      <p className="text-sm text-gray-600">
                        {equipment.total_bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(equipment.daily_rate)}/day
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{equipment.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center gap-2">
            <Tractor className="h-5 w-5" />
            Add New Equipment
          </button>
          <button className="btn-outline flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5" />
            View All Bookings
          </button>
          <button className="btn-outline flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview