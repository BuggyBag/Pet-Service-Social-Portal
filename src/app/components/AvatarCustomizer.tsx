import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { PetAvatar as PetAvatarType } from '../data/mockData';

interface AvatarCustomizerProps {
  avatar: PetAvatarType;
  onAvatarChange: (updates: Partial<PetAvatarType>) => void;
  onClose?: () => void;
}

const petTypes = [
  { type: 'dog' as const, emoji: '🐕', label: 'Dog' },
  { type: 'cat' as const, emoji: '🐈', label: 'Cat' },
  { type: 'bird' as const, emoji: '🐦', label: 'Bird' },
  { type: 'rabbit' as const, emoji: '🐰', label: 'Rabbit' },
  { type: 'hamster' as const, emoji: '🐹', label: 'Hamster' },
];

const colors = [
  { value: '#FFD700', label: 'Gold' },
  { value: '#FFB6C1', label: 'Pink' },
  { value: '#87CEEB', label: 'Blue' },
  { value: '#98FB98', label: 'Green' },
  { value: '#DDA0DD', label: 'Purple' },
  { value: '#F0E68C', label: 'Yellow' },
  { value: '#FFA07A', label: 'Coral' },
  { value: '#E6E6FA', label: 'Lavender' },
];

export default function AvatarCustomizer({ avatar, onAvatarChange, onClose }: AvatarCustomizerProps) {
  const [name, setName] = useState(avatar.name);
  const [type, setType] = useState(avatar.type);
  const [color, setColor] = useState(avatar.color);

  const handleSave = () => {
    onAvatarChange({ name, type, color });
    onClose?.();
  };

  return (
    <div className="space-y-6 py-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="pet-name">Pet Name</Label>
        <Input
          id="pet-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your pet's name"
          maxLength={12}
        />
      </div>

      {/* Pet Type */}
      <div className="space-y-2">
        <Label>Pet Type</Label>
        <div className="grid grid-cols-5 gap-2">
          {petTypes.map((pet) => (
            <button
              key={pet.type}
              onClick={() => setType(pet.type)}
              className={`p-3 border-2 rounded-lg transition-all hover:scale-105 ${
                type === pet.type
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="text-3xl text-center">{pet.emoji}</div>
              <div className="text-xs text-center mt-1">{pet.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Avatar Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`p-3 border-2 rounded-lg transition-all hover:scale-105 ${
                color === c.value
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: c.value }}
            >
              <div className="text-xs text-center text-gray-800">{c.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-5xl border-4 border-yellow-400 shadow-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              {petTypes.find(p => p.type === type)?.emoji}
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded text-sm whitespace-nowrap">
              {name || 'MyPet'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}