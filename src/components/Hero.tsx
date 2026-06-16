import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Phone, Flame, Truck, ShieldCheck, HeartPulse } from 'lucide-react';
import { BRAND_INFO } from '../data';

interface HeroProps {
  onOrderOnlineClick: () => void;
  onWhatsAppOrderClick: () => void;
}

export default function Hero({ onOrderOnlineClick, onWhatsAppOrderClick }: HeroProps) {
  const handleCallNow = () => {
    window.location.href = `tel:${BRAND_INFO.contactNumbers[0]}`;
  };

  return (
    <section id="hero" className="relative text-white overflow-hidden bg-editorial-dark border-b border-white/10 py-16 md:py-28 editorial-grid">
      
      {/* Editorial aesthetic fine grid layout lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Hero Left Column: Editorial Display Typography & Fine Labels */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div>
              {/* Gold Lookbook Tagline */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-block px-3 py-1 border border-editorial-gold text-editorial-gold text-[10px] font-extrabold uppercase tracking-[0.2em] mb-6"
                id="hero-delivery-badge"
              >
                FAST DELIVERY COURIERS • 20 TO 40 MINS • BHARAKAHU AREA
              </motion.div>

              {/* Classic Serif Headings with Intense Contrasts */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tighter text-white font-serif"
                id="hero-heading"
              >
                Fresh Burgers <br/>
                <span className="text-editorial-orange font-black not-italic block mt-1 tracking-tight">
                  DELIVERED FAST
                </span>
                Across Islamabad.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-gray-400 max-w-lg mt-6 leading-relaxed font-semibold font-sans"
                id="hero-description"
              >
                Fresh, Hot & Delicious Burgers Delivered To Your Doorstep. Premium smashed beef burgers, loaded fries, crispy wings, and refreshing drinks—grilled to order.
              </motion.p>
            </div>

            {/* Micro Metadata Points (replaces bubble counters) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 border-t border-b border-white/10 py-4 max-w-md font-mono text-[9px] uppercase tracking-[0.15em] text-white/50"
              id="hero-benefits"
            >
              <div>
                <span className="text-editorial-orange font-bold block mb-0.5">Origin</span>
                <span className="text-white font-black">100% Halal Meat</span>
              </div>
              <div>
                <span className="text-editorial-orange font-bold block mb-0.5">Method</span>
                <span className="text-white font-black">Smashed & Seared</span>
              </div>
              <div>
                <span className="text-editorial-orange font-bold block mb-0.5">Payment</span>
                <span className="text-white font-black">Cash / Jazz / Easy</span>
              </div>
            </motion.div>

            {/* Clean rectangular lookbook buttons with crisp tracking */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-2"
              id="hero-actions"
            >
              {/* Online Ordering CTA */}
              <button
                onClick={onOrderOnlineClick}
                className="px-6 py-4 bg-editorial-orange text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all rounded-none cursor-pointer"
                id="hero-btn-online"
              >
                Order Now
              </button>

              {/* View Menu CTA */}
              <button
                onClick={onOrderOnlineClick}
                className="px-6 py-4 border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all rounded-none cursor-pointer"
                id="hero-btn-menu"
              >
                View Menu
              </button>

              {/* Call Dispatcher Hotkey */}
              <button
                onClick={handleCallNow}
                className="px-6 py-4 bg-editorial-darker border border-white/15 text-editorial-gold font-bold text-xs uppercase tracking-[0.2em] hover:text-white transition-all rounded-none cursor-pointer"
                id="hero-btn-call"
              >
                Call: 0347-5177174
              </button>
            </motion.div>
          </div>

          {/* Hero Right Column: Pristine Lookbook Image Block */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.02, 
                y: -6,
                boxShadow: "0 30px 60px -15px rgba(255, 107, 0, 0.2)"
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-[360px] aspect-[4/5] bg-[#0c0c0c] p-3 border border-white/10 rounded-none shadow-2xl cursor-pointer"
              id="hero-image-wrapper"
            >
              {/* Image Container with Editorial Frame */}
              <div className="relative w-full h-full bg-black overflow-hidden border border-white/5 group">
                <div className="absolute inset-0 pointer-events-none editorial-anim-glow" aria-hidden />
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80"
                  alt="FAST Burgerz Special Smashed"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  id="hero-burger-img"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10 opacity-30" />

                {/* Lookbook design overlay badge inside image */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/95 backdrop-blur-md border border-white/10 p-3 flex justify-between items-center text-[10px] font-mono tracking-[0.1em]">
                  <span className="text-white/40">INDEX CODE // FB01</span>
                  
                  {/* Glowing, shifting text animation */}
                  <motion.span
                    animate={{ 
                      color: ["#ff6b00", "#ffb300", "#ff6b00"],
                      textShadow: [
                        "0 0 2px rgba(255, 107, 0, 0.1)",
                        "0 0 10px rgba(255, 107, 0, 0.5)",
                        "0 0 2px rgba(255, 107, 0, 0.1)"
                      ]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="font-extrabold tracking-wider"
                  >
                    SMASHED BEEF ORIGINAL
                  </motion.span>
                </div>

                {/* Sheen highlight */}
                <div className="absolute top-0 left-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 editorial-anim-sheen" aria-hidden />
              </div>

              {/* Minimal coordinates accent on extreme edges for lookbook layout context */}
              <div className="absolute -top-3 -right-3 text-[9px] font-mono text-white/30 tracking-widest pointer-events-none select-none">
                33.7250° N, 73.1750° E
              </div>
              <div className="absolute -bottom-3 -left-3 text-[9px] font-mono text-white/30 tracking-widest pointer-events-none select-none">
                BHARAKAHU HUB
              </div>
            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
}
