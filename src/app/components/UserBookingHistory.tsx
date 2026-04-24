import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Booking } from '../data/mockData';
import { supabase } from '../../lib/supabase';
import { handleError } from '../../lib/errorHandler';

interface UserBookingHistoryProps {
  userId: string;
}

export default function UserBookingHistory({ userId }: UserBookingHistoryProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [userId]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      setBookings(data ?? []);
    } catch (error) {
      toast.error(handleError(error, 'UserBookingHistory.loadBookings'));
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Booking cancelled');
      loadBookings();
    } catch (error) {
      toast.error(handleError(error, 'UserBookingHistory.cancelBooking'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status !== 'cancelled'
  );

  const pastBookings = bookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === 'cancelled'
  );

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{booking.service}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <User className="w-4 h-4" />
            <span>{booking.petName}</span>
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
              {booking.petType}
            </span>
          </div>
        </div>
        <Badge className={getStatusColor(booking.status)}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>{new Date(booking.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>{booking.time}</span>
        </div>
      </div>

      {booking.notes && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
          <p className="text-gray-700">{booking.notes}</p>
        </div>
      )}

      {new Date(booking.date) >= new Date() && booking.status !== 'cancelled' && (
        <div className="flex gap-2 pt-2 border-t">
          <Button size="sm" variant="outline" className="flex-1">
            Reschedule
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 flex-1"
            onClick={() => cancelBooking(booking.id)}
          >
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <span className="text-sm text-gray-600">
          {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastBookings.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({bookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                No upcoming bookings yet.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ChevronRight className="w-4 h-4 mr-2" />
                Browse Services
              </Button>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-4">
          {pastBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No past bookings.</p>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-4">
          {bookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No bookings found.</p>
            </Card>
          ) : (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}