import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Copy, Check, ShoppingBag, ArrowRight } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  trackCode: string;
  onClose: () => void;
  onTrackStatusClick: () => void;
}

export default function OrderSuccessModal({
  isOpen,
  trackCode,
  onClose,
  onTrackStatusClick,
}: OrderSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop mask overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-editorial-dark border border-white/10 p-8 shadow-2xl text-center rounded-none"
            >
              {/* Animated Success Checkmark Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="p-5 bg-green-500/10 border border-green-500/30 rounded-none text-green-400"
                >
                  <CheckCircle size={48} className="animate-pulse" />
                </motion.div>
              </div>

              {/* Title Section */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block">
                  ORDER TRANSMITTED SUCCESSFULLY
                </span>
                <h2 className="text-3xl font-light text-white font-serif italic tracking-tight">
                  Your burgers are booked!
                </h2>
                <hr className="w-12 border-white/20 mx-auto mt-4" />
              </div>

              {/* Message */}
              <p className="text-xs text-white/50 leading-relaxed font-semibold mb-6">
                Your order has been successfully submitted, and the cart is now empty.
              </p>

              {/* Tracking Code Container */}
              <div className="p-4 bg-editorial-darker border border-white/10 text-center space-y-2 font-mono mb-8 relative group">
                <span className="text-[9px] text-white/30 uppercase tracking-widest block">
                  Tracking Reference Code
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-base font-black text-editorial-orange tracking-wider">
                    {trackCode}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white text-black font-extrabold rounded-none text-[10px] tracking-[0.2em] transition-all cursor-pointer uppercase border border-transparent hover:bg-editorial-orange hover:text-black flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={12} />
                  <span>Order More Items / Continue Shopping</span>
                </button>
                
                <button
                  onClick={onTrackStatusClick}
                  className="w-full py-4 bg-editorial-darker border border-white/10 text-editorial-gold font-bold rounded-none text-[10px] tracking-[0.2em] transition-all cursor-pointer uppercase hover:text-white flex items-center justify-center space-x-2"
                >
                  <span>Track Live Order Status</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
