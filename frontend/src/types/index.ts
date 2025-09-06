export interface User {
  id: string;
  email: string;
  username: string;
  role: 'traveler' | 'guide';
  created_at: string;
}

export interface Guide extends User {
  bio: string;
  location: string;
  languages: string[];
  tags: string[];
  rating: number;
  price_range: string;
}

export interface Traveler extends User {
  preferences: string[];
  location: string;
}

export interface Tour {
  id: string;
  guide_id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  location: string;
  tags: string[];
  images: string[];
}

export interface Booking {
  id: string;
  traveler_id: string;
  guide_id: string;
  tour_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  message: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}