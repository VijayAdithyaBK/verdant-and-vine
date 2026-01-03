import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Leaf, Instagram, Facebook, Twitter, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import Hero from './components/Hero';
import PlantCatalog from './components/PlantCatalog';
import PlantDetails from './components/PlantDetails';
import Terrarium from './components/Terrarium';
import GrowthWidget from './components/GrowthWidget';
import About from './components/About';
import ComingSoonModal from './components/ComingSoonModal';
import { Plant, TerrariumState } from './types';
import { fetchPlants } from './services/plantDataService';

function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isTerrariumOpen, setIsTerrariumOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  // --- Data Fetching ---
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await fetchPlants();
      setPlants(data);
    } catch (e) {
      console.error("Failed to load plant data", e);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Game State Logic ---
  const [terrariumState, setTerrariumState] = useState<TerrariumState>(() => {
    // Load from local storage or initialize
    const saved = localStorage.getItem('verdant_terrarium');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved garden state, resetting.", e);
        return {};
      }
    }
    return {};
  });

  // Effect to ensure new plants fetched from sheet are added to game state if missing
  useEffect(() => {
    if (plants.length > 0) {
      setTerrariumState(prev => {
        const next = { ...prev };
        let changed = false;
        plants.forEach(p => {
          if (!next[p.id]) {
            next[p.id] = { level: 1, xp: 0, lastWatered: 0 };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [plants]);

  const handleWaterPlant = (plantId: string) => {
    setTerrariumState(prev => {
      const current = prev[plantId] || { level: 1, xp: 0, lastWatered: 0 };
      const nextLevelThreshold = current.level * 10;
      let newXp = current.xp + 5; // Gain 5 XP per water
      let newLevel = current.level;

      if (newXp >= nextLevelThreshold) {
        newLevel += 1;
        newXp = newXp - nextLevelThreshold;
      }

      const newState = {
        ...prev,
        [plantId]: {
          ...current,
          level: newLevel,
          xp: newXp,
          lastWatered: Date.now()
        }
      };

      localStorage.setItem('verdant_terrarium', JSON.stringify(newState));
      return newState;
    });
  };
  // ------------------------

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin text-leaf-600" size={40} />
        <p className="text-leaf-800 font-serif animate-pulse">Gathering seeds...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 font-sans text-leaf-900 selection:bg-leaf-200 selection:text-leaf-900">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-leaf-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-earth-50/80 backdrop-blur-md border-b border-earth-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-2 bg-leaf-600 text-white rounded-xl rounded-tr-none">
              <Leaf size={24} />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-leaf-900">Verdant & Vine</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-earth-800">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-leaf-600 transition-colors">Home</button>
            <button onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-leaf-600 transition-colors">Catalog</button>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-leaf-600 transition-colors">About</button>
            <button
              onClick={() => setIsTerrariumOpen(true)}
              className="px-5 py-2.5 bg-leaf-800 text-white rounded-full hover:bg-leaf-900 transition-colors"
            >
              My Garden
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Hero />
        <PlantCatalog
          plants={plants}
          onSelectPlant={setSelectedPlant}
          onRefresh={() => loadData(true)}
          isRefreshing={refreshing}
        />
        <About />

        {/* Social Connect Section */}
        <section className="bg-leaf-800 text-earth-100 py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl mb-6 text-white">Let's grow together</h2>
            <p className="text-lg mb-10 text-leaf-100/80">Connect with us on social media for daily plant inspiration, care tips, and behind-the-scenes content.</p>
            <div className="flex justify-center gap-6">
              <a
                href="https://instagram.com/verdantandvine"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-leaf-900/50 border border-leaf-600 rounded-full hover:bg-leaf-700 hover:border-leaf-500 transition-all group"
              >
                <Instagram size={24} className="text-leaf-300 group-hover:text-white transition-colors" />
                <span className="text-white font-medium">@verdantandvine</span>
              </a>
              <a
                href="https://facebook.com/verdantandvine"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-leaf-900/50 border border-leaf-600 rounded-full hover:bg-leaf-700 hover:border-leaf-500 transition-all group"
              >
                <Facebook size={24} className="text-leaf-300 group-hover:text-white transition-colors" />
                <span className="text-white font-medium">Verdant & Vine</span>
              </a>
              <a
                href="https://twitter.com/verdantandvine"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-leaf-900/50 border border-leaf-600 rounded-full hover:bg-leaf-700 hover:border-leaf-500 transition-all group"
              >
                <Twitter size={24} className="text-leaf-300 group-hover:text-white transition-colors" />
                <span className="text-white font-medium">@verdantandvine</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-leaf-900 text-earth-200 py-16 px-6 border-t border-leaf-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Leaf size={24} className="text-leaf-300" />
              <span className="font-serif text-xl font-bold text-white">Verdant & Vine</span>
            </div>
            <p className="text-sm leading-relaxed text-leaf-100/60">
              Cultivating joy through nature. We help you find the perfect plants for your space and lifestyle.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg text-white mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors text-left">Indoor Plants</button></li>
              <li><button onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors text-left">Outdoor Garden</button></li>
              <li><button onClick={() => setIsComingSoonOpen(true)} className="hover:text-white transition-colors text-left">Pots & Accessories</button></li>
              <li><button onClick={() => setIsComingSoonOpen(true)} className="hover:text-white transition-colors text-left">Gift Cards</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-white mb-6">Visit Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 opacity-70" />
                <span>Lalbagh Botanical Garden,<br />Mavalli, Bengaluru, KA 560004</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="opacity-70" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="opacity-70" />
                <span>hello@verdantvine.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-white mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-leaf-800 rounded-full hover:bg-leaf-700 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-leaf-800 rounded-full hover:bg-leaf-700 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="p-2 bg-leaf-800 rounded-full hover:bg-leaf-700 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-leaf-800 text-center text-xs text-leaf-100/40">
          © 2026 Verdant & Vine. All rights reserved. Designed with nature in mind.
        </div>
      </footer>

      {/* Modals & Widgets */}
      <PlantDetails
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onWater={handleWaterPlant}
      />

      <Terrarium
        isOpen={isTerrariumOpen}
        onClose={() => setIsTerrariumOpen(false)}
        gameState={terrariumState}
        onWater={handleWaterPlant}
        allPlants={plants}
      />

      <GrowthWidget
        onClick={() => setIsTerrariumOpen(true)}
        gameState={terrariumState}
      />

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
      />
    </div>
  );
}

export default App;