import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Plant, TerrariumState, PlantProgress } from '../types';

interface GrowthWidgetProps {
  onClick: () => void;
  gameState: TerrariumState;
}

const GrowthWidget: React.FC<GrowthWidgetProps> = ({ onClick, gameState }) => {
  const controls = useAnimation();
  
  // Calculate total XP/Level for global animation state
  const totalLevel = (Object.values(gameState) as PlantProgress[]).reduce((acc: number, curr: PlantProgress) => acc + curr.level, 0);
  
  // Trigger animation when level changes
  useEffect(() => {
    controls.start({
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, -10, 10, -5, 0],
      transition: { duration: 0.5 }
    });
  }, [totalLevel, controls]);

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-40 bg-white p-3 rounded-full shadow-xl border-4 border-leaf-100 hover:border-leaf-300 transition-colors group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="relative w-14 h-14 flex items-center justify-center overflow-hidden rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
        
        {/* Animated Plant SVG */}
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          animate={controls}
          className="text-leaf-600 drop-shadow-sm"
        >
          {/* Pot */}
          <path d="M30,70 L70,70 L65,90 L35,90 Z" fill="#8d6e63" />
          
          {/* Stem - Grows with level */}
          <motion.path 
            d="M50,70 Q50,60 50,50" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: Math.min(1, totalLevel * 0.1) + 0.2 }}
          />

          {/* Leaves - Appear based on level thresholds */}
          {totalLevel > 2 && (
             <motion.path 
               d="M50,60 Q30,50 30,40 Q50,40 50,60" 
               fill="#4caf50" 
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }}
            />
          )}
          {totalLevel > 5 && (
             <motion.path 
               d="M50,55 Q70,45 70,35 Q50,35 50,55" 
               fill="#66bb6a"
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }}
            />
          )}
          {totalLevel > 10 && (
             <circle cx="50" cy="30" r="5" fill="#f44336" />
          )}
        </motion.svg>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
      </div>

      {/* Label Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-leaf-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        View Terrarium (Lvl {totalLevel})
      </div>
    </motion.button>
  );
};

export default GrowthWidget;