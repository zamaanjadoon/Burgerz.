import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { Order } from '../types';
import { lookupOrderByTrack } from '../api';

interface OrderTrackerProps {
  orders: Order[];
}

export default function OrderTracker({ orders }: OrderTrackerProps) {
  const [trackCode, setTrackCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanedCode = trackCode.trim().toUpperCase();
    if (!cleanedCode) return;

    // Live lookup from backend
    try {
      const live = await lookupOrderByTrack(cleanedCode);
      if (live) {
        setSearchedOrder(live);
        return;
      }
    } catch {
      // fall back to local search
    }

    const matched = orders.find(
      (o) => o.trackCode.toUpperCase() === cleanedCode || o.id.toUpperCase() === cleanedCode
    );
    setSearchedOrder(matched || null);
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Cooking': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  const currentStep = searchedOrder ? getStatusStep(searchedOrder.status) : 0;

  return (
    <section id="tracking" className="bg-editorial-dark py-16 border-b border-white/10 scroll-mt-20 editorial-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner header elements */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
            DISPATCH EXPEDITIONS
          </span>
          <h2 className="text-3xl font-light text-white font-serif italic mt-1 tracking-tight">
            Online Prep & Courier Status
          </h2>
          <hr className="w-16 border-white/20 mx-auto mt-4" />
        </div>

        {/* Track Submission form (Sharp Editorial inputs) */}
        <div className="max-w-xl mx-auto bg-editorial-darker p-6 rounded-none border border-editorial shadow-xl space-y-4">
          <form onSubmit={handleTrackSubmit} className="flex gap-1.5">
            <input
              type="text"
              value={trackCode}
              onChange={(e) => setTrackCode(e.target.value)}
              placeholder="Enter Tracker Code (e.g. FB-123456 or ORD-xxxx)"
              className="flex-1 bg-editorial-dark text-editorial-cream px-4 py-3 rounded-none border border-editorial focus:outline-none focus:border-editorial-orange/50 text-xs font-mono uppercase tracking-wide placeholder:text-white/20"
              required
            />
            <button
              type="submit"
              className="bg-white hover:bg-editorial-orange text-black px-5 font-extrabold text-[10px] tracking-widest uppercase rounded-none transition-all flex items-center space-x-1.5 cursor-pointer border border-transparent"
            >
              <Search size={12} />
              <span>TRACK</span>
            </button>
          </form>

          {/* Track Results representation */}
          <AnimatePresence mode="popLayout">
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pt-4 border-t border-editorial"
                id="tracker-result-panel"
              >
                {!searchedOrder ? (
                  <div className="text-center py-4 text-[10px] uppercase tracking-wider font-extrabold text-white/40 font-mono">
                    ❌ No matches. Validate local storage track references.
                  </div>
                ) : (
                  <div className="space-y-6" id="tracker-success-details">
                    
                    {/* Tiny header fields (Lookbook metadata rows) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-editorial-dark p-3 rounded-none border border-editorial text-[9px] font-mono tracking-widest uppercase">
                      <div>
                        <span className="text-white/45">INDEX NO //</span>
                        <h4 className="text-[11px] font-extrabold text-white mt-0.5">{searchedOrder.trackCode}</h4>
                      </div>
                      <div>
                        <span className="text-white/45">PAY METHOD //</span>
                        <h4 className="text-[11px] font-extrabold text-white mt-0.5">{searchedOrder.paymentMethod}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-white/45">STAGE STATUS //</span>
                        <span className={`block text-[11px] font-extrabold uppercase mt-0.5 ${
                          searchedOrder.status === 'Cancelled' ? 'text-red-500' : 'text-editorial-orange'
                        }`}>
                          {searchedOrder.status}
                        </span>
                      </div>
                    </div>

                    {/* Step wizard tracks with flat rectangular indicators instead of pills */}
                    {searchedOrder.status === 'Cancelled' ? (
                      <div className="p-4 border border-rose-500/15 bg-rose-500/5 text-center text-xs text-rose-400 font-extrabold uppercase tracking-widest">
                        🚫 ORDER REJECTED/CANCELLED. CALL 03409631937.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative flex justify-between items-center text-center">
                          {/* Progress connection bar */}
                          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-editorial-dark z-0">
                            <div
                              className="h-full bg-editorial-orange transition-all duration-500"
                              style={{ width: `${Math.max(0, (currentStep - 1) * 25)}%` }}
                            />
                          </div>


                          {/* Step Nodes as sharp squares */}
                          {([
                            { val: 1, icon: '📝', label: 'Pending' },
                            { val: 2, icon: '👍', label: 'Confirmed' },
                            { val: 3, icon: '👨‍🍳', label: 'Cooking' },
                            { val: 4, icon: '🏍️', label: 'On Way' },
                            { val: 5, icon: '📦', label: 'Delivered' },
                          ]).map((node) => {
                            const isDone = node.val <= currentStep;
                            const isCurrent = node.val === currentStep;

                            return (
                              <div key={node.val} className="relative z-10 flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-none border flex items-center justify-center text-[10px] font-bold transition-all duration-350 select-none ${
                                  isDone
                                    ? 'bg-editorial-orange border-editorial-orange text-black font-extrabold scale-105'
                                    : 'bg-editorial-dark border border-editorial text-white/30'
                                }`}>
                                  {isDone && node.val < currentStep ? '✓' : node.icon}
                                </div>
                                <span className={`text-[8px] font-extrabold uppercase tracking-widest mt-2 ${
                                  isCurrent ? 'text-editorial-gold font-extrabold scale-102 font-mono' : 'text-white/20'
                                }`}>
                                  {node.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order info details breakdown */}
                        <div className="bg-editorial-dark p-4 rounded-none border border-editorial text-[10px] font-mono uppercase tracking-wider space-y-1.5 text-white/55">
                          <p>📍 <strong className="text-white">DESTINATION //</strong> {searchedOrder.deliveryAddress}</p>
                          <p>🍱 <strong className="text-white">COMMODITY //</strong> {searchedOrder.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                          <p>💳 <strong className="text-white">AMOUNT PAYABLE //</strong> <strong className="text-editorial-orange font-bold">Rs. {searchedOrder.total}</strong></p>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
