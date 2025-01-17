import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Search, Mic, Calendar, DollarSign, Star, Accessibility, PawPrint, ParkingCircle } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { SearchFilters } from '../types/hotel';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: null,
    checkOut: null,
    priceRange: [0, 1000],
    rating: 0,
    ecoFriendly: false,
    accessibility: {
      wheelchairAccessible: false,
      petFriendly: false,
      parkingAvailable: false
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFilters(prev => ({ ...prev, location: transcript }));
      };
      recognition.start();
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Your Destination"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className="absolute right-3 top-2.5"
          >
            <Mic className="h-5 w-5 text-gray-400 hover:text-blue-500" />
          </button>
        </div>

        <div className="relative">
          <DatePicker
            selected={filters.checkIn}
            onChange={(date) => setFilters(prev => ({ ...prev, checkIn: date }))}
            placeholderText="Check-in"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <DatePicker
            selected={filters.checkOut}
            onChange={(date) => setFilters(prev => ({ ...prev, checkOut: date }))}
            placeholderText="Check-out"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
            className="w-32"
          />
          <span className="text-sm text-gray-600">Max ${filters.priceRange[1]}</span>
        </div>

        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-gray-400" />
          <select
            value={filters.rating}
            onChange={(e) => setFilters(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
            className="border rounded-lg px-2 py-1"
          >
            <option value="0">Any rating</option>
            {[3, 4, 5].map(rating => (
              <option key={rating} value={rating}>{rating}+ Stars</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.accessibility?.wheelchairAccessible}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                accessibility: {
                  ...prev.accessibility,
                  wheelchairAccessible: e.target.checked
                }
              }))}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <Accessibility className="h-4 w-4" />
            <span className="text-sm text-gray-600">Wheelchair Accessible</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.accessibility?.petFriendly}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                accessibility: {
                  ...prev.accessibility,
                  petFriendly: e.target.checked
                }
              }))}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <PawPrint className="h-4 w-4" />
            <span className="text-sm text-gray-600">Pet Friendly</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.accessibility?.parkingAvailable}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                accessibility: {
                  ...prev.accessibility,
                  parkingAvailable: e.target.checked
                }
              }))}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <ParkingCircle className="h-4 w-4" />
            <span className="text-sm text-gray-600">Parking Available</span>
          </label>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.ecoFriendly}
            onChange={(e) => setFilters(prev => ({ ...prev, ecoFriendly: e.target.checked }))}
            className="rounded text-green-500 focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">Eco-friendly only</span>
        </label>
      </div>
    </form>
  );
}