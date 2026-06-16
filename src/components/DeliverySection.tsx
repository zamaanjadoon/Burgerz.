import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Bike, DollarSign, Smartphone } from 'lucide-react';
import { BRAND_INFO } from '../data';

export default function DeliverySection() {
  const coverageAreas = [
    'Barakah (Bharakahu)',
    'G-13 Sector',
    'G-14 Sector',
    'Golra Sharif',
    'E-11 Sector',
    'F-11 Sector',
    'Second Home Boys Hostel (Immediate)',
    'Near Soneri Bank (Immediate)',
    'Bherapul Street Blocks',
  ];

  return (
    <section id="delivery" className="bg-editorial-dark py-20 scroll-mt-20 border-b border-editorial editorial-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header content block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
            LOGISTICS & FLEET STATUS
          </span>
          <h2 className="text-4xl font-light text-white font-serif italic mt-1 tracking-tight">
            Delivery Estimates & Coverage
          </h2>
          <hr className="w-16 border-editorial mx-auto mt-4" />
        </div>

        {/* Info modules grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Key Deliverables Left Side */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
              Delivered Hot and Fresh in <span className="text-editorial-orange">20-40 Minutes</span>
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-semibold">
              Cold food is a standard lookbook deal breaker! That is why we run a dedicated team of dispatchers who are experts in navigating the stairs and corridors of Second Home Boys Hostel and the wider Soneri Bank neighborhood. Every order leaves our hot grills in thermally sealed insulated packaging.
            </p>

            {/* Sharp boxes instead of rounded pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-none bg-editorial-darker border border-editorial flex flex-col items-center text-center">
                <div className="p-2 bg-white/5 text-editorial-orange mb-3 border border-editorial">
                  <Bike size={18} className="animate-pulse" />
                </div>
                <h4 className="text-[10px] font-extrabold text-white uppercase tracking-wider">Fast Courier</h4>
                <p className="text-[9px] font-mono text-white/45 mt-1">20–40 Mins dispatch</p>
              </div>

              <div className="p-4 rounded-none bg-editorial-darker border border-editorial flex flex-col items-center text-center">
                <div className="p-2 bg-white/5 text-editorial-orange mb-3 border border-editorial">
                  <DollarSign size={18} />
                </div>
                <h4 className="text-[10px] font-extrabold text-white uppercase tracking-wider">COD Dispatch</h4>
                <p className="text-[9px] font-mono text-white/45 mt-1">Pay on threshold</p>
              </div>

              <div className="p-4 rounded-none bg-editorial-darker border border-editorial flex flex-col items-center text-center">
                <div className="p-2 bg-white/5 text-editorial-orange mb-3 border border-editorial">
                  <Smartphone size={18} />
                </div>
                <h4 className="text-[10px] font-extrabold text-white uppercase tracking-wider">Digi-Pay</h4>
                <p className="text-[9px] font-mono text-white/45 mt-1">JazzCash & Easypaisa</p>
              </div>
            </div>

            {/* Quick checkout instruction alerts (Lookbook table borders) */}
            <div className="p-5 rounded-none bg-editorial-darker border border-editorial space-y-3.5">
              <h4 className="text-[10px] font-extrabold text-editorial-orange uppercase tracking-[0.2em]">DELIVERY PRICING REGISTRY:</h4>
              <ul className="text-xs text-white/70 space-y-2 list-none font-semibold">
                <li className="flex items-center">
                  <CheckCircle2 size={12} className="text-editorial-gold mr-2.5 flex-shrink-0" />
                  <span>Free doorstep transport on cart values above Rs. {BRAND_INFO.freeDeliveryThreshold}!</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={12} className="text-editorial-gold mr-2.5 flex-shrink-0" />
                  <span>Standard base tariff of Rs. {BRAND_INFO.deliveryCharges} for smaller requests.</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 size={12} className="text-editorial-gold mr-2.5 flex-shrink-0" />
                  <span>Minimum placement boundary value requires Rs. {BRAND_INFO.minDeliveryOrder}.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Coverage maps & boundaries list right side */}
          <div className="p-6 rounded-none bg-editorial-darker border border-editorial space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest pb-3 border-b border-editorial flex items-center justify-between">
              <span>Coverage Boundaries (Islamabad)</span>
              <span className="text-[9px] font-mono text-editorial-orange">● BHARAKAHU CENTRAL</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="coverage-grid">
              {coverageAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-white/60 bg-editorial-dark p-3 rounded-none border border-editorial"
                >
                  <span className="h-1.5 w-1.5 bg-editorial-orange" />
                  <span>{area}</span>
                </div>
              ))}
            </div>

            {/* Digital Transfers guide and logos */}
            <div className="pt-4 border-t border-editorial space-y-3.5">
              <h4 className="text-[10px] font-extrabold text-white uppercase tracking-[0.18em]">M-Wallet Mobile Transfers</h4>
              <p className="text-[11px] text-white/45 leading-relaxed font-semibold">
                Transfer securely to M. D. M. Irfan’s official phone credentials during order checkout. Send Easypaisa or JazzCash in seconds and present transmission snapshot to courier upon arrival.
              </p>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-green-600/5 border border-green-500/15 p-2.5 text-center font-mono text-[9px] font-black tracking-wider text-green-400">
                  Easypaisa: 03409631937
                </div>
                <div className="bg-red-600/5 border border-red-500/15 p-2.5 text-center font-mono text-[9px] font-black tracking-wider text-red-500">
                  JazzCash: 0309-5040097
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
