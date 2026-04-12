import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Plus,
  User,
  Mail,
  Phone,
  Clock,
  MapPin,
  Users,
  Settings,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockProviders } from '../data/mockData';
import ProfileEditor from '../components/ProfileEditor';
import AddBookingDialog from '../components/AddBookingDialog';

// Mock bookings data
const mockBookings = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '(555) 111-2222',
    service: 'Full Grooming',
    date: '2026-04-15',
    time: '10:00',
    petName: 'Max',
    petType: 'dog',
    status: 'confirmed',
    notes: 'First time customer'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '(555) 333-4444',
    service: 'Bath & Brush',
    date: '2026-04-15',
    time: '14:00',
    petName: 'Bella',
    petType: 'cat',
    status: 'pending',
    notes: ''
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    customerPhone: '(555) 555-6666',
    service: 'Nail Trimming',
    date: '2026-04-16',
    time: '11:30',
    petName: 'Charlie',
    petType: 'dog',
    status: 'confirmed',
    notes: 'Nervous around clippers'
  }
];

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, isProvider } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [bookings] = useState(mockBookings);

  // Get provider data (mock - in real app, fetch by user.providerId)
  const provider = mockProviders.find(p => p.id === user.providerId) || mockProviders[0];

  if (!isProvider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">This page is only accessible to service providers.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date());
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/provider/${provider.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Public Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Welcome back, {user.username}!</h1>
          <p className="text-gray-600">Manage your {provider.name} profile and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-3xl">{confirmedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rating</p>
                <p className="text-3xl">{provider.rating}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Upcoming Appointments</h3>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => setShowAddBooking(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Manual Booking
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No upcoming bookings</p>
                  </div>
                ) : (
                  upcomingBookings.map(booking => (
                    <Card key={booking.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge
                              variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                              className={
                                booking.status === 'confirmed'
                                  ? 'bg-green-500'
                                  : 'bg-amber-500'
                              }
                            >
                              {booking.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="mb-2">{booking.service}</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {booking.time}
                                </p>
                                <p className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Pet: {booking.petName} ({booking.petType})
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1 text-sm">
                              <p>
                                <strong>Customer:</strong> {booking.customerName}
                              </p>
                              <p className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                {booking.customerEmail}
                              </p>
                              <p className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                {booking.customerPhone}
                              </p>
                              {booking.notes && (
                                <p className="text-gray-600 mt-2">
                                  <strong>Notes:</strong> {booking.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Profile Settings Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl mb-2">Profile Customization</h3>
                  <p className="text-gray-600">
                    Customize your public profile by adding or removing features
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => setShowEditor(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update My Profile
                </Button>
              </div>

              {/* Current Profile Features */}
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="mb-4">Active Features</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <div>
                        <p>Location & Map</p>
                        <p className="text-sm text-gray-600">{provider.locations.length} location(s)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <p>Team Members</p>
                        <p className="text-sm text-gray-600">{provider.staff.length} staff</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                      <div>
                        <p>Business Hours</p>
                        <p className="text-sm text-gray-600">
                          {Object.keys(provider.availability).length} days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Settings className="w-5 h-5 text-green-600" />
                      <div>
                        <p>Services</p>
                        <p className="text-sm text-gray-600">{provider.services.length} services</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="text-xl mb-6">Performance Analytics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-4">This Month</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Total Bookings</span>
                      <span className="text-lg">24</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Profile Views</span>
                      <span className="text-lg">156</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>New Reviews</span>
                      <span className="text-lg">8</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4">Popular Services</h4>
                  <div className="space-y-3">
                    {provider.services.slice(0, 3).map((service, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>{service}</span>
                          <span className="text-sm text-gray-600">{12 - idx * 3} bookings</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                            style={{ width: `${100 - idx * 25}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showEditor && (
        <ProfileEditor
          provider={provider}
          open={showEditor}
          onClose={() => setShowEditor(false)}
        />
      )}
      
      <AddBookingDialog
        open={showAddBooking}
        onOpenChange={setShowAddBooking}
        provider={provider}
      />
    </div>
  );
}