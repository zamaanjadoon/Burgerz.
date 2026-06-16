import React from 'react';
import { Flame, Percent, Clock } from 'lucide-react';

export default function PromoTicker() {
  return (
    <div className="bg-editorial-orange text-black font-extrabold uppercase text-[10px] sm:text-[11px] tracking-[0.2em] py-4 border-b border-white/10 select-none overflow-hidden" id="promo-ticker">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-around items-center gap-4 text-center">
          <div className="flex items-center space-x-2.5">
            <Flame size={14} className="fill-current text-black animate-pulse" />
            <span>Free Delivery on Orders Above Rs. 1500</span>
          </div>
          <div className="hidden md:block text-black/20 font-light select-none">|</div>
          <div className="flex items-center space-x-2.5">
            <Percent size={14} className="stroke-[3] text-black" />
            <span>20% Off on First Order (WELCOME50)</span>
          </div>
          <div className="hidden md:block text-black/20 font-light select-none">|</div>
          <div className="flex items-center space-x-2.5">
            <Clock size={14} className="stroke-[3] text-black animate-spin" style={{ animationDuration: '6s' }} />
            <span>Delivery Within 30 Minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
