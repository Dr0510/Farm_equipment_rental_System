import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Calendar, Shield } from 'lucide-react'
import { Equipment } from '../../types'
import { formatCurrency, getStatusColor } from '../../lib/utils'

interface EquipmentCardProps {
  equipment: Equipment
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  return (
    <Link to={`/equipment/${equipment.id}`} className="card overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={equipment.images[0] || 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={equipment.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.availability_status)}`}>
            {equipment.availability_status}
          </span>
        </div>
        {equipment.insurance_required && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 rounded-full p-1">
              <Shield className="h-4 w-4 text-primary-600" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
            {equipment.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{equipment.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {equipment.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{equipment.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{equipment.year}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(equipment.daily_rate)}
            </div>
            <div className="text-sm text-gray-500">per day</div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {equipment.brand} {equipment.model}
            </div>
            <div className="text-sm font-medium text-gray-700">
              {equipment.condition}
            </div>
          </div>
        </div>

        {equipment.delivery_available && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-sm text-green-600 font-medium">
              ✓ Delivery available
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default EquipmentCard