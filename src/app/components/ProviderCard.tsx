import { useNavigate } from 'react-router';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, MapPin, Phone, Clock } from 'lucide-react';
import { Provider } from '../data/mockData';

interface ProviderCardProps {
  provider: Provider;
}

const typeIcons = {
  grooming: '✂️',
  health: '🏥',
  care: '❤️',
  training: '🎓',
  daycare: '🏠'
};

export default function ProviderCard({ provider }: ProviderCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/provider/${provider.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl">
            {typeIcons[provider.type]}
          </div>
          <div>
            <h3 className="text-xl mb-1">{provider.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{provider.rating}</span>
              </div>
              <span>•</span>
              <span>{provider.reviewCount} reviews</span>
            </div>
          </div>
        </div>
        {provider.distance && (
          <Badge variant="secondary" className="gap-1">
            <MapPin className="w-3 h-3" />
            {provider.distance} mi
          </Badge>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{provider.description}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {provider.badges.map((badge, idx) => (
          <Badge key={idx} variant="outline" className="text-xs">
            {badge}
          </Badge>
        ))}
      </div>

      {/* Services */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Services:</p>
        <div className="flex flex-wrap gap-2">
          {provider.services.slice(0, 3).map((service, idx) => (
            <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
              {service}
            </span>
          ))}
          {provider.services.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{provider.services.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4" />
          <span>{provider.locations[0].phone}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Open today</span>
        </div>
      </div>

      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        View Profile
      </Button>
    </Card>
  );
}
