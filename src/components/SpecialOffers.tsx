import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { SPECIAL_OFFERS } from '../data';

export default function SpecialOffers() {
  return (
    <section id="offers" className="bg-editorial-dark py-20 border-b border-editorial scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
            EXCLUSIVE HOSTEL CORNER
          </span>
          <h2 className="text-4xl font-light text-white font-serif italic mt-1 tracking-tight">
            Special Deals & Student Coupons
          </h2>
          <hr className="w-16 border-white/20 mx-auto mt-4" />
          <p className="text-xs text-white/50 mt-4 leading-relaxed font-semibold">
            We understand the hostel budget of young scholars! That is why we provide custom structured bulk combos specifically calculated for residents near Second Home Hostel.
          </p>
        </div>

        {/* Special Deals Cards Grid (Sharp layout rectangles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="offers-grid">
          {SPECIAL_OFFERS.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex gap-4 p-6 rounded-none bg-editorial-darker border border-editorial hover:border-editorial-strong transition-all duration-300"
              id={`offer-card-${offer.id}`}
            >
              {/* Feature Icon Column (Sharp box instead of round) */}
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-none bg-white/5 text-xl border border-white/15">
                <span className="select-none">{offer.icon}</span>
              </div>

              {/* Informational Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">{offer.title}</h3>
                  {index === 0 && (
                    <span className="bg-editorial-orange/10 text-editorial-orange border border-editorial-orange/20 text-[8px] font-extrabold tracking-widest px-2 py-0.5 rounded-none uppercase">
                      HOT
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/45 leading-relaxed font-semibold">
                  {offer.description}
                </p>
                <div className="pt-2 border-t border-editorial flex items-center space-x-1.5 text-[10px] font-bold text-editorial-gold font-mono">
                  <span className="border border-editorial-gold/20 px-1.5 py-0.2 text-[8px] select-none uppercase tracking-wider bg-editorial-gold/5">
                    TERMS
                  </span>
                  <span>{offer.terms}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instant Hostel Service Banner Ad - Lookbook Minimalist Advertisement */}
        <div className="mt-16 p-8 bg-editorial-darker border border-editorial flex flex-col md:flex-row items-center justify-between gap-6 rounded-none">
          <div className="flex items-center space-x-4 text-center md:text-left">
            <div className="px-3 py-2 bg-editorial-orange text-black font-serif italic font-extrabold text-base rounded-none select-none">
              Note
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Residing in Second Home Boys Hostel or Bherapul Sector?</h3>
              <p className="text-xs text-white/40 mt-1 font-semibold">State your exact room details to the dispatcher on WhatsApp for premium bespoke delivery coordination!</p>
            </div>
          </div>
          <button
            onClick={() => {
              const menuEl = document.getElementById('menu');
              if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center space-x-1 px-5 py-3.5 bg-white text-black font-extrabold rounded-none hover:bg-editorial-orange hover:text-black text-[10px] tracking-[0.2em] transition-all cursor-pointer uppercase border border-transparent"
          >
            <Zap size={11} className="fill-current mr-1" />
            <span>CLAIM COMBOS</span>
          </button>
        </div>

      </div>
    </section>
  );
}
