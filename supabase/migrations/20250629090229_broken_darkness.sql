/*
  # Initial Database Schema for Farm Equipment Rental Platform

  1. New Tables
    - `profiles` - User profiles with authentication data
    - `equipment` - Equipment listings with details and availability
    - `bookings` - Rental bookings and transactions
    - `reviews` - Equipment and user reviews
    - `maintenance_records` - Equipment maintenance tracking
    - `damage_reports` - Damage reporting system

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Functions
    - Trigger to create profile on user signup
    - Functions to update ratings and review counts
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  user_type text NOT NULL DEFAULT 'renter' CHECK (user_type IN ('renter', 'owner', 'both')),
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  rating numeric(3,2) NOT NULL DEFAULT 0.0,
  total_reviews integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  subcategory text,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  condition text NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  daily_rate numeric(10,2) NOT NULL,
  weekly_rate numeric(10,2),
  monthly_rate numeric(10,2),
  security_deposit numeric(10,2) NOT NULL DEFAULT 0,
  location text NOT NULL,
  latitude numeric(10,8),
  longitude numeric(11,8),
  availability_status text NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'rented', 'maintenance', 'inactive')),
  images text[] DEFAULT '{}',
  specifications jsonb DEFAULT '{}',
  features text[] DEFAULT '{}',
  insurance_required boolean DEFAULT false,
  delivery_available boolean DEFAULT false,
  delivery_radius integer,
  delivery_fee numeric(10,2),
  minimum_rental_period integer NOT NULL DEFAULT 1,
  maximum_rental_period integer,
  rating numeric(3,2) NOT NULL DEFAULT 0.0,
  total_reviews integer NOT NULL DEFAULT 0,
  total_bookings integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  renter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_days integer NOT NULL,
  daily_rate numeric(10,2) NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  security_deposit numeric(10,2) NOT NULL,
  delivery_required boolean DEFAULT false,
  delivery_address text,
  delivery_fee numeric(10,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_intent_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL,
  review_type text NOT NULL CHECK (review_type IN ('equipment', 'user')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create maintenance_records table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  maintenance_type text NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'inspection', 'upgrade')),
  description text NOT NULL,
  cost numeric(10,2) NOT NULL DEFAULT 0,
  performed_by text NOT NULL,
  performed_date date NOT NULL,
  next_maintenance_date date,
  documents text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create damage_reports table
CREATE TABLE IF NOT EXISTS damage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  damage_type text NOT NULL CHECK (damage_type IN ('minor', 'major', 'total')),
  description text NOT NULL,
  estimated_cost numeric(10,2) NOT NULL DEFAULT 0,
  images text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'resolved', 'disputed')),
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view other profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Equipment policies
CREATE POLICY "Anyone can view available equipment"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (availability_status = 'available');

CREATE POLICY "Owners can manage their equipment"
  ON equipment
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert equipment"
  ON equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Bookings policies
CREATE POLICY "Users can view their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Renters can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Owners can update booking status"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for their bookings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Maintenance records policies
CREATE POLICY "Owners can manage maintenance records"
  ON maintenance_records
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- Damage reports policies
CREATE POLICY "Users can view damage reports for their bookings"
  ON damage_reports
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = reporter_id OR 
    auth.uid() IN (
      SELECT owner_id FROM bookings WHERE id = booking_id
      UNION
      SELECT renter_id FROM bookings WHERE id = booking_id
    )
  );

CREATE POLICY "Users can create damage reports"
  ON damage_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'User'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update equipment rating
CREATE OR REPLACE FUNCTION update_equipment_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE equipment
  SET 
    rating = (
      SELECT COALESCE(AVG(rating::numeric), 0)
      FROM reviews
      WHERE equipment_id = NEW.equipment_id AND review_type = 'equipment'
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE equipment_id = NEW.equipment_id AND review_type = 'equipment'
    )
  WHERE id = NEW.equipment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update equipment rating on review insert/update
CREATE TRIGGER update_equipment_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.review_type = 'equipment')
  EXECUTE FUNCTION update_equipment_rating();

-- Function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET 
    rating = (
      SELECT COALESCE(AVG(rating::numeric), 0)
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id AND review_type = 'user'
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id AND review_type = 'user'
    )
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user rating on review insert/update
CREATE TRIGGER update_user_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.review_type = 'user')
  EXECUTE FUNCTION update_user_rating();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_owner_id ON equipment(owner_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_availability ON equipment(availability_status);
CREATE INDEX IF NOT EXISTS idx_bookings_equipment_id ON bookings(equipment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reviews_equipment_id ON reviews(equipment_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);