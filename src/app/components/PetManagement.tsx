import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { trash2, Plus, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Pet } from '../data/mockData';
import { petService } from '../../lib/petService';
import { handleError } from '../../lib/errorHandler';

interface PetManagementProps {
  userId: string;
}

export default function PetManagement({ userId }: PetManagementProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog' as Pet['type'],
    breed: '',
    age: '',
    weight: '',
    color: '',
    birthday: '',
    medicalInfo: {
      vaccinations: [] as string[],
      allergies: [] as string[],
      medications: [] as string[],
      notes: '',
    },
  });

  useEffect(() => {
    loadPets();
  }, [userId]);

  const loadPets = async () => {
    setLoading(true);
    try {
      const userPets = await petService.getUserPets(userId);
      setPets(userPets);
    } catch (error) {
      toast.error(handleError(error, 'PetManagement.loadPets'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pet?: Pet) => {
    if (pet) {
      setEditingPet(pet);
      setFormData({
        name: pet.name,
        type: pet.type,
        breed: pet.breed || '',
        age: pet.age?.toString() || '',
        weight: pet.weight?.toString() || '',
        color: pet.color || '',
        birthday: pet.birthday || '',
        medicalInfo: pet.medicalInfo || {
          vaccinations: [],
          allergies: [],
          medications: [],
          notes: '',
        },
      });
    } else {
      setEditingPet(null);
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        age: '',
        weight: '',
        color: '',
        birthday: '',
        medicalInfo: {
          vaccinations: [],
          allergies: [],
          medications: [],
          notes: '',
        },
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Pet name is required');
      return;
    }

    setLoading(true);
    try {
      const petPayload = {
        name: formData.name,
        type: formData.type,
        breed: formData.breed || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        color: formData.color || undefined,
        birthday: formData.birthday || undefined,
        medicalInfo: formData.medicalInfo.notes
          ? formData.medicalInfo
          : undefined,
      };

      if (editingPet) {
        await petService.updatePet(editingPet.id, petPayload);
        toast.success('Pet updated successfully!');
      } else {
        await petService.createPet(userId, petPayload);
        toast.success('Pet added successfully!');
      }

      setShowDialog(false);
      loadPets();
    } catch (error) {
      toast.error(handleError(error, 'PetManagement.handleSubmit'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) return;

    setLoading(true);
    try {
      await petService.deletePet(petId);
      toast.success('Pet deleted');
      loadPets();
    } catch (error) {
      toast.error(handleError(error, 'PetManagement.handleDelete'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Pets</h3>
        <Button
          onClick={() => handleOpenDialog()}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          <p>No pets added yet. Add your first pet to get started!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <Card key={pet.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{pet.name}</h4>
                  <p className="text-sm text-gray-600">
                    {pet.breed || pet.type}
                    {pet.age && ` • ${pet.age} years old`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(pet)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(pet.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {pet.color && (
                <p className="text-sm text-gray-600 mb-2">Color: {pet.color}</p>
              )}
              {pet.weight && (
                <p className="text-sm text-gray-600 mb-2">
                  Weight: {pet.weight} lbs
                </p>
              )}
              {pet.birthday && (
                <p className="text-sm text-gray-600">Birthday: {pet.birthday}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPet ? 'Edit Pet' : 'Add New Pet'}
            </DialogTitle>
            <DialogDescription>
              {editingPet
                ? 'Update your pet information'
                : 'Add your pet details to your profile'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pet-name">Pet Name *</Label>
              <Input
                id="pet-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Buddy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet-type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as Pet['type'],
                  })
                }
              >
                <SelectTrigger id="pet-type">
                  <SelectValue />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData({ ...formData, breed: e.target.value })
                  }
                  placeholder="e.g., Golden Retriever"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="e.g., 3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="e.g., 65"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="e.g., Golden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-notes">Medical Notes</Label>
              <Textarea
                id="medical-notes"
                value={formData.medicalInfo.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medicalInfo: {
                      ...formData.medicalInfo,
                      notes: e.target.value,
                    },
                  })
                }
                placeholder="Allergies, medications, health conditions..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Saving...' : editingPet ? 'Update Pet' : 'Add Pet'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}