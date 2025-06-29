import React from 'react'
import { AlertTriangle } from 'lucide-react'

const DamageReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Damage Reports</h1>
        <p className="text-gray-600 mt-2">
          View and manage damage reports for your equipment
        </p>
      </div>

      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <AlertTriangle className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Damage Reporting Coming Soon
        </h3>
        <p className="text-gray-600">
          Damage reporting and management features are under development.
        </p>
      </div>
    </div>
  )
}

export default DamageReports