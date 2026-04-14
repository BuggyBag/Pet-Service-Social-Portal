import { supabase } from './supabase'
import type { Provider } from '../app/data/mockData'

// ────────────────────────────────────────────
// Helpers para mapear DB → tipo Provider local
// ────────────────────────────────────────────
function mapProviderRow(row: any): Provider {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    description: row.description ?? '',
    services: row.services ?? [],
    staff: row.staff ?? [],
    locations: row.locations ?? [],
    email: row.email ?? '',
    socialMedia: row.social_media ?? {},
    availability: row.availability ?? {},
    images: row.images ?? [],
    badges: row.badges ?? [],
    profileWidgets: row.profile_widgets ?? {
      location: true, team: true, hours: true,
      services: true, images: true, social: true,
    },
  }
}

// ────────────────────────────────────────────
// PROVIDERS
// ────────────────────────────────────────────

/** Obtiene todos los providers (con filtros opcionales) */
export async function getProviders(filters?: {
  type?: string
  search?: string
}): Promise<Provider[]> {
  let query = supabase.from('providers').select('*')

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  const { data, error } = await query.order('rating', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapProviderRow)
}

/** Obtiene un provider por ID */
export async function getProviderById(id: string): Promise<Provider | null> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapProviderRow(data)
}

/** Buscar proveedores cercanos usando PostGIS (si está habilitado) */
export async function getProvidersNearby(
  lat: number,
  lng: number,
  radiusKm: number = 5,
  category?: string
): Promise<Provider[]> {
  // Fallback: si no hay PostGIS, traer todos y calcular distancia client-side
  const providers = await getProviders({ type: category })

  return providers.map(p => {
    const loc = p.locations[0]
    if (!loc) return { ...p, distance: 999 }
    const dist = Math.sqrt(
      Math.pow((loc.lat - lat) * 111, 2) +
      Math.pow((loc.lng - lng) * 111 * Math.cos(lat * Math.PI / 180), 2)
    )
    return { ...p, distance: Math.round(dist * 10) / 10 }
  }).sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999))
}

/** Actualiza los widgets del perfil de un provider */
export async function updateProviderWidgets(
  providerId: string,
  widgets: Record<string, boolean>
): Promise<void> {
  const { error } = await supabase
    .from('providers')
    .update({ profile_widgets: widgets, updated_at: new Date().toISOString() })
    .eq('id', providerId)

  if (error) throw error
}

// ────────────────────────────────────────────
// BOOKINGS
// ────────────────────────────────────────────

/** Crear una reserva */
export async function createBooking(booking: {
  provider_id: string
  service: string
  date: string
  time: string
  pet_name: string
  pet_type: string
  notes?: string
}) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...booking, user_id: user?.id })
    .select()
    .single()

  if (error) throw error
  return data
}

/** Reservas de un usuario */
export async function getUserBookings() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*, providers(name, type)')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}

/** Reservas de un provider */
export async function getProviderBookings(providerId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(username, phone)')
    .eq('provider_id', providerId)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}

/** Actualizar estado de una reserva */
export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (error) throw error
}