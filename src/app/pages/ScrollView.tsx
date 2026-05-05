import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Map, User, LogOut, LayoutDashboard, Search, X, SlidersHorizontal, Star, MapPin, Phone, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginDialog from '../components/LoginDialog';
import { mockProviders } from '../data/mockData';
import type { Provider } from '../data/mockData';

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos los servicios', emoji: '🐾' },
  { value: 'grooming', label: 'Grooming', emoji: '✂️' },
  { value: 'health', label: 'Salud', emoji: '🏥' },
  { value: 'care', label: 'Cuidado', emoji: '❤️' },
  { value: 'training', label: 'Entrenamiento', emoji: '🎓' },
  { value: 'daycare', label: 'Guardería', emoji: '🏠' },
];

const SORT_OPTIONS = [
  { value: 'distance', label: 'Más cercano' },
  { value: 'rating', label: 'Mejor calificado' },
  { value: 'reviews', label: 'Más reseñas' },
  { value: 'name', label: 'Nombre A-Z' },
];

const TYPE_GRADIENTS: Record<string, string> = {
  grooming: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
  health: 'linear-gradient(135deg, #6ee7b7, #059669)',
  care: 'linear-gradient(135deg, #fca5a5, #dc2626)',
  training: 'linear-gradient(135deg, #93c5fd, #2563eb)',
  daycare: 'linear-gradient(135deg, #fcd34d, #d97706)',
};

