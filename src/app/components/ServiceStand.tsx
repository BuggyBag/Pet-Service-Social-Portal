import { motion } from 'motion/react';

interface ServiceStandProps {
  name: string;
  icon: string;
  position: { x: number; y: number };
  onClick: () => void;
}

export default function ServiceStand({ name, icon, position, onClick }: ServiceStandProps) {
  return (
    <motion.button
      className="absolute"
      style={{ left: position.x, top: position.y }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        {/* Stand structure */}
        <div className="bg-gradient-to-b from-purple-400 to-purple-600 rounded-t-xl px-6 py-4 shadow-lg">
          <div className="text-5xl mb-2">{icon}</div>
        </div>
        <div className="bg-purple-800 w-20 h-3 rounded-b-md"></div>
        <div className="bg-purple-900 w-16 h-8 rounded-b-lg"></div>
        
        {/* Sign */}
        <div className="bg-white rounded-lg px-4 py-2 mt-2 shadow-md border-2 border-purple-300">
          <p className="text-sm whitespace-nowrap">{name}</p>
        </div>
      </div>
    </motion.button>
  );
}
