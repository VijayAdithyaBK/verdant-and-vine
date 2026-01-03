import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Droplets, Sparkles } from 'lucide-react';
import { Plant } from '../types';

interface PlantCardProps {
  plant: Plant;
  onClick: (plant: Plant) => void;
}

const getAvailabilityColor = (status: Plant['availability']) => {
  switch (status) {
    case 'in-stock': return 'bg-leaf-100 text-leaf-800 border-leaf-200';
    case 'low-stock': return 'bg-orange-50 text-orange-700 border-orange-100';
    case 'out-of-stock': return 'bg-gray-100 text-gray-500 border-gray-200';
    case 'seasonal': return 'bg-purple-50 text-purple-700 border-purple-100';
    default: return 'bg-leaf-100 text-leaf-800';
  }
};

const getAvailabilityLabel = (status: Plant['availability']) => {
  switch (status) {
    case 'in-stock': return 'In Stock';
    case 'low-stock': return 'Low Stock';
    case 'out-of-stock': return 'Unavailable';
    case 'seasonal': return 'Seasonal';
    default: return status;
  }
};

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  const isOutOfStock = plant.availability === 'out-of-stock';

  return (
    <motion.div
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-earth-100 ${isOutOfStock ? 'opacity-80' : ''}`}
      whileHover={{ y: -4 }}
      onClick={() => onClick(plant)}
    >
      {/* Changed aspect ratio to square (aspect-square) to reduce height */}
      <div className="relative aspect-square overflow-hidden bg-earth-100">
        <motion.img
          layoutId={`image-${plant.id}`}
          src={plant.imageUrl}
          alt={plant.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale-[0.8]' : ''}`}
        />

        {/* Badges Container */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${getAvailabilityColor(plant.availability)} shadow-sm`}>
            {getAvailabilityLabel(plant.availability).toUpperCase()}
          </div>

          {plant.isNew && (
            <div className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border bg-blue-50 text-blue-700 border-blue-100 shadow-sm flex items-center gap-1">
              <Sparkles size={10} className="fill-current" />
              <span>NEW</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="mb-1">
          <h3 className="font-serif text-base text-leaf-900 font-medium group-hover:text-leaf-600 transition-colors line-clamp-1 leading-tight">{plant.name}</h3>
          <p className="text-[10px] text-earth-600 italic line-clamp-1">{plant.scientificName}</p>
        </div>

        <div className="flex gap-3 mt-2 text-leaf-700/80 text-[10px] font-medium">
          <div className="flex items-center gap-1">
            <Sun size={12} />
            <span className="capitalize">{plant.sunlight}</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets size={12} />
            <span className="capitalize">{plant.water}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlantCard;