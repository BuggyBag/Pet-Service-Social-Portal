import { motion } from 'motion/react';
import { PetAvatar as PetAvatarType } from '../data/mockData';
import { Badge } from './ui/badge';

interface PetAvatarProps {
  avatar: PetAvatarType;
  isUser?: boolean;
  onClick?: () => void;
}

const petEmojis = {
  dog: '🐕',
  cat: '🐈',
  bird: '🐦',
  rabbit: '🐰',
  hamster: '🐹'
};

export default function PetAvatar({ avatar, isUser = false, onClick }: PetAvatarProps) {
  const emoji = petEmojis[avatar.type];
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: avatar.position.x,
        top: avatar.position.y,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Avatar bubble */}
      <div className={`relative ${isUser ? 'z-20' : 'z-10'}`}>
        {/* Message bubble */}
        {avatar.message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg whitespace-nowrap"
          >
            <div className="text-sm">{avatar.message}</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
          </motion.div>
        )}

        {/* Birthday indicator */}
        {avatar.birthday && (
          <div className="absolute -top-8 -right-2 text-2xl animate-bounce">
            🎂
          </div>
        )}

        {/* Pet avatar */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl border-4 ${
            isUser 
              ? 'border-yellow-400 bg-yellow-50 shadow-lg' 
              : 'border-white bg-white shadow-md'
          }`}
          style={{ backgroundColor: isUser ? undefined : `${avatar.color}20` }}
        >
          {emoji}
        </div>

        {/* Name tag */}
        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap ${
          isUser ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'
        }`}>
          {avatar.name}
        </div>

        {/* Badges */}
        {avatar.badges.length > 0 && (
          <div className="absolute -right-3 -top-2 flex flex-col gap-1">
            {avatar.badges.slice(0, 2).map((badge, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs px-1 py-0 h-5">
                ⭐
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
