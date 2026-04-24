import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LayoutGrid, MessageCircle, Search, MapPin, User, LogOut } from 'lucide-react';
import PetAvatar from '../components/PetAvatar';
import ServiceStand from '../components/ServiceStand';
import AvatarCustomizer from '../components/AvatarCustomizer';
import { PetAvatar as PetAvatarType, predefinedMessages, serviceStands } from '../data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import LoginDialog from '../components/LoginDialog';

export default function MapView() {
  const navigate = useNavigate();
  const { user, isGuest, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [userAvatar, setUserAvatar] = useState<PetAvatarType>({
    id: 'user',
    name: 'MyPet',
    type: 'dog',
    color: '#FFD700',
    accessories: [],
    position: { x: 400, y: 300 },
    message: '',
    badges: ['Newbie'],
  });

  const [nearbyAvatars, setNearbyAvatars] = useState<PetAvatarType[]>([]);

  useEffect(() => {
    let isActive = true;
    
    const generateAvatars = () => {
      const types: ('dog' | 'cat' | 'bird' | 'rabbit' | 'hamster')[] = ['dog', 'cat', 'bird', 'rabbit', 'hamster'];
      const names = ['Buddy', 'Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Cooper', 'Daisy'];
      const colors = ['#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'];
      const messages = [...predefinedMessages, ''];
      
      const avatars: PetAvatarType[] = [];
      const count = locationEnabled ? 8 : 5;
      
      for (let i = 0; i < count; i++) {
        avatars.push({
          id: `pet-${i}`,
          name: names[Math.floor(Math.random() * names.length)],
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          accessories: [],
          position: {
            x: Math.random() * 800 + 50,
            y: Math.random() * 400 + 100,
          },
          message: Math.random() > 0.6 ? messages[Math.floor(Math.random() * messages.length)] : undefined,
          badges: Math.random() > 0.7 ? ['⭐'] : [],
          birthday: Math.random() > 0.9 ? 'Today!' : undefined,
        });
      }
      
      if (isActive) setNearbyAvatars(avatars);
    };

    generateAvatars();
    const interval = setInterval(generateAvatars, 10000);
    
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [locationEnabled]);

  const handleLocationDecision = (allow: boolean) => {
    setLocationEnabled(allow);
    setShowLocationPrompt(false);
  };

  const moveAvatar = (x: number, y: number) => {
    setUserAvatar(prev => ({
      ...prev,
      position: { x, y }
    }));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 32; // Center the avatar
    const y = e.clientY - rect.top - 32;
    moveAvatar(x, y);
  };

  const handleStandClick = (standId: string) => {
    if (standId === 'search') {
      navigate('/search');
    } else {
      navigate(`/search?type=${standId}`);
    }
  };

  const sendMessage = (message: string) => {
    setUserAvatar(prev => ({ ...prev, message }));
    setShowMessageMenu(false);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setUserAvatar(prev => ({ ...prev, message: '' }));
    }, 5000);
  };

  const handleAvatarUpdate = (updates: Partial<PetAvatarType>) => {
    setUserAvatar(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PetConnect
            </h1>
            <Badge variant="outline" className="gap-1">
              <MapPin className="w-3 h-3" />
              {locationEnabled ? 'Location On' : 'Location Off'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMessageMenu(true)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Switch to Browse
            </Button>
            {!isGuest ? (
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogin(true)}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 cursor-pointer"
          onClick={handleMapClick}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              linear-gradient(180deg, #e0f2fe 0%, #fae8ff 100%)
            `,
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 text-6xl opacity-20">🌳</div>
          <div className="absolute top-20 right-20 text-6xl opacity-20">🌳</div>
          <div className="absolute bottom-20 left-32 text-6xl opacity-20">🌸</div>
          <div className="absolute bottom-10 right-40 text-6xl opacity-20">🌸</div>
          <div className="absolute top-1/2 left-1/4 text-4xl opacity-20">🦋</div>
          <div className="absolute top-1/3 right-1/3 text-4xl opacity-20">☀️</div>

          {/* Service stands */}
          {serviceStands.map(stand => (
            <ServiceStand
              key={stand.id}
              name={stand.name}
              icon={stand.icon}
              position={stand.position}
              onClick={() => handleStandClick(stand.id)}
            />
          ))}

          {/* Nearby avatars */}
          {nearbyAvatars.map(avatar => (
            <PetAvatar key={avatar.id} avatar={avatar} />
          ))}

          {/* User avatar */}
          <PetAvatar avatar={userAvatar} isUser />

          {/* Instructions */}
          <Card className="absolute top-4 left-4 p-3 max-w-xs">
            <p className="text-sm text-gray-600">
              👆 Click anywhere to move your pet! Visit service stands to search for providers.
            </p>
          </Card>

          {/* Online count */}
          <Card className="absolute top-4 right-4 p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">{nearbyAvatars.length + 1} pets online</span>
            </div>
          </Card>

          {/* Avatar Customization Button */}
          <Button
            onClick={() => setShowAvatarCustomizer(true)}
            className="absolute bottom-6 right-6 rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <User className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>

      {/* Location Permission Dialog */}
      <Dialog open={showLocationPrompt} onOpenChange={setShowLocationPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Location Services?</DialogTitle>
            <DialogDescription>
              Allowing location access will show you nearby pets and prioritize local service providers in your search results.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => handleLocationDecision(false)}
              className="flex-1"
            >
              No Thanks
            </Button>
            <Button
              onClick={() => handleLocationDecision(true)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Enable Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Menu Dialog */}
      <Dialog open={showMessageMenu} onOpenChange={setShowMessageMenu}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send a Message</DialogTitle>
            <DialogDescription>
              Choose a message to display above your pet avatar
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {predefinedMessages.map((message, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => sendMessage(message)}
                className="justify-start"
              >
                {message}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Avatar Customizer Dialog */}
      <Dialog open={showAvatarCustomizer} onOpenChange={setShowAvatarCustomizer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Your Avatar</DialogTitle>
            <DialogDescription>
              Choose your pet's type, color, and accessories
            </DialogDescription>
          </DialogHeader>
          <AvatarCustomizer
            avatar={userAvatar}
            onAvatarChange={handleAvatarUpdate}
            onClose={() => setShowAvatarCustomizer(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}