import React, { useState } from 'react'
import { X, Calendar, MapPin, CreditCard } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Equipment } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatCurrency, calculateDaysBetween } from '../../lib/utils'
import toast from 'react-hot-toast'

interface BookingModalProps {
  equipment: Equipment
  onClose: () => void
  onSuccess: () => void
}

interface BookingFormData {
  startDate: string
  endDate: string
  deliveryRequired: boolean
  deliveryAddress?: string
  notes?: string
}

const BookingModal: React.FC<BookingModalProps> = ({ equipment, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [totalCost, setTotalCost] = useState(0)
  const [totalDays, setTotalDays] = useState(0)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>()

  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const deliveryRequired = watch('deliveryRequired')

  React.useEffect(() => {
    if (startDate && endDate) {
      const days = calculateDaysBetween(startDate, endDate)
      setTotalDays(days)
      
      let cost = days * equipment.daily_rate
      if (deliveryRequired && equipment.delivery_fee) {
        cost += equipment.delivery_fee
      }
      setTotalCost(cost)
    }
  }, [startDate, endDate, deliveryRequired, equipment.daily_rate, equipment.delivery_fee])

  const onSubmit = async (data: BookingFormData) => {
    if (!user) return

    try {
      setLoading(true)

      // Validate dates
      const today = new Date().toISOString().split('T')[0]
      if (data.startDate < today) {
        toast.error('Start date cannot be in the past')
        return
      }

      if (data.endDate <= data.startDate) {
        toast.error('End date must be after start date')
        return
      }

      if (totalDays < equipment.minimum_rental_period) {
        toast.error(`Minimum rental period is ${equipment.minimum_rental_period} days`)
        return
      }

      if (equipment.maximum_rental_period && totalDays > equipment.maximum_rental_period) {
        toast.error(`Maximum rental period is ${equipment.maximum_rental_period} days`)
        return
      }

      // Create booking
      const bookingData = {
        equipment_id: equipment.id,
        renter_id: user.id,
        owner_id: equipment.owner_id,
        start_date: data.startDate,
        end_date: data.endDate,
        total_days: totalDays,
        daily_rate: equipment.daily_rate,
        total_amount: totalCost,
        security_deposit: equipment.security_deposit,
        delivery_required: data.deliveryRequired,
        delivery_address: data.deliveryAddress,
        delivery_fee: deliveryRequired && equipment.delivery_fee ? equipment.delivery_fee : 0,
        notes: data.notes,
        status: 'pending',
        payment_status: 'pending'
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) throw error

      // Here you would integrate with Stripe for payment processing
      // For now, we'll just mark as successful
      onSuccess()
    } catch (error: any) {
      console.error('Booking error:', error)
      toast.error(error.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Equipment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Equipment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              <img
                src={equipment.images[0] || 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=200'}
                alt={equipment.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{equipment.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{equipment.location}</span>
                </div>
                <div className="text-lg font-bold text-primary-600 mt-2">
                  {formatCurrency(equipment.daily_rate)}/day
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rental Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  {...register('startDate', { required: 'Start date is required' })}
                  className="input-field"
                />
                {errors.startDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  min={startDate || minDate}
                  {...register('endDate', { required: 'End date is required' })}
                  className="input-field"
                />
                {errors.endDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Delivery Options */}
            {equipment.delivery_available && (
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('deliveryRequired')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Request delivery {equipment.delivery_fee && `(+${formatCurrency(equipment.delivery_fee)})`}
                  </span>
                </label>
                
                {deliveryRequired && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      {...register('deliveryAddress', { 
                        required: deliveryRequired ? 'Delivery address is required' : false 
                      })}
                      rows={3}
                      className="input-field"
                      placeholder="Enter complete delivery address..."
                    />
                    {errors.deliveryAddress && (
                      <p className="text-red-600 text-sm mt-1">{errors.deliveryAddress.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-field"
                placeholder="Any special requirements or notes..."
              />
            </div>

            {/* Cost Breakdown */}
            {totalDays > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Rental ({totalDays} days × {formatCurrency(equipment.daily_rate)})</span>
                    <span>{formatCurrency(totalDays * equipment.daily_rate)}</span>
                  </div>
                  {deliveryRequired && equipment.delivery_fee && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{formatCurrency(equipment.delivery_fee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span>{formatCurrency(equipment.security_deposit)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>{formatCurrency(totalCost + equipment.security_deposit)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Security deposit will be refunded after equipment return
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || totalDays === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loading-spinner" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Proceed to Payment
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingModal