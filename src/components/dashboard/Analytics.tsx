import React from 'react'
import { BarChart3 } from 'lucide-react'

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track your equipment performance and revenue
        </p>
      </div>

      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <BarChart3 className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Analytics Coming Soon
        </h3>
        <p className="text-gray-600">
          Detailed analytics and reporting features are under development.
        </p>
      </div>
    </div>
  )
}

export default Analytics