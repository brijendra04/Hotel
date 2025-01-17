export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  description: string;
  amenities: string[];
  isEcoFriendly: boolean;
  accessibility?: {
    wheelchairAccessible: boolean;
    petFriendly: boolean;
    parkingAvailable: boolean;
    elevatorAccess: boolean;
    brailleSignage: boolean;
    hearingAccessible: boolean;
  };
  assistanceServices?: string[];
  cancellationPolicy?: {
    type: 'flexible' | 'moderate' | 'strict';
    description: string;
    refundPercentage: number;
  };
}

export interface SearchFilters {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  priceRange: [number, number];
  rating: number;
  ecoFriendly: boolean;
  accessibility?: {
    wheelchairAccessible?: boolean;
    petFriendly?: boolean;
    parkingAvailable?: boolean;
  };
}

export interface TravelTip {
  id: string;
  title: string;
  description: string;
  category: string;
  seasonality?: string[];
  relevantLocations?: string[];
}