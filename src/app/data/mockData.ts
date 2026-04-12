export interface Provider {
  id: string;
  name: string;
  type: 'grooming' | 'health' | 'care' | 'training' | 'daycare';
  rating: number;
  reviewCount: number;
  description: string;
  services: string[];
  staff: { name: string; role: string; avatar: string }[];
  locations: {
    address: string;
    lat: number;
    lng: number;
    phone: string;
  }[];
  email: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  availability: {
    [key: string]: { start: string; end: string }[];
  };
  images: string[];
  badges: string[];
  distance?: number;
  profileWidgets?: {
    location: boolean;
    team: boolean;
    hours: boolean;
    services: boolean;
    images: boolean;
    social: boolean;
  };
}

export interface Booking {
  id: string;
  providerId: string;
  userId: string;
  service: string;
  date: string;
  time: string;
  petName: string;
  petType: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface PetAvatar {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster';
  color: string;
  accessories: string[];
  position: { x: number; y: number };
  message?: string;
  badges: string[];
  birthday?: string;
}

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Pawsitive Grooming Salon',
    type: 'grooming',
    rating: 4.8,
    reviewCount: 234,
    description: 'Premium grooming services for all breeds. Our experienced team provides gentle care and stunning results.',
    services: ['Full Grooming', 'Bath & Brush', 'Nail Trimming', 'Teeth Cleaning', 'De-shedding Treatment'],
    staff: [
      { name: 'Sarah Johnson', role: 'Head Groomer', avatar: '👩' },
      { name: 'Mike Chen', role: 'Senior Groomer', avatar: '👨' },
      { name: 'Lisa Martinez', role: 'Groomer', avatar: '👩' }
    ],
    locations: [
      {
        address: '123 Main Street, Downtown',
        lat: 40.7128,
        lng: -74.0060,
        phone: '(555) 123-4567'
      }
    ],
    email: 'contact@pawsitivegrooming.com',
    socialMedia: {
      facebook: 'pawsitivegrooming',
      instagram: '@pawsitivegrooming',
      twitter: '@pawsgrooming'
    },
    availability: {
      'Monday': [{ start: '09:00', end: '17:00' }],
      'Tuesday': [{ start: '09:00', end: '17:00' }],
      'Wednesday': [{ start: '09:00', end: '17:00' }],
      'Thursday': [{ start: '09:00', end: '17:00' }],
      'Friday': [{ start: '09:00', end: '19:00' }],
      'Saturday': [{ start: '10:00', end: '16:00' }]
    },
    images: [],
    badges: ['Top Rated', 'Quick Response', '5 Years Experience'],
    distance: 1.2
  },
  {
    id: '2',
    name: 'Happy Tails Veterinary Clinic',
    type: 'health',
    rating: 4.9,
    reviewCount: 456,
    description: 'Comprehensive veterinary care with state-of-the-art facilities. Emergency services available 24/7.',
    services: ['Check-ups', 'Vaccinations', 'Surgery', 'Dental Care', 'Emergency Care', 'Lab Tests'],
    staff: [
      { name: 'Dr. Emily Roberts', role: 'Chief Veterinarian', avatar: '👩‍⚕️' },
      { name: 'Dr. James Wilson', role: 'Veterinarian', avatar: '👨‍⚕️' },
      { name: 'Anna Lee', role: 'Vet Tech', avatar: '👩' },
      { name: 'Tom Brown', role: 'Vet Tech', avatar: '👨' }
    ],
    locations: [
      {
        address: '456 Oak Avenue, Midtown',
        lat: 40.7589,
        lng: -73.9851,
        phone: '(555) 234-5678'
      },
      {
        address: '789 Pine Street, Uptown',
        lat: 40.7831,
        lng: -73.9712,
        phone: '(555) 234-5679'
      }
    ],
    email: 'info@happytailsvet.com',
    socialMedia: {
      facebook: 'happytailsvet',
      instagram: '@happytailsvet',
      twitter: '@happytailsvet'
    },
    availability: {
      'Monday': [{ start: '08:00', end: '20:00' }],
      'Tuesday': [{ start: '08:00', end: '20:00' }],
      'Wednesday': [{ start: '08:00', end: '20:00' }],
      'Thursday': [{ start: '08:00', end: '20:00' }],
      'Friday': [{ start: '08:00', end: '20:00' }],
      'Saturday': [{ start: '09:00', end: '18:00' }],
      'Sunday': [{ start: '10:00', end: '16:00' }]
    },
    images: ['https://images.unsplash.com/photo-1724632824319-4b43e74e000c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY2xpbmljJTIwbW9kZXJufGVufDF8fHx8MTc3MzMzNTExM3ww&ixlib=rb-4.1.0&q=80&w=1080'],
    badges: ['24/7 Emergency', 'Board Certified', 'Most Popular'],
    distance: 2.5
  },
  {
    id: '3',
    name: 'Fur & Feather Pet Sitting',
    type: 'care',
    rating: 4.7,
    reviewCount: 189,
    description: 'Reliable pet sitting and boarding services. Your pets will feel at home with our loving caregivers.',
    services: ['Pet Sitting', 'Dog Walking', 'Overnight Boarding', 'House Sitting', 'Pet Transportation'],
    staff: [
      { name: 'Rachel Green', role: 'Owner & Caregiver', avatar: '👩' },
      { name: 'Chris Anderson', role: 'Senior Caregiver', avatar: '👨' },
      { name: 'Maya Patel', role: 'Caregiver', avatar: '👩' }
    ],
    locations: [
      {
        address: '321 Maple Drive, Westside',
        lat: 40.7489,
        lng: -73.9680,
        phone: '(555) 345-6789'
      }
    ],
    email: 'hello@furandfeather.com',
    socialMedia: {
      facebook: 'furandfeather',
      instagram: '@furandfeatherpets'
    },
    availability: {
      'Monday': [{ start: '07:00', end: '21:00' }],
      'Tuesday': [{ start: '07:00', end: '21:00' }],
      'Wednesday': [{ start: '07:00', end: '21:00' }],
      'Thursday': [{ start: '07:00', end: '21:00' }],
      'Friday': [{ start: '07:00', end: '21:00' }],
      'Saturday': [{ start: '08:00', end: '20:00' }],
      'Sunday': [{ start: '08:00', end: '20:00' }]
    },
    images: ['https://images.unsplash.com/photo-1761244960871-a4f3e97963a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0aW5nJTIwY2FyZXxlbnwxfHx8fDE3NzMzMzUxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    badges: ['Trusted Sitter', 'Flexible Hours'],
    distance: 0.8
  },
  {
    id: '4',
    name: 'Bark & Learn Training Academy',
    type: 'training',
    rating: 4.9,
    reviewCount: 312,
    description: 'Professional dog training using positive reinforcement methods. Group classes and private sessions available.',
    services: ['Puppy Training', 'Obedience Classes', 'Behavior Modification', 'Agility Training', 'Private Sessions'],
    staff: [
      { name: 'David Thompson', role: 'Certified Trainer', avatar: '👨' },
      { name: 'Jennifer Lee', role: 'Trainer', avatar: '👩' }
    ],
    locations: [
      {
        address: '555 Training Lane, Eastside',
        lat: 40.7389,
        lng: -73.9900,
        phone: '(555) 456-7890'
      }
    ],
    email: 'train@barkandlearn.com',
    socialMedia: {
      facebook: 'barkandlearn',
      instagram: '@barkandlearn',
      twitter: '@barklearn'
    },
    availability: {
      'Monday': [{ start: '10:00', end: '19:00' }],
      'Tuesday': [{ start: '10:00', end: '19:00' }],
      'Wednesday': [{ start: '10:00', end: '19:00' }],
      'Thursday': [{ start: '10:00', end: '19:00' }],
      'Friday': [{ start: '10:00', end: '19:00' }],
      'Saturday': [{ start: '09:00', end: '17:00' }]
    },
    images: ['https://images.unsplash.com/photo-1758274525887-d95d19269f76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmFpbmluZyUyMGNsYXNzfGVufDF8fHx8MTc3MzMyNTEwMHww&ixlib=rb-4.1.0&q=80&w=1080'],
    badges: ['Certified Professional', 'Top Rated'],
    distance: 3.1
  },
  {
    id: '5',
    name: 'Playful Paws Daycare',
    type: 'daycare',
    rating: 4.6,
    reviewCount: 278,
    description: 'Fun and safe daycare for energetic pets. Supervised play, socialization, and lots of love.',
    services: ['Daycare', 'Half-Day Care', 'Weekly Packages', 'Playtime Sessions', 'Socialization Groups'],
    staff: [
      { name: 'Alex Rivera', role: 'Facility Manager', avatar: '👨' },
      { name: 'Sophie Turner', role: 'Play Supervisor', avatar: '👩' },
      { name: 'Marcus Williams', role: 'Caregiver', avatar: '👨' }
    ],
    locations: [
      {
        address: '888 Happy Street, Southside',
        lat: 40.7189,
        lng: -73.9980,
        phone: '(555) 567-8901'
      }
    ],
    email: 'play@playfulpaws.com',
    socialMedia: {
      facebook: 'playfulpawsdaycare',
      instagram: '@playfulpawsdaycare'
    },
    availability: {
      'Monday': [{ start: '06:00', end: '19:00' }],
      'Tuesday': [{ start: '06:00', end: '19:00' }],
      'Wednesday': [{ start: '06:00', end: '19:00' }],
      'Thursday': [{ start: '06:00', end: '19:00' }],
      'Friday': [{ start: '06:00', end: '19:00' }]
    },
    images: [],
    badges: ['Safe Environment', 'Extended Hours'],
    distance: 1.9
  }
];

export const predefinedMessages = [
  '👋 Hi there!',
  '🎉 Having fun!',
  '❤️ Love this place!',
  '🐾 Looking for grooming!',
  '🏥 Need a vet nearby',
  '🎂 It\'s my birthday!',
  '⭐ New here!',
  '👍 Great service!',
  '🎨 Check out my style!',
  '🤝 Let\'s be friends!'
];

export const serviceStands = [
  { id: 'search', name: 'Search Services', position: { x: 200, y: 150 }, icon: '🔍' },
  { id: 'grooming', name: 'Grooming', position: { x: 500, y: 200 }, icon: '✂️' },
  { id: 'health', name: 'Health', position: { x: 700, y: 150 }, icon: '🏥' },
  { id: 'care', name: 'Care', position: { x: 350, y: 400 }, icon: '❤️' },
  { id: 'training', name: 'Training', position: { x: 650, y: 400 }, icon: '🎓' }
];