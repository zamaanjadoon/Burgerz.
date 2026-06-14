import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, Instagram, Facebook, Youtube } from 'lucide-react';
import { BRAND_INFO } from '../data';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#050505] text-white/40 border-t border-white/10 pt-16 pb-8 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Core footer columns grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-none bg-editorial-orange text-black font-serif italic font-black text-base">
                F
              </div>
              <span className="text-lg font-black text-white tracking-widest uppercase">FAST BURGERZ</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-semibold">
              Serving premium flame-grilled smashed burger recipes, golden crispy fries, seasoned wings, and ice-cold sodas. Located directly near Second Home Hostel, Bharakahu, Islamabad.
            </p>
            
            {/* Social handles (Lookbook square items) */}
            <div className="flex items-center space-x-2 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/5 rounded-none text-white/60 hover:text-editorial-orange hover:border-editorial-orange/40 transition-colors">
                <Facebook size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/5 rounded-none text-white/60 hover:text-editorial-orange hover:border-editorial-orange/40 transition-colors">
                <Instagram size={14} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/5 rounded-none text-white/60 hover:text-editorial-orange hover:border-editorial-orange/40 transition-colors">
                <Youtube size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick navigation anchors */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em]">NAVIGATION REGISTRY</h4>
            <ul className="space-y-2 text-[10px] font-extrabold uppercase tracking-widest">
              {['Home', 'Fresh Menu', 'Special Deals', 'Delivery coverage', 'Verified Reviews', 'Contact Coordinates'].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      const sections = ['hero', 'menu', 'offers', 'delivery', 'reviews', 'contact'];
                      const el = document.getElementById(sections[idx]);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-editorial-orange transition-colors cursor-pointer text-left"
                  >
                    // {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact indices */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em]">COORDINATES DISPATCH</h4>
            <ul className="space-y-3.5 text-xs font-semibold">
              <li className="flex items-start space-x-2">
                <MapPin size={14} className="text-editorial-orange flex-shrink-0 mt-0.5" />
                <span className="font-mono text-[11px] text-white/50">{BRAND_INFO.address}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={14} className="text-editorial-orange flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-[11px] font-mono">
                  {BRAND_INFO.contactNumbers.map((num, i) => (
                    <a key={i} href={`tel:${num}`} className="hover:text-editorial-gold text-white/50 transition-colors">
                      {num}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={14} className="text-editorial-orange flex-shrink-0" />
                <span className="text-[11px] text-white/50">owner@fastburgerz.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em]">NEWSLETTER REGISTRY</h4>
            <p className="text-[11px] text-white/45 leading-relaxed font-semibold">
              Register your email coordinates to receive student vouchers, late-night combo offers, and exclusive discount codes directly.
            </p>

            {subscribed ? (
              <div className="border border-green-500/20 bg-green-500/5 text-green-400 p-2 text-center rounded-none text-[10px] font-extrabold uppercase tracking-widest">
                🎉 Subscribed Successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Coordinates"
                  className="w-full bg-black border border-white/10 text-white rounded-none px-3 py-2 text-xs focus:outline-none focus:border-editorial-orange/50 placeholder:text-white/20"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-editorial-orange text-black px-4 rounded-none transition-all flex items-center justify-center cursor-pointer border border-transparent"
                >
                  <Send size={11} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Divider and copy details */}
        <hr className="border-white/5 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 text-[9px] font-mono uppercase tracking-[0.2em] text-white/25">
          <p>© 2026 FAST BURGERZ ISLAMABAD. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-2">
            <span>DEVELOPED FOR</span>
            <strong className="text-white/50 font-black">{BRAND_INFO.owner}</strong>
            <span className="text-white/10">|</span>
            <span className="text-editorial-orange font-bold">BHARAKAHU SECTOR</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
