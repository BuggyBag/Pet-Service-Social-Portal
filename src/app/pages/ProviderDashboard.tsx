import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Calendar, Edit, Plus, User, Mail, Phone,
  Clock, MapPin, Users, Settings, Eye, LogOut,
  TrendingUp, Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockProviders } from '../data/mockData';
import ProfileEditor from '../components/ProfileEditor';
import AddBookingDialog from '../components/AddBookingDialog';

const mockBookings = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '(555) 111-2222',
    service: 'Full Grooming',
    date: '2026-06-15',
    time: '10:00',
    petName: 'Max',
    petType: 'dog',
    status: 'confirmed',
    notes: 'First time customer',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '(555) 333-4444',
    service: 'Bath & Brush',
    date: '2026-06-15',
    time: '14:00',
    petName: 'Bella',
    petType: 'cat',
    status: 'pending',
    notes: '',
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    customerPhone: '(555) 555-6666',
    service: 'Nail Trimming',
    date: '2026-06-16',
    time: '11:30',
    petName: 'Charlie',
    petType: 'dog',
    status: 'confirmed',
    notes: 'Nervous around clippers',
  },
];

const STAT_COLORS = [
  { bg: '#ede9fe', icon: '#7c3aed', iconBg: '#ddd6fe' },
  { bg: '#d1fae5', icon: '#059669', iconBg: '#a7f3d0' },
  { bg: '#fef3c7', icon: '#d97706', iconBg: '#fde68a' },
  { bg: '#fce7f3', icon: '#db2777', iconBg: '#fbcfe8' },
];

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, isProvider, logout } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [bookings] = useState(mockBookings);

  const provider = mockProviders.find(p => p.id === user.providerId) || mockProviders[0];

  if (!isProvider) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)' }}
      >
        <Card className="p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-black mb-2" style={{ color: '#111827' }}>Acceso denegado</h2>
          <p className="text-sm mb-5" style={{ color: '#6b7280' }}>Esta página es solo para proveedores de servicios.</p>
          <Button
            onClick={() => navigate('/')}
            style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', border: 'none', width: '100%' }}
          >
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date());
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const stats = [
    { label: 'Total reservas', value: bookings.length, icon: <Calendar className="w-5 h-5" /> },
    { label: 'Confirmadas', value: confirmedCount, icon: <Calendar className="w-5 h-5" /> },
    { label: 'Pendientes', value: pendingCount, icon: <Clock className="w-5 h-5" /> },
    { label: 'Calificación', value: provider.rating, icon: <Star className="w-5 h-5" /> },
  ];

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
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, background: '#fef9c3', borderRadius: 8, boxShadow: '2px 2px 0 #854d0e', border: '2px solid #78350f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                🐾
              </div>
            </button>
            <div>
              <p className="text-base font-black" style={{ color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {provider.name}
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Panel de proveedor</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <HdrBtn
              onClick={() => navigate(`/provider/${provider.id}`)}
              icon={<Eye className="w-3.5 h-3.5" />}
              label="Ver perfil"
            />
            <HdrBtn
              onClick={logout}
              icon={<LogOut className="w-3.5 h-3.5" />}
              label="Salir"
              danger
            />
          </div>
        </div>
      </header>

      {/* ── Hero banner ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)', padding: '32px 0 40px' }}
      >
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: '#818cf8', filter: 'blur(60px)', transform: 'translate(-30%,-30%)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
          style={{ background: '#f472b6', filter: 'blur(80px)', transform: 'translate(20%,30%)' }} />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Bienvenido de nuevo
            </p>
            <h1 className="text-3xl font-black mb-1" style={{ color: '#fff', letterSpacing: '-0.03em' }}>
              {user.username} 👋
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Gestiona tu negocio, reservas y perfil público
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card
                className="p-5"
                style={{ background: STAT_COLORS[i].bg, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: STAT_COLORS[i].icon, opacity: 0.75 }}>
                      {s.label}
                    </p>
                    <p className="text-3xl font-black" style={{ color: STAT_COLORS[i].icon, letterSpacing: '-0.02em' }}>
                      {s.value}
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{ width: 44, height: 44, background: STAT_COLORS[i].iconBg, color: STAT_COLORS[i].icon }}
                  >
                    {s.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Reservas
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> Perfil
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Analíticas
            </TabsTrigger>
          </TabsList>

          {/* ── Bookings ── */}
          <TabsContent value="bookings">
            <Card className="overflow-hidden" style={{ border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <h3 className="text-lg font-black" style={{ color: '#111827', letterSpacing: '-0.01em' }}>
                    Próximas citas
                  </h3>
                  <p className="text-sm" style={{ color: '#6b7280' }}>{upcomingBookings.length} citas próximas</p>
                </div>
                <button
                  onClick={() => setShowAddBooking(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}
                >
                  <Plus className="w-4 h-4" /> Nueva reserva
                </button>
              </div>

              <div className="p-6 space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-16" style={{ color: '#9ca3af' }}>
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">Sin citas próximas</p>
                  </div>
                ) : upcomingBookings.map(b => (
                  <div
                    key={b.id}
                    className="rounded-xl p-4"
                    style={{ background: '#f9fafb', border: '1.5px solid #f3f4f6' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              background: b.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                              color: b.status === 'confirmed' ? '#065f46' : '#92400e',
                              border: `1px solid ${b.status === 'confirmed' ? '#6ee7b7' : '#fcd34d'}`,
                            }}
                          >
                            {b.status === 'confirmed' ? '✓ Confirmada' : '⏳ Pendiente'}
                          </span>
                          <span className="text-xs" style={{ color: '#6b7280' }}>
                            {new Date(b.date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} · {b.time}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <p className="font-bold text-sm mb-1" style={{ color: '#111827' }}>{b.service}</p>
                            <p className="text-xs flex items-center gap-1" style={{ color: '#6b7280' }}>
                              <User className="w-3 h-3" /> {b.petName} ({b.petType})
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold" style={{ color: '#374151' }}>{b.customerName}</p>
                            <p className="text-xs flex items-center gap-1" style={{ color: '#6b7280' }}>
                              <Mail className="w-3 h-3" /> {b.customerEmail}
                            </p>
                            <p className="text-xs flex items-center gap-1" style={{ color: '#6b7280' }}>
                              <Phone className="w-3 h-3" /> {b.customerPhone}
                            </p>
                          </div>
                        </div>
                        {b.notes && (
                          <p className="text-xs mt-2 px-3 py-1.5 rounded-lg" style={{ background: '#ede9fe', color: '#5b21b6' }}>
                            📝 {b.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: '#ede9fe', color: '#5b21b6', border: '1px solid #c4b5fd', cursor: 'pointer' }}>
                          Editar
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', cursor: 'pointer' }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ── Profile Settings ── */}
          <TabsContent value="profile">
            <Card className="overflow-hidden" style={{ border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <h3 className="text-lg font-black" style={{ color: '#111827', letterSpacing: '-0.01em' }}>
                    Personalización del perfil
                  </h3>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Controla qué aparece en tu perfil público</p>
                </div>
                <button
                  onClick={() => setShowEditor(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}
                >
                  <Edit className="w-4 h-4" /> Editar perfil
                </button>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <MapPin className="w-5 h-5" />, label: 'Ubicación y mapa', detail: `${provider.locations.length} ubicación(es)`, color: '#7c3aed' },
                  { icon: <Users className="w-5 h-5" />, label: 'Equipo', detail: `${provider.staff.length} miembros`, color: '#059669' },
                  { icon: <Clock className="w-5 h-5" />, label: 'Horarios', detail: `${Object.keys(provider.availability).length} días`, color: '#d97706' },
                  { icon: <Settings className="w-5 h-5" />, label: 'Servicios', detail: `${provider.services.length} servicios`, color: '#db2777' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: '#f9fafb', border: '1.5px solid #f3f4f6' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#111827' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: '#6b7280' }}>{item.detail}</p>
                    </div>
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#d1fae5', color: '#065f46' }}>
                      Activo
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ── Analytics ── */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6" style={{ border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 className="text-base font-black mb-4" style={{ color: '#111827', letterSpacing: '-0.01em' }}>
                  Este mes
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Reservas totales', value: 24 },
                    { label: 'Visitas al perfil', value: 156 },
                    { label: 'Nuevas reseñas', value: 8 },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#f9fafb' }}>
                      <span className="text-sm font-semibold" style={{ color: '#374151' }}>{r.label}</span>
                      <span className="text-lg font-black" style={{ color: '#7c3aed' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6" style={{ border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 className="text-base font-black mb-4" style={{ color: '#111827', letterSpacing: '-0.01em' }}>
                  Servicios populares
                </h3>
                <div className="space-y-4">
                  {provider.services.slice(0, 3).map((service, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold" style={{ color: '#374151' }}>{service}</span>
                        <span className="text-xs font-bold" style={{ color: '#7c3aed' }}>{12 - i * 3} reservas</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: '#e5e7eb' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${100 - i * 25}%`,
                            background: 'linear-gradient(135deg,#7c3aed,#db2777)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showEditor && (
        <ProfileEditor provider={provider} open={showEditor} onClose={() => setShowEditor(false)} />
      )}
      <AddBookingDialog open={showAddBooking} onOpenChange={setShowAddBooking} provider={provider} />
    </div>
  );
}

function HdrBtn({ onClick, icon, label, danger }: { onClick: () => void; icon: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold"
      style={{
        background: danger ? 'rgba(254,226,226,0.9)' : 'rgba(255,255,255,0.18)',
        color: danger ? '#991b1b' : '#fff',
        border: danger ? '2px solid #fca5a5' : '2px solid rgba(255,255,255,0.3)',
        boxShadow: danger ? '2px 2px 0 #f87171' : 'none',
        cursor: 'pointer',
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
