import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import type { Provider } from '../data/mockData';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider;
  onLoginRequired: () => void;
}

export default function BookingDialog({ open, onOpenChange, provider, onLoginRequired }: BookingDialogProps) {
  const { user, isGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    petName: '',
    petType: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuest) {
      onLoginRequired();
      return;
    }

    setIsLoading(true);

    try {
      // Mock booking - in real app, this would send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Booking confirmed!', {
        description: `Your appointment at ${provider.name} is scheduled for ${bookingData.date} at ${bookingData.time}`
      });
      
      onOpenChange(false);
      setBookingData({
        service: '',
        date: '',
        time: '',
        petName: '',
        petType: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Schedule a service with {provider.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select
              value={bookingData.service}
              onValueChange={(value) => setBookingData({ ...bookingData, service: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {provider.services.map((service, idx) => (
                  <SelectItem key={idx} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={bookingData.time}
                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pet-name">Pet Name</Label>
            <Input
              id="pet-name"
              type="text"
              placeholder="Fluffy"
              value={bookingData.petName}
              onChange={(e) => setBookingData({ ...bookingData, petName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pet-type">Pet Type</Label>
            <Select
              value={bookingData.petType}
              onValueChange={(value) => setBookingData({ ...bookingData, petType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="bird">Bird</SelectItem>
                <SelectItem value="rabbit">Rabbit</SelectItem>
                <SelectItem value="hamster">Hamster</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or information..."
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {isGuest && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Please sign in to complete your booking
              </p>
            </div>
          )}

          {!isGuest && user.username && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
              <p>Booking as: <strong>{user.username}</strong></p>
              <p className="text-xs mt-1">Contact: {user.email}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? 'Booking...' : isGuest ? 'Sign In to Book' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
