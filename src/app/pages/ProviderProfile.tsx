import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Facebook,
  Instagram,
  Twitter,
  Clock
} from 'lucide-react';
import { mockProviders } from '../data/mockData';
import { useState } from 'react';
import BookingDialog from '../components/BookingDialog';
import LoginDialog from '../components/LoginDialog';

export default function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = mockProviders.find(p => p.id === id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBooking, setShowBooking] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Provider not found</h2>
          <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = provider.availability[dayOfWeek] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="p-8 mb-6">
          {/* Provider Images */}
          {provider.images.length > 0 && (
            <div className="mb-6 -mx-8 -mt-8">
              <img
                src={provider.images[0]}
                alt={provider.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Provider Image/Icon */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl flex-shrink-0">
              {provider.type === 'grooming' && '✂️'}
              {provider.type === 'health' && '🏥'}
              {provider.type === 'care' && '❤️'}
              {provider.type === 'training' && '🎓'}
              {provider.type === 'daycare' && '🏠'}
            </div>

            {/* Provider Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl mb-2">{provider.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-lg">{provider.rating}</span>
                      <span className="ml-1">({provider.reviewCount} reviews)</span>
                    </div>
                    {provider.distance && (
                      <>
                        <span>•</span>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {provider.distance} miles away
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{provider.description}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.badges.map((badge, idx) => (
                  <Badge key={idx} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => setShowBooking(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl mb-4">About</h3>
                <p className="text-gray-600 leading-relaxed">{provider.description}</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Open {Object.keys(provider.availability).length} days a week</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>{provider.locations.length} location{provider.locations.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl mb-4">Location</h3>
                <div className="space-y-4">
                  {provider.locations.map((location, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <p className="mb-2">{location.address}</p>
                      <p className="text-sm text-gray-600">{location.phone}</p>
                      <Button variant="link" className="px-0 mt-2">
                        Get Directions →
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Our Services</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {provider.services.map((service, idx) => (
                  <div key={idx} className="p-4 border rounded-lg hover:border-purple-500 transition-colors">
                    <h4 className="mb-2">{service}</h4>
                    <p className="text-sm text-gray-600">Professional service with experienced staff</p>
                    <Button variant="link" className="px-0 mt-2">
                      Learn more →
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="p-6">
              <h3 className="text-xl mb-6">Availability Schedule</h3>
              
              <div className="mb-6">
                <label className="block text-sm mb-2">Select a date:</label>
                <input
                  type="date"
                  className="border rounded-lg px-4 py-2"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <h4 className="mb-4">Available times for {dayOfWeek}:</h4>
                {todaySchedule.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {todaySchedule.map((slot, idx) => (
                      <div key={idx} className="text-center">
                        <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                          <p className="text-sm">{slot.start} - {slot.end}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Closed on {dayOfWeek}</p>
                )}
              </div>

              <div className="mt-8">
                <h4 className="mb-4">Weekly Schedule:</h4>
                <div className="space-y-2">
                  {Object.entries(provider.availability).map(([day, slots]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{day}</span>
                      <span className="text-sm text-gray-600">
                        {slots.map(s => `${s.start} - ${s.end}`).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Our Team</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {provider.staff.map((member, idx) => (
                  <div key={idx} className="text-center p-4 border rounded-lg">
                    <div className="text-6xl mb-3">{member.avatar}</div>
                    <h4 className="mb-1">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card className="p-6">
              <h3 className="text-xl mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${provider.email}`} className="text-purple-600 hover:underline">
                      {provider.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                {provider.locations.map((location, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {provider.locations.length > 1 ? `Location ${idx + 1}` : 'Phone'}
                      </p>
                      <a href={`tel:${location.phone}`} className="text-purple-600 hover:underline">
                        {location.phone}
                      </a>
                    </div>
                  </div>
                ))}

                {/* Social Media */}
                <div className="pt-6 border-t">
                  <h4 className="mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    {provider.socialMedia.facebook && (
                      <a
                        href={`https://facebook.com/${provider.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                    )}
                    {provider.socialMedia.instagram && (
                      <a
                        href={`https://instagram.com/${provider.socialMedia.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white hover:from-purple-700 hover:to-pink-700 transition-colors"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {provider.socialMedia.twitter && (
                      <a
                        href={`https://twitter.com/${provider.socialMedia.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-colors"
                      >
                        <Twitter className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="pt-6 border-t">
                  <h4 className="mb-4">Send a Message</h4>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Message</label>
                      <textarea
                        className="w-full border rounded-lg px-4 py-2 h-32"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BookingDialog 
        open={showBooking} 
        onOpenChange={setShowBooking} 
        provider={provider}
        onLoginRequired={() => {
          setShowBooking(false);
          setShowLogin(true);
        }}
      />
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}