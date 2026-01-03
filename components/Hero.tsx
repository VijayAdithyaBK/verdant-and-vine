import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-leaf-200 rounded-full mix-blend-multiply filter blur-3xl will-change-transform"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-earth-200 rounded-full mix-blend-multiply filter blur-3xl will-change-transform"
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* New Year Sparkles */}
        <motion.div
          className="absolute top-1/3 left-1/4 text-yellow-400/40"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={48} />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-leaf-100/80 backdrop-blur-sm text-leaf-900 text-sm font-semibold tracking-wide mb-6 border border-leaf-200">
            <Sparkles size={14} className="text-leaf-600" />
            Botanical Collection 2026
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-leaf-900 mb-8 leading-tight">
            New year, <br />
            <span className="italic text-leaf-600">new growth.</span>
          </h1>
          <p className="text-lg md:text-xl text-earth-800 max-w-2xl mx-auto mb-10 leading-relaxed">
            Welcome to 2026. Cultivate calm in the new year with our curated selection of rare foliage and resilient classics.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-leaf-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-leaf-800 transition-colors"
            onClick={() => {
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Plants
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-leaf-800/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;