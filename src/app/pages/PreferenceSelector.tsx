import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { MapIcon, LayoutGridIcon } from 'lucide-react';

export default function PreferenceSelector() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'map' | 'scroll' | null>(null);

  const handleContinue = () => {
    if (selectedView) {
      localStorage.setItem('preferredView', selectedView);
      navigate(selectedView === 'map' ? '/map' : '/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to PetConnect
          </h1>
          <p className="text-lg text-gray-600">
            Choose your preferred experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Map View Option */}
          <button
            onClick={() => setSelectedView('map')}
            className={`p-6 border-2 rounded-xl transition-all hover:scale-105 ${
              selectedView === 'map'
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-full ${
                selectedView === 'map' ? 'bg-purple-500' : 'bg-gray-200'
              }`}>
                <MapIcon className={`w-12 h-12 ${
                  selectedView === 'map' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="text-xl mb-2">Interactive Map</h3>
                <p className="text-sm text-gray-600">
                  Explore a playful world with your pet avatar. Meet other pets, interact with the community, and discover services in a fun, game-like environment.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  🎮 Interactive
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  🐾 Social
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  🎨 Creative
                </span>
              </div>
            </div>
          </button>

          {/* Scroll View Option */}
          <button
            onClick={() => setSelectedView('scroll')}
            className={`p-6 border-2 rounded-xl transition-all hover:scale-105 ${
              selectedView === 'scroll'
                ? 'border-pink-500 bg-pink-50 shadow-lg'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-full ${
                selectedView === 'scroll' ? 'bg-pink-500' : 'bg-gray-200'
              }`}>
                <LayoutGridIcon className={`w-12 h-12 ${
                  selectedView === 'scroll' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="text-xl mb-2">Classic Browse</h3>
                <p className="text-sm text-gray-600">
                  Traditional browsing experience with powerful search and filters. Quickly find and compare pet services with all the information you need.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                  ⚡ Fast
                </span>
                <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                  🔍 Efficient
                </span>
                <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                  📋 Detailed
                </span>
              </div>
            </div>
          </button>
        </div>

        <div className="text-center space-y-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedView}
            className="px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continue
          </Button>
          <p className="text-sm text-gray-500">
            You can change your preference anytime in settings
          </p>
        </div>
      </Card>
    </div>
  );
}
