import { supabase } from './supabase'

// Buscar proveedores cercanos usando PostGIS
export async function getProvidersNearby(
  lat: number,
  lng: number,
  radiusKm: number = 5,
  category?: string
) {
  const { data, error } = await supabase
    .rpc('providers_within_radius', {
      lat,
      lng,
      radius_km: radiusKm
    })

  if (error) throw error

  if (category) {
    return data.filter((p: any) => p.category === category)
  }

  return data
}

// Crear una reserva
export async function createBooking(booking: {
  provider_id: string
  pet_id: string
  service: string
  date: string
  time: string
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