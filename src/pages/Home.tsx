import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ImageSearch from '../components/ImageSearch';
import HotelCard from '../components/HotelCard';
import { Hotel, SearchFilters } from '../types/hotel';
import { Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isImageSearch, setIsImageSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hotels')
        .select('*');

      if (error) throw error;
      setHotels(data || []);
    } catch (error: any) {
      toast.error('Failed to load hotels');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setIsLoading(true);
      let query = supabase.from('hotels').select('*');

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.rating) {
        query = query.gte('rating', filters.rating);
      }
      if (filters.priceRange[1] < 1000) {
        query = query.lte('price', filters.priceRange[1]);
      }
      if (filters.ecoFriendly) {
        query = query.eq('is_eco_friendly', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setHotels(data || []);
    } catch (error: any) {
      toast.error('Failed to search hotels');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSearchResults = (results: Hotel[]) => {
    setHotels(results);
  };

  const handleBookNow = (hotel: Hotel) => {
    navigate('/checkout', { state: { hotel } });
  };

  return (
    <>
      <div className="relative bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">
              Find Your Perfect Stay
            </h1>
            
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setIsImageSearch(false)}
                className={`px-4 py-2 rounded-l-lg ${
                  !isImageSearch
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-700 text-white'
                }`}
              >
                Text Search
              </button>
              <button
                onClick={() => setIsImageSearch(true)}
                className={`px-4 py-2 rounded-r-lg flex items-center ${
                  isImageSearch
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-700 text-white'
                }`}
              >
                <Camera className="w-4 h-4 mr-2" />
                Visual Search
              </button>
            </div>

            {isImageSearch ? (
              <ImageSearch onResults={handleImageSearchResults} />
            ) : (
              <SearchBar onSearch={handleSearch} />
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map(hotel => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}