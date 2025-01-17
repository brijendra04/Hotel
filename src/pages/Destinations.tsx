import React from 'react';
import { MapPin } from 'lucide-react';

const destinations = [
  {
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: 'The city of love and lights, home to iconic landmarks and world-class cuisine',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    description: 'Where tradition meets innovation, experience the perfect blend of old and new',
  },
  {
    city: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    description: 'The city that never sleeps, offering endless entertainment and cultural experiences',
  },
  {
    city: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
    description: 'Stunning sunsets and pristine white architecture overlooking the Aegean Sea',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    description: 'Ultra-modern architecture and luxury shopping in the heart of the desert',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    description: 'Tropical paradise with rich culture, pristine beaches, and lush landscapes',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    description: 'Stunning architecture, vibrant culture, and Mediterranean charm',
  },
  {
    city: 'Maldives',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
    description: 'Crystal clear waters, overwater bungalows, and ultimate relaxation',
  },
  {
    city: 'Cape Town',
    country: 'South Africa',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
    description: 'Where mountains meet the ocean, offering diverse experiences and natural beauty',
  }
];

export default function Destinations() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h1>
        <p className="text-xl text-gray-600">Discover your next adventure in these amazing locations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((destination) => (
          <div key={destination.city} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
            <div className="relative h-64">
              <img
                src={destination.image}
                alt={destination.city}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center mb-1">
                  <MapPin className="h-5 w-5 mr-2" />
                  <h3 className="text-2xl font-semibold">
                    {destination.city}
                  </h3>
                </div>
                <p className="text-lg">{destination.country}</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{destination.description}</p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Explore Hotels
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}