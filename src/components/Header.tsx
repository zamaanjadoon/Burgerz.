import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, Menu, X, Phone, Shield, User, Save, CheckCircle } from 'lucide-react';
import { BRAND_INFO } from '../data';

interface HeaderProps {
  cartCount: number;
  openCart: () => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Header({
  cartCount,
  openCart,
  favoritesCount,
  showFavoritesOnly,
  setShowFavoritesOnly,
  isAdminMode,
  setIsAdminMode,
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fb_user_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfileName(parsed.name || '');
      setProfilePhone(parsed.phone || '');
      setProfileAddress(parsed.address || '');
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = { name: profileName, phone: profilePhone, address: profileAddress };
    localStorage.setItem('fb_user_profile', JSON.stringify(profile));
    setSaveSuccess(true);
    
    // Notify shopping cart of dynamic profile update
    window.dispatchEvent(new Event('fb_profile_updated'));

    setTimeout(() => {
      setSaveSuccess(false);
      setIsProfileOpen(false);
    }, 1200);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'offers', label: 'Deals' },
    { id: 'delivery', label: 'Delivery Areas' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowFavoritesOnly(false);
    setIsAdminMode(false);
    setMobileMenuOpen(false);
    
    // Smooth scroll with precise offset for lookbook header
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'bg-editorial-darker/95 backdrop-blur-lg border-b border-editorial-orange/20 shadow-lg shadow-black/90 py-1' 
        : 'bg-editorial-darker/80 backdrop-blur-md border-b border-white/10 py-3'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled ? 'h-11' : 'h-16'}`}>
          
          {/* Brand Logo Section: Editorial Monospaced + Serif pairing */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="flex cursor-pointer items-center space-x-3 group"
          >
            <div className={`bg-editorial-orange flex items-center justify-center rounded-none font-serif italic text-black font-black transition-all duration-500 group-hover:rotate-6 ${
              scrolled ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-base'
            }`}>
              F
            </div>
            <div>
              <div className="flex items-center tracking-tighter">
                <span className={`font-black text-editorial-orange transition-all duration-500 ${scrolled ? 'text-lg' : 'text-xl'}`}>FAST</span>
                <span className={`font-light text-white tracking-[0.1em] ml-1 transition-all duration-500 ${scrolled ? 'text-lg' : 'text-xl'}`}>BURGERZ</span>
              </div>
              <p className={`font-mono tracking-[0.2em] text-white/40 uppercase transition-all duration-500 overflow-hidden ${
                scrolled ? 'text-[0px] h-0 opacity-0' : 'text-[9px] h-3 opacity-100'
              }`}>Bharakahu, Islamabad</p>
            </div>
          </div>

          {/* Desktop Navigation: Geometric tracked Lookbook text */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all ${
                  activeSection === item.id && !isAdminMode && !showFavoritesOnly
                    ? 'text-editorial-orange border-b border-editorial-orange'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Utilities (Sharp square buttons) */}
          <div className="flex items-center space-x-2">
            {/* Phone Quick Link (Editorial Call Button) */}
            <a 
              href={`tel:${BRAND_INFO.contactNumbers[0]}`}
              className={`hidden lg:flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.15em] text-editorial-gold border border-white/10 transition-all duration-500 hover:bg-white/5 rounded-none ${
                scrolled ? 'px-3 py-1.5' : 'px-4 py-2'
              }`}
            >
              <Phone size={12} className="text-editorial-orange animate-pulse" />
              <span>Call: 0347-5177174</span>
            </a>

            {/* User Account Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 rounded-none bg-editorial-darker/50 text-white/60 border border-white/10 hover:text-white hover:border-white/25 transition-all duration-300"
              title="User Account profile"
              id="header-profile-btn"
            >
              <User size={16} />
            </button>

            {/* Favorites Toggle List (Editorial Heart Layout) */}
            <button
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                setIsAdminMode(false);
              }}
              className={`relative p-2 rounded-none transition-all duration-300 border ${
                showFavoritesOnly
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-editorial-darker/50 text-white/60 border-white/10 hover:text-white hover:border-white/25'
              }`}
              title="Show Favorites"
              id="favorites-button"
            >
              <Heart size={16} className={showFavoritesOnly ? 'fill-rose-500 text-rose-400' : ''} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-rose-600 text-[8px] font-black text-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-none bg-editorial-darker/50 text-white/60 border border-white/10 hover:text-white hover:border-white/25 transition-all duration-300"
              title="View Basket"
              id="cart-button"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-editorial-orange text-[8px] font-black text-black">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Backoffice Option */}
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setShowFavoritesOnly(false);
              }}
              className={`p-2 rounded-none transition-all duration-300 border ${
                isAdminMode
                  ? 'bg-editorial-gold text-black border-editorial-gold font-bold'
                  : 'bg-editorial-darker/50 text-white/60 border-white/10 hover:text-editorial-gold hover:border-editorial-gold/40'
              }`}
              title="Admin Backoffice"
              id="admin-button"
            >
              <Shield size={16} />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-none bg-editorial-darker/50 border border-white/10 text-white/80 hover:text-white md:hidden transition-all"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-neutral-950 border-t border-white/10"
            id="mobile-drawer"
          >
            <div className="space-y-1 px-4 py-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-none transition-all ${
                    activeSection === item.id && !isAdminMode && !showFavoritesOnly
                      ? 'text-editorial-orange bg-white/5 border-l-2 border-editorial-orange'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <hr className="border-white/5 my-2" />

              {/* Mobile Phone Quick Action */}
              <a 
                href={`tel:${BRAND_INFO.contactNumbers[0]}`}
                className="flex items-center justify-between w-full px-3 py-2.5 bg-white/5 text-editorial-gold rounded-none border border-white/10 text-xs font-extrabold uppercase tracking-[0.1em]"
              >
                <div className="flex items-center space-x-2">
                  <Phone size={12} className="text-editorial-orange animate-pulse" />
                  <span>Call Dispatcher</span>
                </div>
                <span>0347-5177174</span>
              </a>

              {/* Mobile Profile Trigger */}
              <button
                onClick={() => {
                  setIsProfileOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] rounded-none border border-white/10 bg-black text-white/60 hover:text-white"
              >
                <User size={12} />
                <span>My Profile Account</span>
              </button>

              {/* Admin Button on Mobile */}
              <button
                onClick={() => {
                  setIsAdminMode(!isAdminMode);
                  setShowFavoritesOnly(false);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-[0.1em] rounded-none border transition-all ${
                  isAdminMode
                    ? 'bg-editorial-gold text-black border-editorial-gold'
                    : 'bg-black text-white/60 border-white/10 hover:text-white'
                }`}
              >
                <Shield size={12} />
                <span>{isAdminMode ? 'Exit Admin Mode' : 'Open Admin Panel'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Account Edit Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-xs"
              id="profile-overlay-mask"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: '-45%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, y: '-45%' }}
              transition={{ duration: 0.25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] w-[92%] max-w-md bg-editorial-dark border border-white/10 p-6 shadow-2xl text-left"
              id="profile-modal"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="text-editorial-orange" size={18} />
                  <span className="text-sm font-extrabold text-white tracking-[0.2em] uppercase">USER ACCOUNT PROFILE</span>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1 rounded-none hover:bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                  id="profile-modal-close"
                >
                  <X size={14} />
                </button>
              </div>

              {saveSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                  <CheckCircle size={36} className="text-green-400 animate-bounce" />
                  <h4 className="text-xs uppercase tracking-widest font-extrabold text-green-400">Profile Saved!</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed font-semibold">
                    Your details will now auto-fill checkout fields automatically!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <p className="text-[10px] text-white/40 leading-relaxed font-semibold">
                    Set up your contact and delivery coordinates for fast checkout. Details are stored securely on your local device.
                  </p>
                  
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g. Ali Khan"
                      className="w-full bg-editorial-darker text-white rounded-none border border-white/10 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">Phone Coordinate</label>
                    <input
                      type="tel"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="e.g. 03475177174"
                      className="w-full bg-editorial-darker text-white rounded-none border border-white/10 px-3 py-2 text-xs font-mono focus:outline-none focus:border-editorial-orange/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">Default Delivery Address</label>
                    <textarea
                      required
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="e.g. Hostel 4, G-13/2, Islamabad"
                      rows={3}
                      className="w-full bg-editorial-darker text-white rounded-none border border-white/10 p-3 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50 placeholder:text-white/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-black font-extrabold rounded-none text-[10px] tracking-[0.2em] transition-all cursor-pointer uppercase border border-transparent hover:bg-editorial-orange flex items-center justify-center space-x-2"
                  >
                    <Save size={12} />
                    <span>SAVE PROFILE DETAILS</span>
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
