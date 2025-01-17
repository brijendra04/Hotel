/*
  # Add sample hotels and feature vectors

  This migration adds sample hotel data and their corresponding feature vectors for visual search.

  1. Sample Data
    - Adds diverse hotels across different locations
    - Includes various amenities and features
    - Sets realistic prices and ratings
    - Adds feature vectors for visual search
*/

-- Insert sample hotels
INSERT INTO hotels (name, location, rating, price, image, description, amenities, is_eco_friendly)
VALUES
  (
    'The Ritz-Carlton Paris',
    'Paris, France',
    4.9,
    850,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    'Luxury hotel in the heart of Paris with stunning views of the Eiffel Tower',
    ARRAY['Spa', 'Fine Dining', 'Concierge', 'Room Service', 'Pool'],
    true
  ),
  (
    'Mandarin Oriental Tokyo',
    'Tokyo, Japan',
    4.8,
    750,
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    'Contemporary luxury with panoramic views of Tokyo skyline',
    ARRAY['Hot Spring', 'Michelin Restaurant', 'Sky Bar', 'Spa', 'Fitness Center'],
    true
  ),
  (
    'Plaza New York',
    'New York, USA',
    4.7,
    950,
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
    'Historic luxury hotel overlooking Central Park',
    ARRAY['Butler Service', 'Fine Dining', 'Spa', 'Fitness Center', 'Business Center'],
    false
  ),
  (
    'Santorini Grace',
    'Santorini, Greece',
    4.9,
    680,
    'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f',
    'Boutique hotel with infinity pools and caldera views',
    ARRAY['Infinity Pool', 'Mediterranean Restaurant', 'Sunset Terrace', 'Spa'],
    true
  ),
  (
    'Burj Al Arab',
    'Dubai, UAE',
    5.0,
    1200,
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
    'Ultra-luxury hotel with iconic sail-shaped architecture',
    ARRAY['Private Beach', 'Helipad', 'Underwater Restaurant', 'Gold-plated Amenities'],
    false
  ),
  (
    'Four Seasons Bali',
    'Bali, Indonesia',
    4.8,
    550,
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    'Beachfront resort with traditional Balinese architecture',
    ARRAY['Private Beach', 'Yoga Classes', 'Spa', 'Cultural Activities'],
    true
  ),
  (
    'W Barcelona',
    'Barcelona, Spain',
    4.6,
    480,
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
    'Modern beachfront hotel with iconic sail-like design',
    ARRAY['Beachfront', 'Rooftop Bar', 'Spa', 'Pool'],
    true
  ),
  (
    'Soneva Jani',
    'Maldives',
    5.0,
    1500,
    'https://images.unsplash.com/photo-1439130490301-25e322d88054',
    'Overwater villas with retractable roofs and water slides',
    ARRAY['Private Pool', 'Water Slide', 'Observatory', 'Cinema Paradiso'],
    true
  ),
  (
    'Cape Grace',
    'Cape Town, South Africa',
    4.7,
    420,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    'Waterfront luxury hotel with Table Mountain views',
    ARRAY['Spa', 'Wine Cellar', 'Whisky Bar', 'Pool'],
    true
  );

-- Add feature vectors for visual search (sample vectors, would be replaced with real embeddings)
INSERT INTO hotel_features (hotel_id, feature_vector)
SELECT 
  id,
  array_fill(0.1, ARRAY[1024])::vector(1024) -- Updated to 1024 dimensions
FROM 
  hotels;