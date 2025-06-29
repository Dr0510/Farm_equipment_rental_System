export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          user_type: 'renter' | 'owner' | 'both'
          verification_status: 'pending' | 'verified' | 'rejected'
          rating: number
          total_reviews: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          user_type?: 'renter' | 'owner' | 'both'
          verification_status?: 'pending' | 'verified' | 'rejected'
          rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          user_type?: 'renter' | 'owner' | 'both'
          verification_status?: 'pending' | 'verified' | 'rejected'
          rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
      }
      equipment: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string
          category: string
          subcategory?: string
          brand: string
          model: string
          year: number
          condition: 'excellent' | 'good' | 'fair' | 'poor'
          daily_rate: number
          weekly_rate?: number
          monthly_rate?: number
          security_deposit: number
          location: string
          latitude?: number
          longitude?: number
          availability_status: 'available' | 'rented' | 'maintenance' | 'inactive'
          images: string[]
          specifications: Record<string, any>
          features: string[]
          insurance_required: boolean
          delivery_available: boolean
          delivery_radius?: number
          delivery_fee?: number
          minimum_rental_period: number
          maximum_rental_period?: number
          rating: number
          total_reviews: number
          total_bookings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description: string
          category: string
          subcategory?: string
          brand: string
          model: string
          year: number
          condition: 'excellent' | 'good' | 'fair' | 'poor'
          daily_rate: number
          weekly_rate?: number
          monthly_rate?: number
          security_deposit: number
          location: string
          latitude?: number
          longitude?: number
          availability_status?: 'available' | 'rented' | 'maintenance' | 'inactive'
          images?: string[]
          specifications?: Record<string, any>
          features?: string[]
          insurance_required?: boolean
          delivery_available?: boolean
          delivery_radius?: number
          delivery_fee?: number
          minimum_rental_period?: number
          maximum_rental_period?: number
          rating?: number
          total_reviews?: number
          total_bookings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string
          category?: string
          subcategory?: string
          brand?: string
          model?: string
          year?: number
          condition?: 'excellent' | 'good' | 'fair' | 'poor'
          daily_rate?: number
          weekly_rate?: number
          monthly_rate?: number
          security_deposit?: number
          location?: string
          latitude?: number
          longitude?: number
          availability_status?: 'available' | 'rented' | 'maintenance' | 'inactive'
          images?: string[]
          specifications?: Record<string, any>
          features?: string[]
          insurance_required?: boolean
          delivery_available?: boolean
          delivery_radius?: number
          delivery_fee?: number
          minimum_rental_period?: number
          maximum_rental_period?: number
          rating?: number
          total_reviews?: number
          total_bookings?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          equipment_id: string
          renter_id: string
          owner_id: string
          start_date: string
          end_date: string
          total_days: number
          daily_rate: number
          total_amount: number
          security_deposit: number
          delivery_required: boolean
          delivery_address?: string
          delivery_fee?: number
          status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'disputed'
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
          payment_intent_id?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          renter_id: string
          owner_id: string
          start_date: string
          end_date: string
          total_days: number
          daily_rate: number
          total_amount: number
          security_deposit: number
          delivery_required?: boolean
          delivery_address?: string
          delivery_fee?: number
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'disputed'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          payment_intent_id?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          renter_id?: string
          owner_id?: string
          start_date?: string
          end_date?: string
          total_days?: number
          daily_rate?: number
          total_amount?: number
          security_deposit?: number
          delivery_required?: boolean
          delivery_address?: string
          delivery_fee?: number
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'disputed'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          payment_intent_id?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          equipment_id?: string
          rating: number
          title: string
          comment: string
          review_type: 'equipment' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          equipment_id?: string
          rating: number
          title: string
          comment: string
          review_type: 'equipment' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          reviewee_id?: string
          equipment_id?: string
          rating?: number
          title?: string
          comment?: string
          review_type?: 'equipment' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_records: {
        Row: {
          id: string
          equipment_id: string
          owner_id: string
          maintenance_type: 'routine' | 'repair' | 'inspection' | 'upgrade'
          description: string
          cost: number
          performed_by: string
          performed_date: string
          next_maintenance_date?: string
          documents: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          owner_id: string
          maintenance_type: 'routine' | 'repair' | 'inspection' | 'upgrade'
          description: string
          cost: number
          performed_by: string
          performed_date: string
          next_maintenance_date?: string
          documents?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          owner_id?: string
          maintenance_type?: 'routine' | 'repair' | 'inspection' | 'upgrade'
          description?: string
          cost?: number
          performed_by?: string
          performed_date?: string
          next_maintenance_date?: string
          documents?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      damage_reports: {
        Row: {
          id: string
          booking_id: string
          equipment_id: string
          reporter_id: string
          damage_type: 'minor' | 'major' | 'total'
          description: string
          estimated_cost: number
          images: string[]
          status: 'reported' | 'acknowledged' | 'resolved' | 'disputed'
          resolution_notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          equipment_id: string
          reporter_id: string
          damage_type: 'minor' | 'major' | 'total'
          description: string
          estimated_cost: number
          images?: string[]
          status?: 'reported' | 'acknowledged' | 'resolved' | 'disputed'
          resolution_notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          equipment_id?: string
          reporter_id?: string
          damage_type?: 'minor' | 'major' | 'total'
          description?: string
          estimated_cost?: number
          images?: string[]
          status?: 'reported' | 'acknowledged' | 'resolved' | 'disputed'
          resolution_notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}