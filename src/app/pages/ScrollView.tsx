import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Map, Search, User, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import ProviderCard from '../components/ProviderCard';
import { useAuth } from '../context/AuthContext';
import LoginDialog from '../components/LoginDialog';
import { Card } from '../components/ui/card';
import { getProviders } from '../../lib/api';
import type { Provider } from '../data/mockData';

interface Filters {
  query: string;
  type: string;
  distance: number;
  sortBy: string;
}

export default function ScrollView() {
  const navigate = useNavigate();
  const { isGuest, isProvider, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    type: 'all',
    distance: 10,
    sortBy: 'distance'
  });

  useEffect(() => {
    setLoadingProviders(true);
    getProviders()
      .then(data => setProviders(data))
      .catch(err => console.error('Error cargando providers:', err))
      .finally(() => setLoadingProviders(false));
  }, []);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev: Filters) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ query: '', type: 'all', distance: 10, sortBy: 'distance' });
  };

  const filteredProviders = useMemo(() => {
    let results = [...providers];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((p: Provider) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.services.some((s: string) => s.toLowerCase().includes(query))
      );
    }

    if (filters.type !== 'all') {
      results = results.filter((p: Provider) => p.type === filters.type);
    }

    results = results.filter((p: Provider) => (p.distance || 0) <= filters.distance);

    results.sort((a: Provider, b: Provider) => {
      switch (filters.sortBy) {
        case 'distance': return (a.distance || 0) - (b.distance || 0);
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviewCount - a.reviewCount;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    return results;
  }, [providers, filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                PetConnect
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {!isGuest && isProvider && (
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              )}
              {isGuest ? (
                <Button variant="outline" size="sm" onClick={() => setShowLogin(true)}>
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <div>
                <p className="font-semibold">¡Prueba nuestra vista de mapa interactiva!</p>
                <p className="text-sm opacity-90">Explora servicios cerca de ti de forma visual</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/map')}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Map className="h-4 w-4 mr-1" />
              Explorar Mapa
            </Button>
          </div>
        </Card>

        <div className="mb-6">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {loadingProviders ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No se encontraron servicios</p>
            <p className="text-sm mt-1">Intenta con otros filtros</p>
            <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filteredProviders.length} resultado{filteredProviders.length !== 1 ? 's' : ''} encontrado{filteredProviders.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.map((provider: Provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </>
        )}
      </main>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}