import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Award, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 bg-white border-t border-earth-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-leaf-600 font-medium tracking-wider text-sm uppercase mb-4 block">Our Story</span>
            <h2 className="font-serif text-4xl md:text-5xl text-leaf-900 mb-8 leading-tight">
              Rooted in community, <br />
              <span className="italic text-earth-600">growing with love.</span>
            </h2>

            <div className="prose prose-earth text-earth-800 mb-10">
              <p className="mb-4">
                Founded in 2010, Verdant & Vine began as a small backyard propagation project. What started with a few cuttings and a passion for greenery has blossomed into the city's premier destination for plant lovers.
              </p>
              <p>
                We believe that plants are more than just decor—they are living companions that bring calm, cleaner air, and a connection to nature into our busy lives. Our team of certified horticulturists hand-picks every specimen, ensuring that when you take a plant home, it's healthy, happy, and ready to thrive.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex gap-4">
                <div className="p-3 bg-leaf-50 rounded-xl text-leaf-700 h-fit">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-leaf-900 mb-1">Quality Guaranteed</h4>
                  <p className="text-sm text-earth-600">7-day health guarantee on all indoor plants.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 bg-leaf-50 rounded-xl text-leaf-700 h-fit">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-leaf-900 mb-1">Expert Advice</h4>
                  <p className="text-sm text-earth-600">Lifetime support from our gardening team.</p>
                </div>
              </div>
            </div>

            <div className="bg-earth-50 p-6 rounded-2xl border border-earth-200">
              <h3 className="font-serif font-bold text-leaf-900 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-leaf-600" /> Opening Hours
              </h3>
              <div className="space-y-2 text-sm text-earth-800">
                <div className="flex justify-between border-b border-earth-200 pb-2">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-earth-200 pb-2">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">11:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full min-h-[400px] bg-earth-100 rounded-3xl overflow-hidden shadow-lg border border-earth-200 relative group"
          >
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Lalbagh+Botanical+Garden,+Bengaluru,+Karnataka"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 z-10 bg-leaf-600 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 font-medium text-sm hover:bg-leaf-700 hover:shadow-lg transition-all cursor-pointer"
            >
              <MapPin size={16} />
              Visit us
            </a>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.4735775537525!2d77.58475831482167!3d12.941511990875727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15c191f6966f%3A0x6e788c3a9d7249a5!2sLalbagh%20Botanical%20Garden!5e0!3m2!1sen!2sin!4v1647844673628!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '500px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Verdant & Vine Location"
              className="w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;