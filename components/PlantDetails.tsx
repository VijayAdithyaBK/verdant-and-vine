import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Droplets, Check, MapPin, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { Plant } from '../types';

interface PlantDetailsProps {
  plant: Plant | null;
  onClose: () => void;
  onWater: (plantId: string) => void;
}

const PlantDetails: React.FC<PlantDetailsProps> = ({ plant, onClose, onWater }) => {
  const [isWatered, setIsWatered] = useState(false);

  // Lock body and html scroll when plant details are open
  useEffect(() => {
    if (plant) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [plant]);

  const handleWater = () => {
    if (!plant) return;
    setIsWatered(true);
    onWater(plant.id);
    setTimeout(() => setIsWatered(false), 2000);
  };

  const getStockStatus = (status: Plant['availability']) => {
    switch (status) {
      case 'in-stock':
        return { icon: Check, color: 'text-green-600', bg: 'bg-green-50', text: 'In Stock' };
      case 'low-stock':
        return { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', text: 'Low Stock - Visit Soon' };
      case 'out-of-stock':
        return { icon: X, color: 'text-gray-500', bg: 'bg-gray-50', text: 'Currently Unavailable' };
      case 'seasonal':
        return { icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', text: 'Seasonal Item' };
      default:
        return { icon: Check, color: 'text-green-600', bg: 'bg-green-50', text: 'In Stock' };
    }
  };

  // Guard against null plant for derived values
  const status = plant ? getStockStatus(plant.availability) : null;
  const StatusIcon = status?.icon;

  return (
    <AnimatePresence>
      {plant && status && StatusIcon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true" aria-labelledby="plant-title">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 will-change-[opacity]"
            aria-hidden="true"
          />

          <motion.div
            /* Pure opacity fade to allow image `layoutId` to fly back cleanly without scale conflict */
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] md:h-[500px] will-change-transform transform-gpu"
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button
              onClick={onClose}
              aria-label="Close details"
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-leaf-500"
            >
              <X size={20} className="text-leaf-900" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-5/12 h-48 md:h-full relative bg-earth-100 overflow-hidden">
              {/* Keep layoutId ONLY on the image for the zoom effect */}
              <motion.img
                layoutId={`image-${plant.id}`}
                src={plant.imageUrl}
                alt={plant.name}
                className={`w-full h-full object-cover ${plant.availability === 'out-of-stock' ? 'grayscale-[0.8]' : ''} will-change-transform`}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col relative">
              <motion.div
                className="flex flex-col h-full overflow-y-auto no-scrollbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-earth-500 font-medium tracking-wider text-xs uppercase">{plant.category}</span>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${status.bg} ${status.color}`}>
                      <StatusIcon size={12} />
                      <span>{status.text}</span>
                    </div>
                  </div>
                  <h2 id="plant-title" className="font-serif text-3xl text-leaf-900 mb-1">{plant.name}</h2>
                  <p className="text-base text-earth-600 italic">{plant.scientificName}</p>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                  {plant.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-leaf-50 text-leaf-700 text-[10px] rounded-full font-medium border border-leaf-100">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mb-6 p-4 bg-earth-50 rounded-xl border border-earth-100">
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-earth-500 uppercase tracking-wide">Size at Sale</span>
                    <p className="text-base font-serif text-leaf-900">{plant.size}</p>
                  </div>
                  <div className="pt-3 border-t border-earth-200">
                    <span className="text-[10px] font-bold text-earth-500 uppercase tracking-wide flex items-center gap-1">
                      <MapPin size={10} /> Location in Nursery
                    </span>
                    <p className="text-leaf-900 text-sm font-medium mt-1">{plant.location}</p>
                  </div>
                </div>

                <p className="text-earth-800 leading-relaxed mb-6 text-sm md:text-base">
                  {plant.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">
                      <Sun size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-leaf-900 text-sm">Sunlight</h4>
                      <p className="text-xs text-earth-600 capitalize">{plant.sunlight}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
                      <Droplets size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-leaf-900 text-sm">Water</h4>
                      <p className="text-xs text-earth-600 capitalize">{plant.water}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 pb-1 border-t border-earth-100">
                  <div className="flex items-center justify-between gap-4 pr-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-earth-600">Watering contributes to your digital garden!</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWater}
                      aria-live="polite"
                      className={`px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 relative focus:outline-none whitespace-nowrap flex-shrink-0 ${isWatered
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'bg-leaf-600 text-white hover:bg-leaf-700 border-2 border-leaf-600 hover:border-leaf-700'
                        }`}
                    >
                      {isWatered ? (
                        <>
                          <Check size={18} />
                          <span className="text-sm">Growing!</span>
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: 0, opacity: 0 }}
                              animate={{ y: -30, opacity: [0, 1, 0] }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="absolute top-1/2 left-1/2 text-blue-500"
                              style={{ marginLeft: (i - 2) * 8 }}
                            >
                              <Sparkles size={10} fill="currentColor" />
                            </motion.div>
                          ))}
                        </>
                      ) : (
                        <>
                          <Droplets size={18} />
                          <span className="text-sm">Water Me</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlantDetails;