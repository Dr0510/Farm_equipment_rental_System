import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, MapPin, Star, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Equipment as EquipmentType, SearchFilters } from '../types'
import EquipmentCard from '../components/equipment/EquipmentCard'
import EquipmentFilters from '../components/equipment/EquipmentFilters'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { formatCurrency } from '../lib/utils'

const Equipment: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [equipment, setEquipment] = useState<EquipmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || undefined,
    location: searchParams.get('location') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  })

  useEffect(() => {
    fetchEquipment()
  }, [filters, searchQuery])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('equipment')
        .select(`
          *,
          owner:profiles(*)
        `)
        .eq('availability_status', 'available')

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      
      if (filters.minPrice) {
        query = query.gte('daily_rate', filters.minPrice)
      }
      
      if (filters.maxPrice) {
        query = query.lte('daily_rate', filters.maxPrice)
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setEquipment(data || [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearchParams({ search: searchQuery })
  }

  const updateSearchParams = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    setSearchParams(params)
  }

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    updateSearchParams({
      category: newFilters.category,
      location: newFilters.location,
      minPrice: newFilters.minPrice?.toString(),
      maxPrice: newFilters.maxPrice?.toString(),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-max py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Farm Equipment Rental
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search equipment, brand, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </form>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{equipment.length} equipment available</span>
            <div className="flex items-center gap-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <EquipmentFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          )}

          {/* Equipment Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No equipment found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((item) => (
                  <EquipmentCard key={item.id} equipment={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Equipment