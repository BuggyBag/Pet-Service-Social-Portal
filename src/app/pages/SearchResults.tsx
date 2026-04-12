import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import ProviderCard from '../components/ProviderCard';
import { mockProviders } from '../data/mockData';

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type') || 'all';

  const [filters, setFilters] = useState({
    query: '',
    type: typeFromUrl,
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

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.services.some(s => s.toLowerCase().includes(query))
      );
    }

    if (filters.type !== 'all') {
      results = results.filter(p => p.type === filters.type);
    }

    results = results.filter(p => (p.distance || 0) <= filters.distance);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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
              <h2 className="text-2xl mb-2">Search Results</h2>
              <p className="text-gray-600">
                Found {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
                {filters.type !== 'all' && ` for ${filters.type} services`}
              </p>
            </div>

            {filteredProviders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
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
    </div>
  );
}