function FeedCard({ provider, index }: { provider: Provider; index: number }) {
  const navigate = useNavigate();
  const emoji = TYPE_OPTIONS.find(t => t.value === provider.type)?.emoji ?? '🐾';
  const gradient = TYPE_GRADIENTS[provider.type] ?? 'linear-gradient(135deg, #c4b5fd, #7c3aed)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/provider/${provider.id}`)}
      className="cursor-pointer group"
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '1.5px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(124,58,237,0.13)' }}
    >
      {/* Color band */}
      <div style={{ height: 6, background: gradient }} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="flex-shrink-0 flex items-center justify-center text-3xl"
            style={{
              width: 64, height: 64,
              borderRadius: 14,
              background: gradient,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}
          >
            {emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-black text-base truncate" style={{ color: '#111827', letterSpacing: '-0.01em' }}>
                  {provider.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold" style={{ color: '#374151' }}>{provider.rating}</span>
                  </div>
                  <span style={{ color: '#d1d5db' }}>·</span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>{provider.reviewCount} reseñas</span>
                  {provider.distance && (
                    <>
                      <span style={{ color: '#d1d5db' }}>·</span>
                      <span className="text-xs flex items-center gap-0.5" style={{ color: '#6b7280' }}>
                        <MapPin className="w-3 h-3" />{provider.distance} mi
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Type badge */}
              <span
                className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: gradient, color: '#fff', whiteSpace: 'nowrap' }}
              >
                {emoji} {TYPE_OPTIONS.find(t => t.value === provider.type)?.label}
              </span>
            </div>

            <p className="text-sm mt-2 line-clamp-2" style={{ color: '#6b7280' }}>
              {provider.description}
            </p>
          </div>
        </div>

        {/* Services chips */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {provider.services.slice(0, 4).map((s, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: '#f3f4f6', color: '#374151' }}
            >
              {s}
            </span>
          ))}
          {provider.services.length > 4 && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#f3f4f6', color: '#9ca3af' }}>
              +{provider.services.length - 4} más
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: '#9ca3af' }}>
            {provider.locations[0]?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {provider.locations[0].phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Abierto hoy
            </span>
          </div>
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: '#fff' }}
          >
            Ver perfil →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ScrollView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isGuest, isProvider, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const typeFromUrl = searchParams.get('type') || 'all';

  const [query, setQuery] = useState('');
  const [type, setType] = useState(typeFromUrl);
  const [distance, setDistance] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('distance');

  const isFiltering = query !== '' || type !== 'all' || distance !== null || sortBy !== 'distance';

  useEffect(() => { setType(typeFromUrl); }, [typeFromUrl]);


  const providers: Provider[] = mockProviders;
  const loading = false;

  const filtered = useMemo(() => {
    let r = [...providers];
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q))
      );
    }
    if (type !== 'all') r = r.filter(p => p.type === type);
    if (distance !== null) r = r.filter(p => (p.distance ?? 999) <= distance);
    r.sort((a, b) => {
      switch (sortBy) {
        case 'distance': return (a.distance ?? 0) - (b.distance ?? 0);
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviewCount - a.reviewCount;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
    return r;
  }, [providers, query, type, distance, sortBy]);

  const clearFilters = () => { setQuery(''); setType('all'); setDistance(null); setSortBy('distance'); };
  const dashboardRoute = isProvider ? '/dashboard' : '/account';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f7ff' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #db2777 100%)',
          boxShadow: '0 3px 0 #312e81, 0 4px 16px rgba(79,70,229,0.3)',
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div style={{ width: 36, height: 36, background: '#fef9c3', borderRadius: 8, boxShadow: '2px 2px 0 #854d0e', border: '2px solid #78350f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🐾
            </div>
            <span className="text-base font-black hidden sm:block" style={{ color: '#fff', letterSpacing: '-0.01em', textShadow: '1px 1px 0 rgba(0,0,0,0.25)' }}>
              PetConnect
            </span>
          </div>

          {/* Search bar — center */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar servicios o proveedores..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-sm font-medium outline-none"
              style={{ background: 'rgba(255,255,255,0.95)', border: '2px solid transparent', color: '#111827' }}
              onFocus={e => (e.target.style.border = '2px solid #a78bfa')}
              onBlur={e => (e.target.style.border = '2px solid transparent')}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                <X className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
              </button>
            )}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <HdrBtn onClick={() => setShowFilters(s => !s)} icon={<SlidersHorizontal className="w-3.5 h-3.5" />} label="Filtros" amber={isFiltering} />
            <HdrBtn onClick={() => navigate('/map')} icon={<Map className="w-3.5 h-3.5" />} label="Mapa" amber />
            {!isGuest && <HdrBtn onClick={() => navigate(dashboardRoute)} icon={<LayoutDashboard className="w-3.5 h-3.5" />} label={isProvider ? 'Dashboard' : 'Mi Cuenta'} />}
            {isGuest
              ? <HdrBtn onClick={() => setShowLogin(true)} icon={<User className="w-3.5 h-3.5" />} label="Login" />
              : <HdrBtn onClick={logout} icon={<LogOut className="w-3.5 h-3.5" />} label="Salir" danger />
            }
          </div>
        </div>

        {/* ── Filter bar (expandable) ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.25)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
                {/* Type */}
                <div style={{ minWidth: 180 }}>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-8 text-xs bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.emoji} {o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div style={{ minWidth: 160 }}>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8 text-xs bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Distance */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/70">Distancia:</span>
                  <input
                    type="range" min={1} max={50} value={distance ?? 50}
                    onChange={e => setDistance(Number(e.target.value))}
                    className="w-24 accent-yellow-400"
                  />
                  <span className="text-xs font-bold text-white">{distance ?? 50} mi</span>
                </div>

                {/* Clear */}
                {isFiltering && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ background: 'rgba(254,226,226,0.9)', color: '#991b1b', border: '1px solid #fca5a5', cursor: 'pointer' }}
                  >
                    <X className="w-3 h-3" /> Limpiar
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero (only when NOT filtering) ── */}
      <AnimatePresence>
        {!isFiltering && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)', padding: '36px 0 44px' }}
          >
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: '#818cf8', filter: 'blur(60px)', transform: 'translate(-30%,-30%)' }} />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none" style={{ background: '#f472b6', filter: 'blur(80px)', transform: 'translate(20%,30%)' }} />
            <div className="container mx-auto px-4 relative">
              <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: '#fff', letterSpacing: '-0.03em', textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
                Encuentra el mejor cuidado<br />para tu mascota 🐾
              </h2>
              <p className="text-base mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Grooming, salud, entrenamiento y más — cerca de ti
              </p>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {TYPE_OPTIONS.filter(t => t.value !== 'all').map(t => (
                  <button
                    key={t.value}
                    onClick={() => { setType(t.value); setShowFilters(false); }}
                    className="px-3 py-1.5 rounded-full text-sm font-bold transition-all"
                    style={{
                      background: type === t.value ? '#fef9c3' : 'rgba(255,255,255,0.12)',
                      color: type === t.value ? '#78350f' : '#fff',
                      border: type === t.value ? '2px solid #f59e0b' : '2px solid rgba(255,255,255,0.2)',
                      boxShadow: type === t.value ? '2px 2px 0 #b45309' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>

              {/* Map nudge */}
              <div
                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
              >
                <span className="text-xl">🗺️</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#fff' }}>¿Prefieres explorar en un mapa?</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Vista interactiva con tu avatar de mascota</p>
                </div>
                <button
                  onClick={() => navigate('/map')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold ml-2 flex-shrink-0"
                  style={{ background: '#fef9c3', color: '#78350f', border: '2px solid #f59e0b', boxShadow: '2px 2px 0 #b45309', cursor: 'pointer' }}
                >
                  Explorar →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Feed ── */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        {/* Result count when filtering */}
        {isFiltering && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#6b7280' }}>
              {loading ? 'Buscando...' : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`}
              {query && <span style={{ color: '#7c3aed' }}> para "{query}"</span>}
            </p>
            <button onClick={clearFilters} className="text-xs font-bold flex items-center gap-1" style={{ color: '#7c3aed', cursor: 'pointer', background: 'none', border: 'none' }}>
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ height: 180, background: '#e0e7ff' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#6b7280' }}>
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-semibold">No se encontraron servicios</p>
            <p className="text-sm mt-1">Intenta con otros filtros o términos de búsqueda</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((p, i) => <FeedCard key={p.id} provider={p} index={i} />)}
          </div>
        )}
      </main>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}

function HdrBtn({ onClick, icon, label, amber, danger }: { onClick: () => void; icon: React.ReactNode; label: string; amber?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold"
      style={{
        background: amber ? '#fef9c3' : danger ? 'rgba(254,226,226,0.9)' : 'rgba(255,255,255,0.18)',
        color: amber ? '#78350f' : danger ? '#991b1b' : '#fff',
        border: amber ? '2px solid #f59e0b' : danger ? '2px solid #fca5a5' : '2px solid rgba(255,255,255,0.3)',
        boxShadow: amber ? '2px 2px 0 #b45309' : danger ? '2px 2px 0 #f87171' : 'none',
        cursor: 'pointer',
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
