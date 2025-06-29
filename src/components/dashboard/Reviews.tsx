import React from 'react'
import { Star } from 'lucide-react'

const Reviews: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-2">
          Manage reviews for your equipment and view feedback
        </p>
      </div>

      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Star className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Reviews Coming Soon
        </h3>
        <p className="text-gray-600">
          This feature is under development and will be available soon.
        </p>
      </div>
    </div>
  )
}

export default Reviews