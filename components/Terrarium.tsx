import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Cloud, Sun, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Plant, TerrariumState, PlantProgress } from '../types';

interface TerrariumProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: TerrariumState;
  onWater: (plantId: string) => void;
  allPlants: Plant[];
}

// Helper for the cute face with blinking animation
const KawaiiFace = ({ x = 0, y = 0, scale = 1, opacity = 0.8 }: { x?: number, y?: number, scale?: number, opacity?: number }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    // Random blink interval between 2s and 6s
    const timeout = setTimeout(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 2000 + Math.random() * 4000);

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 4000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {isBlinking ? (
        <g>
          <path d="M-6.5,-0.5 L-3.5,-0.5" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3.5,-0.5 L6.5,-0.5" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="-5" cy="-1" r="1.5" fill="#1a1a1a" />
          <circle cx="5" cy="-1" r="1.5" fill="#1a1a1a" />
          <circle cx="-6" cy="-2" r="0.5" fill="white" opacity="0.8" />
          <circle cx="4" cy="-2" r="0.5" fill="white" opacity="0.8" />
        </g>
      )}
      <path d="M-2,2 Q0,3.5 2,2" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  );
};

const CartoonPlant = ({ plant, level }: { plant: Plant; level: number }) => {
  // Growth logic: 
  // Base scale starts at 0.7
  // Scales up to 1.3 by level 20
  const plantScale = 0.7 + (Math.min(level, 20) * 0.03);

  // Helper for conditional rendering based on level
  const showIfLevel = (threshold: number) => level >= threshold;

  // --- Idle Animations ---

  // 1. Root Sway: Gentle overall movement (wind)
  const rootSway = useMemo(() => ({
    animate: {
      rotate: [0, 1, 0, -1, 0],
      transition: {
        duration: 5 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }), []);

  // 2. Leaf Twitch: Occasional quick flutter
  const leafTwitch = useMemo(() => ({
    animate: {
      rotate: [0, 3, 0, -2, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 4 + Math.random() * 6, // Infrequent
        ease: "easeInOut" as const
      }
    }
  }), []);

  // 3. Breathe: Subtle expansion for heads/flowers
  const breathe = useMemo(() => ({
    animate: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }), []);

  // 4. Independent Sway: For multi-part plants to move non-uniformly
  const makeIndependentSway = (delay = 0, duration = 4) => ({
    animate: {
      rotate: [0, 2, 0, -2, 0],
      transition: {
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  });

  // Entrance animation for new parts
  const popIn = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: [0, 1.2, 1], opacity: 1 },
    transition: { duration: 0.6, type: "spring" as const, stiffness: 200, damping: 15 }
  };

  // Adjust Y translation to move plants lower in the pot area since we have more vertical space
  const BASE_Y = 85;

  const renderPlantPaths = () => {
    // For unknown dynamic plants, map to a random existing style based on ID hash or category
    // This allows new plants from the spreadsheet to still have a "toon" look
    // Simple mock logic: ID length even/odd or specific known IDs

    // Check known visual styles
    if (plant.id === '1' || plant.name.includes('Monstera')) {
      // Monstera Style
      return (
        <g transform={`translate(50, ${BASE_Y})`}>
          <motion.g {...rootSway} style={{ transformOrigin: "0 0" }}>
            <path d="M0,0 Q2,-15 0,-30" stroke="#1b5e20" strokeWidth="3" fill="none" strokeLinecap="round" />
            {showIfLevel(5) && (
              <motion.g {...popIn}>
                <path d="M0,-10 Q-15,-20 -20,-30" stroke="#1b5e20" strokeWidth="2" fill="none" strokeLinecap="round" />
                <motion.g transform="translate(-20, -30) rotate(-30)" {...leafTwitch}>
                  <path d="M0,0 C-15,-5 -20,-25 0,-35 C20,-25 15,-5 0,0" fill="#4caf50" />
                  <circle cx="-5" cy="-20" r="1.5" fill="#c5e1a5" />
                </motion.g>
              </motion.g>
            )}
            <motion.g transform="translate(0, -30)" {...breathe}>
              <path d="M0,0 C-30,-20 -35,-50 0,-65 C35,-50 30,-20 0,0" fill="#2e7d32" />
              <KawaiiFace y={-28} scale={1.4} />
            </motion.g>
          </motion.g>
        </g>
      );
    } else if (plant.id === '2' || plant.name.includes('Fiddle')) {
      // Fiddle Leaf Style
      return (
        <g transform={`translate(50, ${BASE_Y})`}>
          <motion.g {...rootSway} style={{ transformOrigin: "0 0" }}>
            <path d="M0,0 L0,-60" stroke="#795548" strokeWidth="4" strokeLinecap="round" />
            <motion.g transform="translate(-15, -20) rotate(-45)" {...leafTwitch}>
              <ellipse cx="0" cy="0" rx="10" ry="14" fill="#2e7d32" />
            </motion.g>
            <motion.g transform="translate(5, -65) rotate(10)" {...makeIndependentSway(1.5)}>
              <path d="M0,0 C20,-10 20,-30 0,-40 C-20,-30 -20,-10 0,0" fill="#66bb6a" />
              <KawaiiFace y={-20} scale={1.1} />
            </motion.g>
          </motion.g>
        </g>
      );
    } else if (plant.id === '3' || plant.category === 'succulent') {
      // Snake Plant / Succulent Generic Style
      return (
        <g transform={`translate(50, ${BASE_Y})`}>
          {showIfLevel(3) && (
            <motion.g {...makeIndependentSway(0, 5)} style={{ originY: 1 }}>
              <motion.path initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} d="M-10,0 Q-20,-30 -12,-55 Q-5,-30 -10,0" fill="#4caf50" stroke="#cddc39" strokeWidth="1.5" />
            </motion.g>
          )}
          <motion.g transform="translate(0, -5)" {...breathe}>
            <path d="M0,0 Q-8,-35 0,-65 Q8,-35 0,0" fill="#66bb6a" stroke="#dce775" strokeWidth="1.5" />
            <KawaiiFace y={-35} />
          </motion.g>
        </g>
      );
    } else if (plant.category === 'flowering') {
      // Generic Flower Style
      return (
        <g transform={`translate(50, ${BASE_Y})`}>
          <motion.g {...rootSway} style={{ transformOrigin: "0 0" }}>
            <path d="M0,0 L5,-45" stroke="#4caf50" strokeWidth="3" />
            <motion.g {...makeIndependentSway(0)}>
              <ellipse cx="-10" cy="-30" rx="8" ry="20" fill="#2e7d32" transform="rotate(-20 -10 -30)" />
            </motion.g>
            <motion.g {...popIn} transform="translate(5, -45)">
              <motion.g {...breathe}>
                <path d="M0,0 L10,-10 L15,5 Z" fill="#ff9800" />
                <circle cx="3" cy="1" r="1.5" fill="black" />
                <circle cx="3.5" cy="0.5" r="0.5" fill="white" />
              </motion.g>
            </motion.g>
          </motion.g>
        </g>
      );
    } else {
      // Generic Plant Style (Rubber Plant-ish) for anything else
      return (
        <g transform={`translate(50, ${BASE_Y})`}>
          <motion.g {...rootSway} style={{ transformOrigin: "0 0" }}>
            <path d="M0,0 L0,-45" stroke="#3e2723" strokeWidth="3" />
            <motion.ellipse cx="-15" cy="-25" rx="10" ry="15" fill="#1b5e20" transform="rotate(-30 -15 -25)" {...leafTwitch} />
            <motion.g transform="translate(0, -45)" {...breathe}>
              <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#2e7d32" />
              <KawaiiFace y={-10} />
            </motion.g>
          </motion.g>
        </g>
      );
    }
  }


  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md filter overflow-visible">
      {/* Soil shadow underneath pot */}
      <ellipse cx="50" cy="95" rx="22" ry="4" fill="#000" opacity="0.15" />

      {/* Pot Back Layer */}
      <path d="M35,80 Q35,95 50,95 Q65,95 65,80" fill="#8d6e63" />
      <ellipse cx="50" cy="80" rx="15" ry="3" fill="#6d4c41" /> {/* Soil surface */}

      {/* Dynamic Plant Layer - Grows from pot center */}
      <motion.g
        initial={false}
        animate={{ scale: plantScale }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        style={{ transformOrigin: '50px 80px' }}
      >
        {renderPlantPaths()}
      </motion.g>

      {/* Pot Front Rim Highlight */}
      <path d="M35,80 Q50,85 65,80" stroke="#a1887f" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}

const Terrarium: React.FC<TerrariumProps> = ({ isOpen, onClose, gameState, onWater, allPlants }) => {
  // --- Pagination & Scroll Lock Logic ---
  const [page, setPage] = useState(0);
  const PLANTS_PER_PAGE = 4;
  const totalPages = Math.ceil(allPlants.length / PLANTS_PER_PAGE);

  // Lock background scroll when Terrarium is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const displayedPlants = allPlants.slice(page * PLANTS_PER_PAGE, (page + 1) * PLANTS_PER_PAGE);

  const nextPage = () => setPage(p => Math.min(totalPages - 1, p + 1));
  const prevPage = () => setPage(p => Math.max(0, p - 1));

  // Calculate total level
  const totalLevel = Object.values(gameState).reduce((acc: number, curr: PlantProgress) => acc + curr.level, 0);

  // Background Particles Generation (Memoized to prevent hydration mismatch/re-renders)
  const particles = useMemo(() => Array.from({ length: 8 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5,
    xOffset: (Math.random() - 0.5) * 100
  })), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          {/* Card Container: Fixed Height to prevent overflow on screen */}
          <motion.div
            initial={{ scale: 0.9, rotate: 2 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-[95vw] md:max-w-5xl h-[90vh] md:h-[85vh] bg-white p-2 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col ring-2 md:ring-4 ring-white/50"
          >
            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 p-6 flex justify-between items-start pointer-events-none">
              <div className="pointer-events-auto bg-white/90 backdrop-blur px-2 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl shadow-sm border-2 border-green-100 flex items-center gap-2 md:gap-3">
                <div className="bg-yellow-100 p-1.5 rounded-xl text-yellow-600">
                  <Trophy size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-leaf-900 leading-none text-sm md:text-lg">Level {totalLevel}</h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="pointer-events-auto bg-red-400 hover:bg-red-500 text-white p-1.5 md:p-2 rounded-full shadow-md border-2 border-white transition-colors"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            {/* Inner Scene: The 'Game View' */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col bg-[#c5e1a5]">

              {/* 1. Sky Area */}
              <div className="h-[25%] min-h-[120px] bg-gradient-to-b from-sky-300 to-sky-100 relative shrink-0 z-0">
                <motion.div
                  animate={{ x: [0, 20, 0], y: [0, -5, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-10 text-yellow-300"
                >
                  <Sun size={70} fill="currentColor" className="text-yellow-400 drop-shadow-md" />
                </motion.div>

                <motion.div
                  initial={{ x: -100 }}
                  animate={{ x: 400 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute top-10 left-0 text-white/80"
                >
                  <Cloud size={90} fill="currentColor" />
                </motion.div>

                {/* Forest Horizon - Transition to Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end opacity-90 text-[#33691e] overflow-hidden">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i}
                      className="w-12 md:w-16 bg-[#558b2f] rounded-t-full"
                      style={{
                        height: `${50 + Math.random() * 50}%`,
                        marginLeft: i === 0 ? 0 : `-${Math.random() * 20 + 10}px`,
                        zIndex: Math.floor(Math.random() * 10)
                      }}
                    >
                      <div className="w-full h-full bg-[#33691e] opacity-20 rounded-t-full transform scale-x-50" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Ground Area (Paginated) - UPDATED: No overflow-hidden on flex container to allow plants to overlap sky */}
              <div className="flex-1 relative flex flex-col items-center justify-center">

                {/* Background Layer - Isolated for clipping */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  {/* Grass Texture Pattern */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(#33691e 3px, transparent 3px)',
                      backgroundSize: '40px 40px',
                      backgroundPosition: '0 0, 20px 20px'
                    }}
                  />

                  {/* Large swaying leaf shadow - Bottom Left */}
                  <motion.div
                    className="absolute -bottom-32 -left-32 w-96 h-96 text-leaf-800 opacity-[0.04] blur-sm"
                    animate={{ rotate: [0, 5, 0], x: [0, 20, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                      <path d="M50,100 C20,60 0,30 50,0 C100,30 80,60 50,100 Z" />
                    </svg>
                  </motion.div>

                  {/* Large swaying leaf shadow - Top Right */}
                  <motion.div
                    className="absolute -top-20 -right-20 w-80 h-80 text-leaf-800 opacity-[0.04] blur-sm"
                    animate={{ rotate: [0, -8, 0], y: [0, 30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  >
                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                      <path d="M50,100 C80,60 100,30 50,0 C0,30 20,60 50,100 Z" />
                    </svg>
                  </motion.div>

                  {/* Gentle light shift */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-yellow-50/10 via-transparent to-transparent"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Floating Particles/Pollen */}
                  {particles.map((p, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
                      style={{ top: p.top, left: p.left }}
                      animate={{
                        y: [0, -100],
                        x: [0, p.xOffset],
                        opacity: [0, 0.6, 0]
                      }}
                      transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>

                {/* Plants Grid - Fixed rows for 4 plants. Z-10 to sit above background */}
                <div className="relative z-10 w-full px-2 md:px-12 pb-8 md:pb-12 pt-4 md:pt-8 flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={page}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-8 justify-items-center w-full"
                    >
                      {displayedPlants.map((plant) => {
                        const progress = gameState[plant.id] || { level: 1, xp: 0, lastWatered: 0 };
                        return (
                          <div key={plant.id} className="flex flex-col items-center group relative z-10">
                            <motion.button
                              className="relative cursor-pointer w-24 h-28 sm:w-32 sm:h-40 md:w-40 md:h-52 flex items-end justify-center"
                              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              onClick={() => onWater(plant.id)}
                            >
                              <div className="w-full h-full relative drop-shadow-lg">
                                <CartoonPlant plant={plant} level={progress.level} />

                                {/* Level Badge Container */}
                                <div className="absolute top-2 right-1 z-20">
                                  {/* Burst effect on level change */}
                                  <motion.div
                                    key={`burst-${progress.level}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="absolute inset-0 rounded-full bg-yellow-300 pointer-events-none"
                                  />

                                  {/* The Badge Itself */}
                                  <motion.div
                                    key={`badge-${progress.level}`}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border-2 border-white shadow-lg text-white font-bold text-sm"
                                  >
                                    {progress.level}
                                  </motion.div>
                                </div>

                                {/* XP Bar */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 bg-black/20 rounded-full overflow-hidden border border-white/30">
                                  <div
                                    className="h-full bg-blue-400"
                                    style={{ width: `${(progress.xp / (progress.level * 10)) * 100}%` }}
                                  />
                                </div>

                                {/* Floating XP Animation */}
                                <AnimatePresence>
                                  {progress.xp > 0 && (
                                    <motion.div
                                      key={`xp-${progress.xp}`}
                                      initial={{ opacity: 1, y: 0, scale: 0.5 }}
                                      animate={{ opacity: 0, y: -50, scale: 1.2 }}
                                      exit={{ opacity: 0 }}
                                      className="absolute top-0 right-0 text-blue-500 pointer-events-none"
                                    >
                                      <Sparkles size={24} fill="currentColor" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.button>
                            <div className="mt-2 text-center transform group-hover:scale-105 transition-transform relative z-30">
                              <span className="text-[10px] md:text-xs font-black text-[#1b5e20] uppercase tracking-wider bg-white/60 px-3 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/50">
                                {plant.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pagination Controls - Side Arrows (Vertically Centered) */}
                {totalPages > 1 && (
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-6 pointer-events-none z-40">
                    <button
                      onClick={prevPage}
                      disabled={page === 0}
                      className={`pointer-events-auto p-2 md:p-3 bg-white/80 hover:bg-white rounded-full shadow-lg text-leaf-900 transition-all transform hover:scale-110 ${page === 0 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer'}`}
                    >
                      <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={page === totalPages - 1}
                      className={`pointer-events-auto p-2 md:p-3 bg-white/80 hover:bg-white rounded-full shadow-lg text-leaf-900 transition-all transform hover:scale-110 ${page === totalPages - 1 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer'}`}
                    >
                      <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
                    </button>
                  </div>
                )}

                {/* Garden Label - Bottom Center */}
                <div className="absolute bottom-4 text-center w-full pointer-events-none z-30">
                  <span className="bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full text-leaf-900 text-xs font-bold uppercase tracking-widest border border-white/40 shadow-sm">
                    Garden {page + 1} of {totalPages}
                  </span>
                </div>
              </div>

              {/* Replaced with a subtle bottom gradient inside the ground area to anchor it */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10" />

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terrarium;