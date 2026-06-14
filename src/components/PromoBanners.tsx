import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, Clock, ArrowRight, Check } from 'lucide-react';
import { PROMOTION_BANNERS } from '../data';
import { Promotion } from '../types';

interface PromoBannersProps {
  onPromoClick: (promoCode: string) => void;
  onBrowseMenu: (category?: string) => void;
}

export default function PromoBanners({ onPromoClick, onBrowseMenu }: PromoBannersProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onPromoClick(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="w-full bg-black py-12 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Ad Title Section: Lookbook Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
              PROMOTIONAL BULLETIN • VOUCHERS
            </span>
            <h2 className="text-3xl font-light text-white font-serif italic tracking-tight">
              Today's Curated Deals & Campaigns
            </h2>
          </div>
          <p className="text-[9px] font-mono uppercase tracking-[0.1em] text-editorial-gold mt-2 md:mt-0 flex items-center bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-none">
            <Clock size={10} className="mr-1.5 animate-pulse text-editorial-orange" /> 
            Active dispatcher discounts applied on checkpack
          </p>
        </div>

        {/* Promo Cards Grid (Sharp Rectangular Lookbook Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="promo-grid">
          {PROMOTION_BANNERS.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative group rounded-none overflow-hidden border border-white/10 bg-neutral-950 flex flex-col h-[200px]"
              id={`promo-card-${promo.id}`}
            >
              {/* Background Cover Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={promo.bgImage}
                  alt={promo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-15 filter grayscale hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-neutral-950/70" />
              </div>

              {/* Dynamic Content */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="inline-block border border-editorial-orange text-editorial-orange text-[9px] font-extrabold tracking-[0.2em] px-2.5 py-0.5 rounded-none mb-3 uppercase select-none">
                      {promo.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                    {promo.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 max-w-sm font-semibold">
                    {promo.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                  {promo.code ? (
                    <button
                      onClick={() => handleCopyCode(promo.code!)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-none text-[10px] uppercase font-bold tracking-[0.1em] transition-all cursor-pointer border ${
                        copiedCode === promo.code
                          ? 'bg-green-600 text-white border-green-500'
                          : 'bg-black text-editorial-gold border-white/10 hover:border-editorial-gold/50'
                      }`}
                      title="Copy Coupon"
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check size={10} />
                          <span>COPIED CODE!</span>
                        </>
                      ) : (
                        <>
                          <Ticket size={10} className="text-editorial-orange" />
                          <span>Code: {promo.code}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">
                      AUTO APPLIED AT PACK
                    </span>
                  )}

                  <button
                    onClick={() => {
                      if (promo.id === 'p3') {
                        onBrowseMenu('burgers');
                      } else if (promo.id === 'p4') {
                        onBrowseMenu('wraps');
                      } else {
                        onBrowseMenu();
                      }
                    }}
                    className="flex items-center space-x-1.5 text-[10px] uppercase font-black tracking-[0.2em] text-white hover:text-editorial-orange transition-all ml-auto group/btn"
                  >
                    <span>Claim Offer</span>
                    <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
