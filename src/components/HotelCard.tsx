import React, { useState, useEffect } from 'react';
import { Star, Leaf, Heart, Accessibility, PawPrint, ParkingCircle } from 'lucide-react';
import { Hotel } from '../types/hotel';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface HotelCardProps {
  hotel: Hotel;
  onBookNow: (hotel: Hotel) => void;
}

export default function HotelCard({ hotel, onBookNow }: HotelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, [hotel.id]);

  const checkIfFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('hotel_id', hotel.id);

      if (error) throw error;
      setIsFavorite(data && data.length > 0);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to save favorites');
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('hotel_id', hotel.id);

        if (error) throw error;
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, hotel_id: hotel.id }]);

        if (error) throw error;
        toast.success('Added to favorites');
      }

      setIsFavorite(!isFavorite);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`}
          />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
            <p className="text-gray-600">{hotel.location}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold">{hotel.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{hotel.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.map((amenity) => (
            <span
              key={amenity}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {amenity}
            </span>
          ))}
        </div>

        {hotel.isEcoFriendly && (
          <div className="flex items-center text-green-600 mb-4">
            <Leaf className="h-5 w-5 mr-2" />
            <span>Eco-friendly property</span>
          </div>
        )}

        {hotel.accessibility && (
          <div className="flex gap-2 mb-4">
            {hotel.accessibility.wheelchairAccessible && (
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full" title="Wheelchair Accessible">
                <Accessibility className="h-4 w-4" />
              </div>
            )}
            {hotel.accessibility.petFriendly && (
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full" title="Pet Friendly">
                <PawPrint className="h-4 w-4" />
              </div>
            )}
            {hotel.accessibility.parkingAvailable && (
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full" title="Parking Available">
                <ParkingCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">${hotel.price}<span className="text-sm font-normal text-gray-600">/night</span></div>
          <button
            onClick={() => onBookNow(hotel)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}