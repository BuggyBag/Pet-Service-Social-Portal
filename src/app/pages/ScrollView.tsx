import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Map, Search, User, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import ProviderCard from '../components/ProviderCard';
import { mockProviders } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import LoginDialog from '../components/LoginDialog';
import { Card } from '../components/ui/card';

export default function ScrollView() {
  const navigate = useNavigate();
  const { user, isGuest, isProvider, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    type: 'all',
    distance: 10,
    sortBy: 'distance'
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      distance: 10,
      sortBy: 'distance'
    });
  };

  const filteredProviders = useMemo(() => {
    let results = [...mockProviders];

    // Filter by query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.services.some(s => s.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (filters.type !== 'all') {
      results = results.filter(p => p.type === filters.type);
    }

    // Filter by distance
    results = results.filter(p => (p.distance || 0) <= filters.distance);

    // Sort
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return results;
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PetConnect
            </h1>
            <div className="flex items-center gap-2">
              {isGuest ? (
                <Button
                  variant="outline"
                  onClick={() => setShowLogin(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              ) : (
                <>
                  {isProvider && (
                    <Button
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  )}
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Quick search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for pet services..."
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Interactive Map Promotion Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Try our Interactive Map Experience!</h3>
                  <p className="text-sm text-white/90">
                    Create your pet avatar and explore services in a fun, Club Penguin-style world
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/map')}
                className="bg-white text-purple-600 hover:bg-white/90"
              >
                <Map className="w-4 h-4 mr-2" />
                Explore Map View
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:sticky lg:top-4 h-fit">
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Results */}
          <main>
            <div className="mb-6">
              <h2 className="text-2xl mb-2">
                {filters.type === 'all' ? 'All Services' : `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)} Services`}
              </h2>
              <p className="text-gray-600">
                Found {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} near you
              </p>
            </div>

            {filteredProviders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl mb-2">No providers found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredProviders.map(provider => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}