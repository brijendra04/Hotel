import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hotel } from '../types/hotel';
import { toast } from 'react-hot-toast';
import { CreditCard, Calendar, Users } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel as Hotel;
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);

  if (!hotel) {
    navigate('/');
    return null;
  }

  const total = hotel.price * nights;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Booking confirmed! Check your email for details.');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hotel Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover rounded-lg mb-4" />
          <h2 className="text-2xl font-bold mb-2">{hotel.name}</h2>
          <p className="text-gray-600 mb-4">{hotel.location}</p>
          <div className="space-y-2">
            {hotel.amenities.map((amenity) => (
              <span key={amenity} className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm mr-2">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline-block w-5 h-5 mr-2" />
              Number of Nights
            </label>
            <input
              type="number"
              min="1"
              value={nights}
              onChange={(e) => setNights(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="inline-block w-5 h-5 mr-2" />
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Price per night</span>
              <span>${hotel.price}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}