import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Plant, FilterState } from '../types';
import PlantCard from './PlantCard';

interface PlantCatalogProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const PlantCatalog: React.FC<PlantCatalogProps> = ({ plants, onSelectPlant, onRefresh, isRefreshing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    difficulty: 'all',
    sunlight: 'all',
    availability: 'all'
  });

  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || plant.category === filters.category;
      const matchesDifficulty = filters.difficulty === 'all' || plant.difficulty === filters.difficulty;
      const matchesSunlight = filters.sunlight === 'all' || plant.sunlight === filters.sunlight;
      
      const matchesAvailability = filters.availability === 'all' 
        ? true 
        : filters.availability === 'in-stock' 
          ? plant.availability === 'in-stock' || plant.availability === 'low-stock'
          : true;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesSunlight && matchesAvailability;
    });
  }, [searchTerm, filters, plants]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // Reduced from 0.1 for faster initial load
      }
    }
  };

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-6 py-20" aria-labelledby="catalog-heading">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 id="catalog-heading" className="font-serif text-4xl text-leaf-900">Our Collection</h2>
            <button 
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-full text-earth-400 hover:text-leaf-600 hover:bg-earth-100 transition-colors disabled:opacity-50"
                title="Refresh from Google Sheet"
            >
                <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-earth-600">Browse current inventory to plan your visit.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={18} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search plants..."
              aria-label="Search plants by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border border-earth-200 bg-white focus:outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 mb-10 pb-4 border-b border-earth-200 items-center" role="region" aria-label="Filter options">
        <div className="flex items-center gap-2 text-leaf-800 mr-2" aria-hidden="true">
            <SlidersHorizontal size={18} />
            <span className="font-medium">Filter:</span>
        </div>
        
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="bg-transparent border-none text-earth-700 font-medium focus:ring-2 focus:ring-leaf-500 rounded px-2 py-2 cursor-pointer hover:text-leaf-700"
          aria-label="Filter by plant category"
        >
          <option value="all">Type</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
          <option value="succulent">Succulents</option>
          <option value="flowering">Flowering</option>
        </select>

        <select
          value={filters.sunlight}
          onChange={(e) => setFilters(prev => ({ ...prev, sunlight: e.target.value }))}
          className="bg-transparent border-none text-earth-700 font-medium focus:ring-2 focus:ring-leaf-500 rounded px-2 py-2 cursor-pointer hover:text-leaf-700"
          aria-label="Filter by sunlight requirement"
        >
          <option value="all">Light</option>
          <option value="low">Low Light</option>
          <option value="medium">Medium Light</option>
          <option value="high">High Light</option>
        </select>

         <div className="flex items-center gap-2 ml-2">
            <input 
                type="checkbox" 
                id="avail-check"
                checked={filters.availability === 'in-stock'}
                onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.checked ? 'in-stock' : 'all' }))}
                className="accent-leaf-600 h-4 w-4 focus:ring-2 focus:ring-leaf-500 rounded"
            />
            <label htmlFor="avail-check" className="text-earth-700 font-medium text-sm cursor-pointer select-none">In Stock Only</label>
        </div>
        
        <button 
            onClick={() => {
                setFilters({ category: 'all', difficulty: 'all', sunlight: 'all', availability: 'all' });
                setSearchTerm('');
            }}
            className="ml-auto text-sm text-leaf-600 hover:underline focus:outline-none focus:ring-2 focus:ring-leaf-500 rounded px-2 py-1"
            aria-label="Reset all filters"
        >
            Reset
        </button>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        role="list"
        aria-label="Plant list"
      >
        {filteredPlants.length > 0 ? (
          filteredPlants.map(plant => (
            <motion.div key={plant.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} role="listitem">
              <PlantCard plant={plant} onClick={onSelectPlant} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-earth-500" role="status">
            <p className="text-xl">No plants found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default PlantCatalog;