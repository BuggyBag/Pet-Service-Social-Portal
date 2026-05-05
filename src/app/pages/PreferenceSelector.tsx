import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapIcon, LayoutGridIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginDialog from '../components/LoginDialog';

export default function PreferenceSelector() {
  const navigate = useNavigate();
  const { isGuest, isProvider } = useAuth();
  const [selectedView, setSelectedView] = useState<'map' | 'scroll' | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleContinue = () => {
    if (!selectedView) return;
    localStorage.setItem('preferredView', selectedView);
    // BUG FIX: scroll view should go to /browse, not /
    navigate(selectedView === 'map' ? '/map' : '/browse');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4f46e5 60%, #7c3aed 80%, #db2777 100%)',
      }}
    >
      {/* Decorative floating blobs */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: '#818cf8', filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: '#f472b6', filter: 'blur(100px)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: '#34d399', filter: 'blur(90px)' }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl"
      >
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4 float-anim inline-block">🐾</div>
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight mb-3"
              style={{ color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.4)', letterSpacing: '-0.03em' }}
            >
              PetConnect
            </h1>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Elige cómo quieres explorar los servicios para tu mascota
            </p>
          </div>

          {/* Mode cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {/* Map View */}
            <ModeCard
              selected={selectedView === 'map'}
              onClick={() => setSelectedView('map')}
              icon={<MapIcon className="w-10 h-10" />}
              iconBg="#4f46e5"
              title="Mapa Interactivo"
              description="Explora un mundo con tu avatar de mascota. Conoce otras mascotas y descubre servicios en un entorno tipo videojuego."
              tags={['🎮 Interactivo', '🐾 Social', '🎨 Creativo']}
              accentColor="#818cf8"
            />

            {/* Scroll View */}
            <ModeCard
              selected={selectedView === 'scroll'}
              onClick={() => setSelectedView('scroll')}
              icon={<LayoutGridIcon className="w-10 h-10" />}
              iconBg="#db2777"
              title="Explorar Servicios"
              description="Experiencia de navegación clásica con búsqueda y filtros potentes. Encuentra y compara servicios rápidamente."
              tags={['⚡ Rápido', '🔍 Preciso', '📋 Detallado']}
              accentColor="#f472b6"
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={selectedView ? { scale: 1.03, y: -2 } : {}}
              whileTap={selectedView ? { scale: 0.97 } : {}}
              onClick={handleContinue}
              disabled={!selectedView}
              className="px-10 py-3 rounded-xl text-base font-bold transition-all"
              style={{
                background: selectedView
                  ? 'linear-gradient(135deg, #fef9c3, #fde68a)'
                  : 'rgba(255,255,255,0.1)',
                color: selectedView ? '#78350f' : 'rgba(255,255,255,0.35)',
                border: selectedView ? '2px solid #f59e0b' : '2px solid rgba(255,255,255,0.1)',
                boxShadow: selectedView ? '3px 3px 0 #b45309, 0 8px 24px rgba(245,158,11,0.3)' : 'none',
                cursor: selectedView ? 'pointer' : 'not-allowed',
                minWidth: 200,
              }}
            >
              {selectedView ? 'Continuar →' : 'Selecciona una opción'}
            </motion.button>

            {/* Auth actions */}
            <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {isGuest ? (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="underline underline-offset-2 hover:text-white transition-colors"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Iniciar sesión
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="underline underline-offset-2 hover:text-white transition-colors"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Crear cuenta
                  </button>
                </>
              ) : isProvider ? (
                <span>👋 Bienvenido, proveedor</span>
              ) : (
                <span>👋 Bienvenido de nuevo</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}

// ── Mode selection card ──
interface ModeCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  tags: string[];
  accentColor: string;
}

function ModeCard({ selected, onClick, icon, iconBg, title, description, tags, accentColor }: ModeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left rounded-xl p-6 transition-all"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${accentColor}25, ${accentColor}12)`
          : 'rgba(255,255,255,0.05)',
        border: selected
          ? `2px solid ${accentColor}`
          : '2px solid rgba(255,255,255,0.12)',
        boxShadow: selected
          ? `0 0 0 4px ${accentColor}25, 0 8px 32px rgba(0,0,0,0.2)`
          : '0 2px 16px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 56, height: 56,
            background: iconBg,
            color: '#fff',
            boxShadow: `3px 3px 0 rgba(0,0,0,0.3)`,
          }}
        >
          {icon}
        </div>

        {/* Text */}
        <div>
          <h3 className="text-lg font-bold mb-1" style={{ color: '#fff' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: selected ? `${accentColor}30` : 'rgba(255,255,255,0.1)',
                color: selected ? accentColor : 'rgba(255,255,255,0.6)',
                border: `1px solid ${selected ? accentColor + '50' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
