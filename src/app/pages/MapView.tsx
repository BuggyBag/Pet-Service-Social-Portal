import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  LayoutGrid,
  MessageCircle,
  MapPin,
  User,
  LogOut,
  LayoutDashboard,
  Wifi,
  WifiOff,
} from 'lucide-react';
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

// Decorative map elements positioned around the world
const MAP_TREES = [
  { id: 't1', x: 60, y: 60, emoji: '🌲', size: 52 },
  { id: 't2', x: 140, y: 40, emoji: '🌳', size: 44 },
  { id: 't3', x: 820, y: 55, emoji: '🌲', size: 56 },
  { id: 't4', x: 900, y: 80, emoji: '🌳', size: 40 },
  { id: 't5', x: 80, y: 440, emoji: '🌸', size: 44 },
  { id: 't6', x: 170, y: 480, emoji: '🌼', size: 36 },
  { id: 't7', x: 860, y: 430, emoji: '🌸', size: 48 },
  { id: 't8', x: 780, y: 460, emoji: '🌺', size: 40 },
  { id: 't9', x: 430, y: 80, emoji: '🌿', size: 36 },
  { id: 't10', x: 560, y: 460, emoji: '🍀', size: 32 },
];

const MAP_DECO = [
  { id: 'd1', x: 300, y: 70, emoji: '🦋', size: 24 },
  { id: 'd2', x: 700, y: 90, emoji: '☀️', size: 32 },
  { id: 'd3', x: 460, y: 50, emoji: '⛅', size: 36 },
  { id: 'd4', x: 120, y: 310, emoji: '🪨', size: 28 },
  { id: 'd5', x: 880, y: 300, emoji: '🪨', size: 24 },
  { id: 'd6', x: 380, y: 480, emoji: '🌊', size: 28 },
];

// Isometric-style path tiles (SVG path for the walkable road)
function MapPath() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="pathPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#fde68a" />
          <rect x="0" y="0" width="12" height="12" fill="rgba(251,191,36,0.3)" />
          <rect x="12" y="12" width="12" height="12" fill="rgba(251,191,36,0.3)" />
        </pattern>
      </defs>
      {/* Central cross path */}
      <ellipse cx="50%" cy="50%" rx="38%" ry="28%" fill="none" stroke="url(#pathPattern)" strokeWidth="48" />
      {/* Extra connecting lines to stands */}
      <line x1="20%" y1="22%" x2="50%" y2="50%" stroke="#fde68a" strokeWidth="32" strokeLinecap="round" opacity="0.5" />
      <line x1="80%" y1="22%" x2="50%" y2="50%" stroke="#fde68a" strokeWidth="32" strokeLinecap="round" opacity="0.5" />
      <line x1="35%" y1="75%" x2="50%" y2="50%" stroke="#fde68a" strokeWidth="32" strokeLinecap="round" opacity="0.5" />
      <line x1="68%" y1="75%" x2="50%" y2="50%" stroke="#fde68a" strokeWidth="32" strokeLinecap="round" opacity="0.5" />

      {/* Path border lines */}
      <ellipse cx="50%" cy="50%" rx="38%" ry="28%" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8 6" opacity="0.7" />
    </svg>
  );
}

// Grass tile background
function MapGround() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, #bbf7d0 0%, #86efac 40%, #4ade80 100%)',
        zIndex: 0,
      }}
    >
      {/* Grid overlay for pixel-art feel */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}

