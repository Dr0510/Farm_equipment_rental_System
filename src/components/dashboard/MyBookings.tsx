import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, User, DollarSign, Filter } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Booking } from '../../types'
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils'
import LoadingSpinner from '../ui/LoadingSpinner'
import toast from 'react-hot-toast'

const MyBookings: React.FC = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'as_owner' | 'as_renter'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [user, filter])

  const fetchBookings = async () => {
    if (!user) return

    try {
      setLoading(true)
      let query = supabase
        .from('bookings')
        .select(`
          *,
          equipment:equipment(title, images, location),
          renter:profiles!bookings_renter_id_fkey(full_name, avatar_url),
          owner:profiles!bookings_owner_id_fkey(full_name, avatar_url)
        `)

      if (filter === 'as_owner') {
        query = query.eq('owner_id', user.id)
      } else if (filter === 'as_renter') {
        query = query.eq('renter_id', user.id)
      } else {
        query = query.or(`owner_id.eq.${user.id},renter_id.eq.${user.id}`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error

      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus as any }
            : booking
        )
      )
      toast.success('Booking status updated')
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast.error('Failed to update booking status')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter === 'all') return true
    return booking.status === statusFilter
  })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          Manage your equipment rentals and bookings
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Bookings</option>
            <option value="as_owner">As Equipment Owner</option>
            <option value="as_renter">As Renter</option>
          </select>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'You have no bookings yet.'
              : filter === 'as_owner'
              ? 'No one has booked your equipment yet.'
              : 'You haven\'t rented any equipment yet.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card p-6">
              <div className="flex items-start gap-6">
                <img
                  src={booking.equipment?.images?.[0] || 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=200'}
                  alt={booking.equipment?.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.equipment?.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.equipment?.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>
                            {booking.owner_id === user?.id 
                              ? `Rented by ${booking.renter?.full_name}`
                              : `Owned by ${booking.owner?.full_name}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Rental Period</div>
                      <div className="font-medium">
                        {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.total_days} days
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="font-medium text-lg">
                        {formatCurrency(booking.total_amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        + {formatCurrency(booking.security_deposit)} deposit
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Payment Status</div>
                      <div className={`font-medium ${
                        booking.payment_status === 'paid' ? 'text-green-600' :
                        booking.payment_status === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {booking.payment_status}
                      </div>
                    </div>
                  </div>

                  {booking.delivery_required && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="text-sm font-medium text-blue-800">
                        Delivery Required
                      </div>
                      <div className="text-sm text-blue-700">
                        {booking.delivery_address}
                        {booking.delivery_fee && ` • Fee: ${formatCurrency(booking.delivery_fee)}`}
                      </div>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                      <div className="text-sm font-medium text-gray-800">Notes</div>
                      <div className="text-sm text-gray-700">{booking.notes}</div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {booking.owner_id === user?.id && booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        className="btn-primary text-sm"
                      >
                        Confirm Booking
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        className="btn-outline text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'active')}
                        className="btn-primary text-sm"
                      >
                        Mark as Active
                      </button>
                    </div>
                  )}

                  {booking.status === 'active' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        className="btn-primary text-sm"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings