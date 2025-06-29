import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, Calendar, Shield, Truck, Clock, User, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Equipment, Review } from '../types'
import { useAuth } from '../contexts/AuthContext'
import BookingModal from '../components/booking/BookingModal'
import ReviewsList from '../components/reviews/ReviewsList'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { formatCurrency, formatDate, getStatusColor } from '../lib/utils'
import toast from 'react-hot-toast'

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      fetchEquipmentDetails()
      fetchReviews()
    }
  }, [id])

  const fetchEquipmentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          owner:profiles(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setEquipment(data)
    } catch (error) {
      console.error('Error fetching equipment:', error)
      toast.error('Equipment not found')
      navigate('/equipment')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles(*)
        `)
        .eq('equipment_id', id)
        .eq('review_type', 'equipment')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleBooking = () => {
    if (!user) {
      toast.error('Please sign in to book equipment')
      navigate('/login')
      return
    }
    setShowBookingModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipment not found</h2>
          <p className="text-gray-600 mb-4">The equipment you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/equipment')} className="btn-primary">
            Browse Equipment
          </button>
        </div>
      </div>
    )
  }

  const images = equipment.images.length > 0 ? equipment.images : [
    'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Equipment
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-10">
                <img
                  src={images[selectedImageIndex]}
                  alt={equipment.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${equipment.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Equipment Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {equipment.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {equipment.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {equipment.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      {equipment.rating.toFixed(1)} ({equipment.total_reviews} reviews)
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(equipment.availability_status)}`}>
                  {equipment.availability_status}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {equipment.description}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Equipment Details
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Brand:</dt>
                      <dd className="font-medium">{equipment.brand}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Model:</dt>
                      <dd className="font-medium">{equipment.model}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Year:</dt>
                      <dd className="font-medium">{equipment.year}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Condition:</dt>
                      <dd className="font-medium capitalize">{equipment.condition}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="font-medium capitalize">{equipment.category}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Rental Terms
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Min. Period:</dt>
                      <dd className="font-medium">{equipment.minimum_rental_period} days</dd>
                    </div>
                    {equipment.maximum_rental_period && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Max. Period:</dt>
                        <dd className="font-medium">{equipment.maximum_rental_period} days</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Security Deposit:</dt>
                      <dd className="font-medium">{formatCurrency(equipment.security_deposit)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Insurance:</dt>
                      <dd className="font-medium">
                        {equipment.insurance_required ? 'Required' : 'Optional'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Features */}
              {equipment.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {equipment.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              {equipment.delivery_available && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                    <Truck className="h-5 w-5" />
                    Delivery Available
                  </div>
                  <p className="text-green-700 text-sm">
                    Free delivery within {equipment.delivery_radius} miles.
                    {equipment.delivery_fee && ` Additional fee: ${formatCurrency(equipment.delivery_fee)}`}
                  </p>
                </div>
              )}
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Equipment Owner
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  {equipment.owner?.avatar_url ? (
                    <img
                      src={equipment.owner.avatar_url}
                      alt={equipment.owner.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {equipment.owner?.full_name}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{equipment.owner?.rating.toFixed(1)} rating</span>
                    <span>•</span>
                    <span>{equipment.owner?.total_reviews} reviews</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Member since {formatDate(equipment.owner?.created_at || '')}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <ReviewsList reviews={reviews} />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {formatCurrency(equipment.daily_rate)}
                </div>
                <div className="text-gray-600">per day</div>
                {equipment.weekly_rate && (
                  <div className="text-sm text-gray-500 mt-1">
                    {formatCurrency(equipment.weekly_rate)} per week
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-medium ${equipment.availability_status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                    {equipment.availability_status === 'available' ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Security Deposit:</span>
                  <span className="font-medium">{formatCurrency(equipment.security_deposit)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Min. Rental:</span>
                  <span className="font-medium">{equipment.minimum_rental_period} days</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={equipment.availability_status !== 'available'}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {equipment.availability_status === 'available' ? 'Book Now' : 'Not Available'}
              </button>

              <div className="text-center text-sm text-gray-500">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment & insurance</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Instant booking confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && equipment && (
        <BookingModal
          equipment={equipment}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false)
            toast.success('Booking request submitted successfully!')
          }}
        />
      )}
    </div>
  )
}

export default EquipmentDetail