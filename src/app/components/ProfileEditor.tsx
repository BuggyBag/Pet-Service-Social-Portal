import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  X,
  Plus,
  MapPin,
  Clock,
  Mail,
  Phone,
  Save,
  Edit2,
  Trash2,
  Star,
  Facebook,
  Instagram,
  Twitter,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import type { Provider } from '../data/mockData';

interface ProfileEditorProps {
  provider: Provider;
  open: boolean;
  onClose: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

interface Location {
  address: string;
  phone: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

export default function ProfileEditor({ provider, open, onClose }: ProfileEditorProps) {
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: provider.name,
    description: provider.description,
    email: provider.email,
  });

  const [locations, setLocations] = useState<Location[]>(provider.locations);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(provider.staff);
  const [services, setServices] = useState<string[]>(provider.services);
  const [availability, setAvailability] = useState<Record<string, TimeSlot[]>>(provider.availability);
  const [socialMedia, setSocialMedia] = useState(provider.socialMedia);

  // State for adding new items
  const [newLocation, setNewLocation] = useState<Location>({ address: '', phone: '' });
  const [newTeamMember, setNewTeamMember] = useState<TeamMember>({ name: '', role: '', avatar: '👤' });
  const [newService, setNewService] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Profile updated successfully!', {
        description: 'Your changes are now live'
      });
      onClose();
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const addLocation = () => {
    if (newLocation.address && newLocation.phone) {
      setLocations([...locations, newLocation]);
      setNewLocation({ address: '', phone: '' });
      toast.success('Location added');
    }
  };

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
    toast.success('Location removed');
  };

  const addTeamMember = () => {
    if (newTeamMember.name && newTeamMember.role) {
      setTeamMembers([...teamMembers, newTeamMember]);
      setNewTeamMember({ name: '', role: '', avatar: '👤' });
      toast.success('Team member added');
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
    toast.success('Team member removed');
  };

  const addService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
      toast.success('Service added');
    }
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
    toast.success('Service removed');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your business information and settings. Changes are visible to customers immediately after saving.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -mx-6 px-6 py-4">
          {/* Hero Preview */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl flex-shrink-0">
                {provider.type === 'grooming' && '✂️'}
                {provider.type === 'health' && '🏥'}
                {provider.type === 'care' && '❤️'}
                {provider.type === 'training' && '🎓'}
                {provider.type === 'daycare' && '🏠'}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <Label className="text-xs text-gray-600">Business Name</Label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="text-2xl h-auto py-2 border-2"
                  />
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-lg">{provider.rating}</span>
                    <span className="ml-1">({provider.reviewCount} reviews)</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Description</Label>
                  <Textarea
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    rows={2}
                    className="border-2"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {provider.badges.map((badge, idx) => (
                    <Badge key={idx} className="bg-gradient-to-r from-purple-600 to-pink-600">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Tabbed Content - Mirrors Public Profile */}
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-5 bg-white">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-purple-600" />
                    About Your Business
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg">Locations</h3>
                    <span className="text-sm text-gray-600">{locations.length} location(s)</span>
                  </div>
                  <div className="space-y-3">
                    {locations.map((location, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between">
                        <div className="flex-1">
                          <p className="mb-1">{location.address}</p>
                          <p className="text-sm text-gray-600">{location.phone}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeLocation(idx)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))}

                    <div className="pt-2 border-t space-y-2">
                      <Input
                        placeholder="Address"
                        value={newLocation.address}
                        onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                      />
                      <Input
                        placeholder="Phone number"
                        value={newLocation.phone}
                        onChange={(e) => setNewLocation({ ...newLocation, phone: e.target.value })}
                      />
                      <Button
                        size="sm"
                        onClick={addLocation}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Location
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg">Your Services</h3>
                  <span className="text-sm text-gray-600">{services.length} service(s)</span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {services.map((service, idx) => (
                    <div key={idx} className="p-3 border rounded-lg flex items-center justify-between hover:border-purple-500 transition-colors">
                      <span>{service}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeService(idx)}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Label className="mb-2">Add New Service</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Service name (e.g., Full Grooming)"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addService()}
                    />
                    <Button
                      onClick={addService}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card className="p-6">
                <h3 className="text-lg mb-4">Business Hours</h3>
                <div className="space-y-2">
                  {Object.entries(availability).map(([day, slots]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{day}</span>
                      <span className="text-sm text-gray-600">
                        {slots.map(s => `${s.start} - ${s.end}`).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Contact support to modify your business hours
                </p>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg">Team Members</h3>
                  <span className="text-sm text-gray-600">{teamMembers.length} member(s)</span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="relative p-4 border rounded-lg text-center hover:border-purple-500 transition-colors">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTeamMember(idx)}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                      <div className="text-4xl mb-2">{member.avatar}</div>
                      <h4 className="mb-1">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="mb-3">Add Team Member</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-3">
                        <Label>Avatar Emoji</Label>
                        <Input
                          placeholder="👤"
                          value={newTeamMember.avatar}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, avatar: e.target.value })}
                          maxLength={2}
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <Label>Name</Label>
                        <Input
                          placeholder="Name"
                          value={newTeamMember.name}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <Label>Role</Label>
                        <Input
                          placeholder="Role/Position"
                          value={newTeamMember.role}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addTeamMember}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <Card className="p-6">
                <h3 className="text-lg mb-6">Contact Information</h3>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600">Email Address</Label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="contact@business.com"
                      />
                    </div>
                  </div>

                  {/* Phone Numbers from Locations */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <Label>Phone Numbers</Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Phone numbers are managed in the Overview tab under Locations
                    </p>
                  </div>

                  {/* Social Media */}
                  <div className="pt-6 border-t">
                    <h4 className="mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-purple-600" />
                      Social Media
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <Input
                          placeholder="Facebook username"
                          value={socialMedia.facebook || ''}
                          onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <Input
                          placeholder="@instagram"
                          value={socialMedia.instagram || ''}
                          onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Twitter className="w-5 h-5 text-sky-500" />
                        <Input
                          placeholder="@twitter"
                          value={socialMedia.twitter || ''}
                          onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
