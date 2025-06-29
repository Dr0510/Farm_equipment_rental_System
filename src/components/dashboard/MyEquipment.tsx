import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, MapPin, Star } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Equipment } from '../../types'
import { formatCurrency, getStatusColor } from '../../lib/utils'
import LoadingSpinner from '../ui/LoadingSpinner'
import toast from 'react-hot-toast'

const MyEquipment: React.FC = () => {
  const { user } = useAuth()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchEquipment()
  }, [user])

  const fetchEquipment = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEquipment(data || [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
      toast.error('Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (equipmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .update({ availability_status: newStatus })
        .eq('id', equipmentId)

      if (error) throw error

      setEquipment(prev => 
        prev.map(item => 
          item.id === equipmentId 
            ? { ...item, availability_status: newStatus as any }
            : item
        )
      )
      toast.success('Equipment status updated')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (equipmentId: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return

    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', equipmentId)

      if (error) throw error

      setEquipment(prev => prev.filter(item => item.id !== equipmentId))
      toast.success('Equipment deleted successfully')
    } catch (error) {
      console.error('Error deleting equipment:', error)
      toast.error('Failed to delete equipment')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Equipment</h1>
          <p className="text-gray-600 mt-2">
            Manage your listed equipment and track performance
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Equipment
        </button>
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No equipment listed yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start earning by listing your farm equipment for rent.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add Your First Equipment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              <div className="relative">
                <img
                  src={item.images[0] || 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <select
                    value={item.availability_status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(item.availability_status)}`}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatCurrency(item.daily_rate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.total_bookings} bookings
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 btn-outline text-sm py-2">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 btn-outline text-sm py-2">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyEquipment