import React from 'react'
import { Settings } from 'lucide-react'

const MaintenanceRecords: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Records</h1>
        <p className="text-gray-600 mt-2">
          Track maintenance history and schedule upcoming services
        </p>
      </div>

      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Settings className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Maintenance Tracking Coming Soon
        </h3>
        <p className="text-gray-600">
          Equipment maintenance tracking features are under development.
        </p>
      </div>
    </div>
  )
}

export default MaintenanceRecords