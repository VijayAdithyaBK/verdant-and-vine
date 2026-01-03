import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Construction, Shovel } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Cartoon SVG Components ---

const Sun = () => (
  <motion.g
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <circle cx="0" cy="0" r="15" fill="#FDB813" />
    {[...Array(8)].map((_, i) => (
      <line
        key={i}
        x1="0" y1="20" x2="0" y2="28"
        stroke="#FDB813"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${i * 45})`}
      />
    ))}
  </motion.g>
);

const Cloud = ({ delay = 0, xStart = -50 }) => (
  <motion.path
    d="M10,30 Q25,15 40,30 T70,30 T90,30 L90,45 L10,45 Z"
    fill="white"
    opacity="0.8"
    initial={{ x: xStart }}
    animate={{ x: [xStart, xStart + 200] }}
    transition={{ duration: 20, delay, repeat: Infinity, ease: "linear" }}
  />
);

const Tree = ({ x, delay, scale = 1 }: { x: number; delay: number; scale?: number }) => (
  <motion.g
    transform={`translate(${x}, 0) scale(${scale})`}
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
    transition={{ delay, duration: 0.8, type: "spring" }}
  >
    {/* Trunk */}
    <rect x="-5" y="-60" width="10" height="60" fill="#8D6E63" />
    
    {/* Leaves */}
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.3, type: "spring" }}
    >
      <motion.circle 
        cx="0" cy="-60" r="25" fill="#4CAF50" 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="-15" cy="-50" r="15" fill="#66BB6A" />
      <circle cx="15" cy="-50" r="15" fill="#66BB6A" />
      <circle cx="0" cy="-80" r="20" fill="#81C784" />
    </motion.g>
  </motion.g>
);

const Flower = ({ x, delay, color }: { x: number; delay: number; color: string }) => (
  <motion.g
    transform={`translate(${x}, 0)`}
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
    transition={{ delay, duration: 0.5 }}
  >
    <path d="M0,0 Q5,-15 0,-30" stroke="#689F38" strokeWidth="2" fill="none" />
    <motion.g 
      transform="translate(0, -30)"
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
      transition={{ 
        scale: { delay: delay + 0.2, type: "spring" },
        rotate: { delay: delay + 0.5, duration: 4, repeat: Infinity }
      }}
    >
      {[0, 60, 120, 180, 240, 300].map((rot) => (
        <ellipse 
            key={rot} 
            cx="0" cy="-8" rx="4" ry="8" 
            fill={color} 
            transform={`rotate(${rot})`} 
        />
      ))}
      <circle r="5" fill="#FFEB3B" />
    </motion.g>
  </motion.g>
);

const Shrub = ({ x, delay }: { x: number; delay: number }) => (
    <motion.g
        transform={`translate(${x}, 0)`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 200 }}
    >
        <path d="M-20,0 Q-10,-30 0,-20 Q10,-30 20,0 Z" fill="#388E3C" />
        <motion.circle 
            cx="-10" cy="-10" r="2" fill="#C8E6C9" 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
        />
        <motion.circle 
            cx="10" cy="-8" r="1.5" fill="#C8E6C9" 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: Math.random() }}
        />
    </motion.g>
);

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-leaf-900/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-leaf-900"
            >
                <X size={24} />
            </button>

            {/* Sky Section */}
            <div className="h-48 bg-sky-200 relative overflow-hidden">
                <motion.div 
                    className="absolute top-8 right-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Sun />
                </motion.div>
                
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <Cloud delay={0} xStart={20} />
                    <Cloud delay={1} xStart={-60} />
                </svg>

                {/* Construction Sign */}
                <motion.div 
                    initial={{ rotate: -20, y: -100 }}
                    animate={{ rotate: [5, -5, 5], y: 0 }}
                    transition={{ 
                        y: { type: "spring", stiffness: 100 },
                        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute top-0 left-8 bg-yellow-400 w-1.5 h-20"
                >
                    <div className="absolute bottom-0 -left-[22px] w-[50px] h-[40px] bg-yellow-400 border-4 border-orange-500 rounded-md flex items-center justify-center shadow-lg transform rotate-[-5deg]">
                         <Construction className="text-orange-600" size={24} />
                    </div>
                </motion.div>
            </div>

            {/* Ground & Plants Section */}
            <div className="relative bg-leaf-50 p-8 pt-0 text-center">
                {/* SVG Scene Layer */}
                <div className="h-24 w-full relative -mt-12 mb-4">
                    <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                         {/* Ground Line */}
                        <path d="M0,100 Q150,90 300,100" fill="#8D6E63" opacity="0.2" />
                        
                        <Tree x={40} delay={0.2} scale={1.2} />
                        <Tree x={260} delay={0.4} scale={0.9} />
                        <Shrub x={100} delay={0.6} />
                        <Flower x={130} delay={0.7} color="#E91E63" />
                        <Flower x={150} delay={0.8} color="#9C27B0" />
                        <Flower x={170} delay={0.9} color="#FF5722" />
                        <Shrub x={200} delay={0.5} />
                    </svg>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <Shovel size={14} /> Under Cultivation
                    </div>
                    <h3 className="font-serif text-3xl text-leaf-900 mb-3">Sprouting Soon!</h3>
                    <p className="text-earth-600 mb-8 max-w-sm mx-auto leading-relaxed">
                        We are currently planting the seeds for this feature. Check back later for pots, accessories, and gifts!
                    </p>
                    
                    <button 
                        onClick={onClose}
                        className="bg-leaf-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-leaf-600/20 hover:bg-leaf-700 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                    >
                        Got it, thanks!
                    </button>
                </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;