export default function MapView() {
  const navigate = useNavigate();
  const { user, isGuest, isProvider, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [userAvatar, setUserAvatar] = useState<PetAvatarType>({
    id: 'user',
    name: user.username || 'MyPet',
    type: 'dog',
    color: '#FFD700',
    accessories: [],
    position: { x: 430, y: 280 },
    message: '',
    badges: ['Newbie'],
  });

  const [nearbyAvatars, setNearbyAvatars] = useState<PetAvatarType[]>([]);

  // Keep userAvatar name in sync with auth user
  useEffect(() => {
    if (user.username) {
      setUserAvatar(prev => ({ ...prev, name: user.username! }));
    }
  }, [user.username]);

  useEffect(() => {
    let isActive = true;

    const generateAvatars = () => {
      const types: ('dog' | 'cat' | 'bird' | 'rabbit' | 'hamster')[] = ['dog', 'cat', 'bird', 'rabbit', 'hamster'];
      const names = ['Buddy', 'Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Cooper', 'Daisy'];
      const colors = ['#c4b5fd', '#93c5fd', '#6ee7b7', '#fca5a5', '#fcd34d'];
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
            x: Math.random() * 700 + 100,
            y: Math.random() * 320 + 80,
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
    setUserAvatar(prev => ({ ...prev, position: { x, y } }));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 32;
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
    setTimeout(() => {
      setUserAvatar(prev => ({ ...prev, message: '' }));
    }, 5000);
  };

  const handleAvatarUpdate = (updates: Partial<PetAvatarType>) => {
    setUserAvatar(prev => ({ ...prev, ...updates }));
  };

  // Dashboard route depends on account type
  const dashboardRoute = isProvider ? '/dashboard' : isGuest ? null : '/account';

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', ui-rounded, sans-serif" }}>
      {/* ── Header ── */}
      <header
        className="border-b sticky top-0 z-30"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #db2777 100%)',
          boxShadow: '0 3px 0 #312e81, 0 4px 12px rgba(79,70,229,0.35)',
        }}
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center text-2xl"
              style={{
                width: 40, height: 40,
                background: '#fef9c3',
                borderRadius: 8,
                boxShadow: '2px 2px 0 #854d0e',
                border: '2px solid #78350f',
              }}
            >
              🐾
            </div>
            <h1
              className="text-xl tracking-tight"
              style={{
                color: '#fff',
                fontWeight: 800,
                textShadow: '2px 2px 0 rgba(0,0,0,0.25)',
                letterSpacing: '-0.01em',
              }}
            >
              PetConnect
            </h1>
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold"
              style={{
                background: locationEnabled ? '#d1fae5' : '#fee2e2',
                color: locationEnabled ? '#065f46' : '#991b1b',
                border: `1px solid ${locationEnabled ? '#6ee7b7' : '#fca5a5'}`,
              }}
            >
              {locationEnabled ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {locationEnabled ? 'GPS On' : 'GPS Off'}
            </div>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-2">
            <NavBtn onClick={() => setShowMessageMenu(true)} icon={<MessageCircle className="w-4 h-4" />} label="Chat" />
            <NavBtn onClick={() => navigate('/browse')} icon={<LayoutGrid className="w-4 h-4" />} label="Browse" />

            {/* Account-type aware navigation */}
            {!isGuest && dashboardRoute && (
              <NavBtn
                onClick={() => navigate(dashboardRoute)}
                icon={<LayoutDashboard className="w-4 h-4" />}
                label={isProvider ? 'Dashboard' : 'My Account'}
                highlight
              />
            )}

            {!isGuest ? (
              <NavBtn onClick={logout} icon={<LogOut className="w-4 h-4" />} label="Logout" danger />
            ) : (
              <NavBtn
                onClick={() => setShowLogin(true)}
                icon={<User className="w-4 h-4" />}
                label="Sign In"
                highlight
              />
            )}
          </div>
        </div>
      </header>

      {/* ── Map Area ── */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 500 }}>
        <motion.div
          className="absolute inset-0 cursor-crosshair"
          onClick={handleMapClick}
          style={{ zIndex: 1 }}
        >
          {/* Ground */}
          <MapGround />

          {/* Paths */}
          <MapPath />

          {/* Trees & decorations */}
          {MAP_TREES.map(t => (
            <div
              key={t.id}
              className="absolute pointer-events-none float-anim"
              style={{
                left: t.x,
                top: t.y,
                fontSize: t.size,
                lineHeight: 1,
                zIndex: 2,
                animationDelay: `${parseInt(t.id.replace('t','')) * 0.4}s`,
                filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.15))',
              }}
            >
              {t.emoji}
            </div>
          ))}
          {MAP_DECO.map(d => (
            <div
              key={d.id}
              className="absolute pointer-events-none wiggle-anim"
              style={{
                left: d.x,
                top: d.y,
                fontSize: d.size,
                lineHeight: 1,
                zIndex: 2,
                animationDelay: `${parseInt(d.id.replace('d','')) * 0.6}s`,
                opacity: 0.85,
              }}
            >
              {d.emoji}
            </div>
          ))}

          {/* Service stands */}
          {serviceStands.map(stand => (
            <div key={stand.id} style={{ zIndex: 5, position: 'absolute', left: 0, top: 0 }}>
              <ServiceStand
                name={stand.name}
                icon={stand.icon}
                position={stand.position}
                onClick={() => handleStandClick(stand.id)}
              />
            </div>
          ))}

          {/* Nearby avatars */}
          {nearbyAvatars.map(avatar => (
            <div key={avatar.id} style={{ zIndex: 6, position: 'absolute', left: 0, top: 0 }}>
              <PetAvatar avatar={avatar} />
            </div>
          ))}

          {/* User avatar */}
          <div style={{ zIndex: 10, position: 'absolute', left: 0, top: 0 }}>
            <PetAvatar avatar={userAvatar} isUser />
          </div>

          {/* HUD: Instructions */}
          <div
            className="absolute top-3 left-3 px-3 py-2 rounded-lg text-xs font-bold"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '2px solid #7c3aed',
              boxShadow: '2px 2px 0 #4c1d95',
              color: '#3730a3',
              maxWidth: 220,
              zIndex: 20,
              backdropFilter: 'blur(8px)',
            }}
          >
            👆 Toca el mapa para mover tu mascota · Visita los stands para buscar servicios
          </div>

          {/* HUD: Online count */}
          <div
            className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '2px solid #22c55e',
              boxShadow: '2px 2px 0 #15803d',
              color: '#15803d',
              zIndex: 20,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full bg-green-500"
              style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
            />
            {nearbyAvatars.length + 1} mascotas en línea
          </div>

          {/* HUD: Location badge */}
          {!locationEnabled && (
            <div
              className="absolute bottom-20 left-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer"
              style={{
                background: 'rgba(254,243,199,0.95)',
                border: '2px solid #f59e0b',
                boxShadow: '2px 2px 0 #b45309',
                color: '#92400e',
                zIndex: 20,
              }}
              onClick={() => setShowLocationPrompt(true)}
            >
              <MapPin className="w-3 h-3" />
              Activar GPS
            </div>
          )}

          {/* Account type badge (bottom bar) */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '2px solid #7c3aed',
              boxShadow: '2px 2px 0 #4c1d95',
              color: '#4c1d95',
              zIndex: 20,
              backdropFilter: 'blur(8px)',
            }}
          >
            {isGuest && <><span>🎮</span> Modo Invitado · <span className="underline cursor-pointer text-violet-700" onClick={() => setShowLogin(true)}>Inicia sesión</span> para más funciones</>}
            {!isGuest && isProvider && <><span>🏪</span> Cuenta Proveedor · {user.username}</>}
            {!isGuest && !isProvider && <><span>🐾</span> {user.username || user.email}</>}
          </div>

          {/* Avatar Customization Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => { e.stopPropagation(); setShowAvatarCustomizer(true); }}
            className="absolute bottom-3 right-3 flex items-center justify-center"
            style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              borderRadius: '50%',
              border: '3px solid #fff',
              boxShadow: '3px 3px 0 #4c1d95, 0 4px 16px rgba(124,58,237,0.4)',
              color: '#fff',
              zIndex: 20,
              cursor: 'pointer',
            }}
          >
            <User className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>

      {/* ── Location Permission Dialog ── */}
      <Dialog open={showLocationPrompt} onOpenChange={setShowLocationPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Activar Servicios de Ubicación?</DialogTitle>
            <DialogDescription>
              Activar la ubicación mostrará mascotas cercanas y priorizará proveedores locales en tus búsquedas.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => handleLocationDecision(false)} className="flex-1">
              No, gracias
            </Button>
            <Button
              onClick={() => handleLocationDecision(true)}
              className="flex-1"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
            >
              Activar Ubicación
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Message Menu Dialog ── */}
      <Dialog open={showMessageMenu} onOpenChange={setShowMessageMenu}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>💬 Enviar Mensaje</DialogTitle>
            <DialogDescription>Elige un mensaje para mostrar sobre tu avatar</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {predefinedMessages.map((message, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => sendMessage(message)}
                className="justify-start text-sm"
                style={{ borderColor: '#c4b5fd', color: '#4c1d95' }}
              >
                {message}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Avatar Customizer Dialog ── */}
      <Dialog open={showAvatarCustomizer} onOpenChange={setShowAvatarCustomizer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎨 Personaliza tu Avatar</DialogTitle>
            <DialogDescription>Elige el tipo, color y accesorios de tu mascota</DialogDescription>
          </DialogHeader>
          <AvatarCustomizer
            avatar={userAvatar}
            onAvatarChange={handleAvatarUpdate}
            onClose={() => setShowAvatarCustomizer(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Login Dialog ── */}
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}

// ── Small reusable header button ──
function NavBtn({
  onClick,
  icon,
  label,
  highlight,
  danger,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
      style={{
        background: highlight
          ? '#fef9c3'
          : danger
          ? 'rgba(254,226,226,0.9)'
          : 'rgba(255,255,255,0.18)',
        color: highlight ? '#78350f' : danger ? '#991b1b' : '#fff',
        border: highlight
          ? '2px solid #f59e0b'
          : danger
          ? '2px solid #fca5a5'
          : '2px solid rgba(255,255,255,0.3)',
        boxShadow: highlight
          ? '2px 2px 0 #b45309'
          : danger
          ? '2px 2px 0 #f87171'
          : 'none',
        cursor: 'pointer',
        backdropFilter: 'blur(4px)',
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
