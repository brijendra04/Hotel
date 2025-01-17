/*
  # Update vector dimensions and add safe policy creation

  1. Changes
    - Update vector dimensions to 1001 for MobileNet compatibility
    - Add safe policy creation with existence checks
  
  2. Security
    - Maintain existing RLS policies
    - Add safe policy creation
*/

-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create hotels table if it doesn't exist
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
  price numeric NOT NULL CHECK (price >= 0),
  image text NOT NULL,
  description text NOT NULL,
  amenities text[] NOT NULL DEFAULT '{}',
  is_eco_friendly boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create hotel_features table with correct dimensions
CREATE TABLE IF NOT EXISTS hotel_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  feature_vector vector(1001), -- Updated to match MobileNet dimensions
  created_at timestamptz DEFAULT now()
);

-- Create index for similarity search
CREATE INDEX IF NOT EXISTS hotel_features_vector_idx ON hotel_features 
USING ivfflat (feature_vector vector_cosine_ops)
WITH (lists = 100);

-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_features ENABLE ROW LEVEL SECURITY;

-- Safely create policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow public read access to hotels" ON hotels;
  DROP POLICY IF EXISTS "Allow public read access to hotel features" ON hotel_features;
  
  -- Create new policies
  CREATE POLICY "Allow public read access to hotels"
    ON hotels
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Allow public read access to hotel features"
    ON hotel_features
    FOR SELECT
    TO public
    USING (true);
END $$;

-- Create or replace function for similarity search with correct dimensions
CREATE OR REPLACE FUNCTION match_hotels(
  query_embedding vector(1001), -- Updated to match MobileNet dimensions
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  name text,
  location text,
  rating numeric,
  price numeric,
  image text,
  description text,
  amenities text[],
  is_eco_friendly boolean,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.id,
    h.name,
    h.location,
    h.rating,
    h.price,
    h.image,
    h.description,
    h.amenities,
    h.is_eco_friendly,
    1 - (hf.feature_vector <=> query_embedding) as similarity
  FROM hotels h
  INNER JOIN hotel_features hf ON h.id = hf.hotel_id
  WHERE 1 - (hf.feature_vector <=> query_embedding) > match_threshold
  ORDER BY hf.feature_vector <=> query_embedding
  LIMIT match_count;
END;
$$;