import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Settings, LogOut, Home, Heart } from 'lucide-react';
import { toast } from 'sonner';
import PetManagement from '../components/PetManagement';
import UserBookingHistory from '../components/UserBookingHistory';
import AccountSettings from '../components/AccountSettings';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (user.type === 'guest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
            <p className="text-gray-600 mb-6">
              Please log in to access your account dashboard.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Return Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-xl font-bold">{user.username || 'User'}</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="pets" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              My Pets
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Account Info
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <UserBookingHistory userId={user.id} />
          </TabsContent>

          {/* Pets Tab */}
          <TabsContent value="pets">
            <div className="bg-white rounded-lg p-6">
              <PetManagement userId={user.id} />
            </div>
          </TabsContent>

          {/* Account Info Tab */}
          <TabsContent value="account">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Overview */}
              <Card className="md:col-span-1 p-6">
                <h3 className="font-semibold text-lg mb-4">Account Overview</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Name</p>
                    <p className="font-medium">{user.username || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Email</p>
                    <p className="font-medium break-all">{user.email || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Phone</p>
                    <p className="font-medium">{user.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase">Account Type</p>
                    <p className="font-medium capitalize">
                      {user.type === 'user' ? 'Regular User' : user.type}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="md:col-span-2 p-6">
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setShowSettings(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Browse Services
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    Logout
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Settings Modal */}
      <AccountSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        user={user}
      />
    </div>
  );
}