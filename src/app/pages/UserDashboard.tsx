import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LogOut, Home, Heart, User, Map, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import LoginDialog from '../components/LoginDialog';

export default function UserDashboard() {
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  // Preferred view stored in localStorage — default is 'browse'
  const [preferredView, setPreferredView] = useState<'browse' | 'map'>(
    () => (localStorage.getItem('preferredView') as 'browse' | 'map') || 'browse'
  );

  const handlePreferenceChange = (view: 'browse' | 'map') => {
    setPreferredView(view);
    localStorage.setItem('preferredView', view);
    toast.success(view === 'map' ? 'Vista de mapa establecida como predeterminada' : 'Vista de exploración establecida como predeterminada');
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  if (isGuest) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)' }}
      >
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: '#818cf8', filter: 'blur(60px)', transform: 'translate(-30%,-30%)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
          style={{ background: '#f472b6', filter: 'blur(80px)', transform: 'translate(20%,30%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm"
        >
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
            }}
          >
            <div className="text-5xl mb-4">🐾</div>
            <h1 className="text-2xl font-black mb-2" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
              Inicia sesión
            </h1>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Necesitas una cuenta para acceder a tu perfil.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: '#fef9c3', color: '#78350f', border: '2px solid #f59e0b', boxShadow: '2px 2px 0 #b45309', cursor: 'pointer' }}
              >
                <User className="w-4 h-4" /> Iniciar sesión
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}
              >
                <Home className="w-4 h-4" /> Volver al inicio
              </button>
            </div>
          </div>
        </motion.div>
        <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f7ff' }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #db2777 100%)',
          boxShadow: '0 3px 0 #312e81, 0 4px 16px rgba(79,70,229,0.3)',
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
              <div
                className="flex items-center justify-center text-xl"
                style={{ width: 38, height: 38, background: '#fef9c3', borderRadius: 8, boxShadow: '2px 2px 0 #854d0e', border: '2px solid #78350f' }}
              >
                🐾
              </div>
            </button>
            <div>
              <h1 className="text-base font-black" style={{ color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {user.username || 'Mi Cuenta'}
              </h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(254,226,226,0.9)', color: '#991b1b', border: '2px solid #fca5a5', boxShadow: '2px 2px 0 #f87171', cursor: 'pointer' }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Mi Cuenta
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Heart className="w-4 h-4" /> Mis Reservas
            </TabsTrigger>
          </TabsList>

          {/* ── Account Tab ── */}
          <TabsContent value="account" className="space-y-6">
            {/* Profile info */}
            <Card className="overflow-hidden">
              <div
                className="p-6 flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
                  style={{ background: '#fef9c3', border: '3px solid #f59e0b', boxShadow: '2px 2px 0 #b45309', color: '#78350f' }}
                >
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-black" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
                    {user.username || 'Usuario'}
                  </h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{user.email}</p>
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#c4b5fd', border: '1px solid rgba(196,181,253,0.3)' }}
                  >
                    Usuario regular
                  </span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>Nombre</p>
                  <p className="font-semibold" style={{ color: '#1c1917' }}>{user.username || 'No definido'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>Email</p>
                  <p className="font-semibold break-all" style={{ color: '#1c1917' }}>{user.email || 'No definido'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>Teléfono</p>
                  <p className="font-semibold" style={{ color: '#1c1917' }}>{user.phone || 'No definido'}</p>
                </div>
              </div>
            </Card>

            {/* ── Experience preference ── */}
            <Card className="p-6">
              <h3 className="font-black text-lg mb-1" style={{ color: '#1c1917', letterSpacing: '-0.01em' }}>
                Experiencia predeterminada
              </h3>
              <p className="text-sm mb-5" style={{ color: '#6b7280' }}>
                Elige qué vista se abre cuando entras a PetConnect
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Browse option */}
                <button
                  onClick={() => handlePreferenceChange('browse')}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: preferredView === 'browse' ? 'linear-gradient(135deg, #ede9fe, #faf5ff)' : '#f9fafb',
                    border: preferredView === 'browse' ? '2px solid #7c3aed' : '2px solid #e5e7eb',
                    boxShadow: preferredView === 'browse' ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: preferredView === 'browse' ? '#7c3aed' : '#e5e7eb' }}
                  >
                    <LayoutGrid className="w-5 h-5" style={{ color: preferredView === 'browse' ? '#fff' : '#6b7280' }} />
                  </div>
                  <p className="font-bold text-sm" style={{ color: preferredView === 'browse' ? '#4c1d95' : '#374151' }}>
                    Explorar servicios
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                    Búsqueda rápida con filtros
                  </p>
                  {preferredView === 'browse' && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold"
                      style={{ background: '#7c3aed', color: '#fff' }}>
                      Activo
                    </span>
                  )}
                </button>

                {/* Map option */}
                <button
                  onClick={() => handlePreferenceChange('map')}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: preferredView === 'map' ? 'linear-gradient(135deg, #fef3c7, #fffbeb)' : '#f9fafb',
                    border: preferredView === 'map' ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                    boxShadow: preferredView === 'map' ? '0 0 0 3px rgba(245,158,11,0.15), 2px 2px 0 #b45309' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: preferredView === 'map' ? '#f59e0b' : '#e5e7eb', boxShadow: preferredView === 'map' ? '2px 2px 0 #b45309' : 'none' }}
                  >
                    <Map className="w-5 h-5" style={{ color: preferredView === 'map' ? '#fff' : '#6b7280' }} />
                  </div>
                  <p className="font-bold text-sm" style={{ color: preferredView === 'map' ? '#78350f' : '#374151' }}>
                    Mapa interactivo
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                    Explora con tu avatar 🎮
                  </p>
                  {preferredView === 'map' && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold"
                      style={{ background: '#f59e0b', color: '#78350f', border: '1px solid #b45309' }}>
                      Activo
                    </span>
                  )}
                </button>
              </div>
            </Card>

            {/* Quick nav */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
                <Home className="w-4 h-4" /> Ver servicios
              </Button>
              <Button variant="outline" onClick={() => navigate('/map')} className="flex items-center gap-2">
                <Map className="w-4 h-4" /> Ir al mapa
              </Button>
            </div>
          </TabsContent>

          {/* ── Bookings Tab ── */}
          <TabsContent value="bookings">
            <Card className="p-12 text-center" style={{ color: '#6b7280' }}>
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold">No tienes reservas aún</p>
              <p className="text-sm mt-1 mb-6">Explora los servicios disponibles y agenda tu primera cita</p>
              <Button
                onClick={() => navigate('/')}
                style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: '#fff', border: 'none' }}
              >
                Explorar servicios
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
