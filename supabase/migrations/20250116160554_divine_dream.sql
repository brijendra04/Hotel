/*
  # Add Favorites Feature

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `hotel_id` (uuid, references hotels)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on favorites table
    - Add policies for authenticated users
*/

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    hotel_id uuid REFERENCES hotels NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, hotel_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own favorites"
    ON favorites
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
    ON favorites
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
    ON favorites
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);