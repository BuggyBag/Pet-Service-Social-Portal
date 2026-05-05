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
      className="absolute select-none"
      style={{ left: position.x, top: position.y }}
      whileHover={{ scale: 1.08, y: -6 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        {/* Roof / Awning — pixel-art style with hard shadow */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 80,
            height: 20,
            background: 'linear-gradient(180deg, #6d28d9 0%, #4c1d95 100%)',
            borderRadius: '6px 6px 0 0',
            boxShadow: '0 -3px 0 #312e81, 3px 0 0 #312e81, -3px 0 0 #312e81',
          }}
        >
          {/* Awning stripes */}
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i * 20,
                top: 0,
                width: 10,
                height: '100%',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        {/* Main booth body */}
        <div
          style={{
            width: 80,
            background: 'linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)',
            padding: '10px 0 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '3px 0 0 #4c1d95, -3px 0 0 #4c1d95',
            position: 'relative',
          }}
        >
          {/* Counter top inset */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 6,
              right: 6,
              height: 6,
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '2px 2px 0 0',
            }}
          />
          <span style={{ fontSize: 32, lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
            {icon}
          </span>
        </div>

        {/* Counter / base */}
        <div
          style={{
            width: 88,
            height: 12,
            background: 'linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)',
            boxShadow: '3px 3px 0 #4c1d95',
            borderRadius: '0 0 4px 4px',
          }}
        />

        {/* Legs */}
        <div className="flex gap-10">
          {[0, 1].map(i => (
            <div
              key={i}
              style={{
                width: 8,
                height: 16,
                background: '#4c1d95',
                boxShadow: '2px 2px 0 #312e81',
              }}
            />
          ))}
        </div>

        {/* Name sign */}
        <div
          className="mt-2 px-3 py-1 text-center"
          style={{
            background: '#fefce8',
            border: '2px solid #78350f',
            boxShadow: '2px 2px 0 #92400e',
            borderRadius: 4,
            minWidth: 80,
          }}
        >
          <p
            className="whitespace-nowrap font-bold"
            style={{ fontSize: 11, color: '#451a03', letterSpacing: '0.03em' }}
          >
            {name}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
