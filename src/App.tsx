import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';

import MenuSection from './components/MenuSection';
import Reviews from './components/Reviews';
import DeliverySection from './components/DeliverySection';
import Contact from './components/Contact';
import ShoppingCart from './components/ShoppingCart';
import OrderTracker from './components/OrderTracker';
import OrderSuccessModal from './components/OrderSuccessModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import PromoTicker from './components/PromoTicker';
import StatsSection from './components/StatsSection';
import FAQSection from './components/FAQSection';


import { Product, CartItem, Order, Review } from './types';
import { BRAND_INFO, INITIAL_PRODUCTS, INITIAL_REVIEWS } from './data';

import { createOrder } from './api';

import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import AuthModal from './components/AuthModal';

export default function App() {
  // --- Persistent unified storage states ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fb_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('fb_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('fb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('fb_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('fb_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });



  // Whether we successfully loaded live data from backend.
  const [liveReady, setLiveReady] = useState(false);

  // Best-effort local fallback (when backend is offline).
  const [ordersLoadedFromBackend, setOrdersLoadedFromBackend] = useState(false);

  // Live-load flag used to avoid overwriting user actions before initial sync.
  const [initialSyncDone, setInitialSyncDone] = useState(false);


  // --- Interaction control parameters ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeOrderSuccessCode, setActiveOrderSuccessCode] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [preselectedCategory, setPreselectedCategory] = useState<string>('all');
  
  // Custom Visual Toast alert state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Push Notification Simulation
  const [pushNotification, setPushNotification] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const alerts = [
      "Chef Irfan is preparing a Wahshi Zinger Burger right now! 🍔",
      "Special Deal: Use code HOSTELDEAL for Rs. 100 off orders over Rs. 1000! 🏷️",
      "A dispatcher just departed to Bherapul Street with a fresh, steaming order! 🏍️",
      "Smashed Beef Original burger is currently trending in Bharakahu! 🔥",
      "Save 20% on your first order with coupon code WELCOME50! 🎉",
      "Chef Irfan just finished grilling a double smash beef platter! 🍳",
      "Delivery update: Dispatcher matched for hostel boys stairs! 🏃‍♂️",
    ];
    
    const triggerRandomAlert = () => {
      const idx = Math.floor(Math.random() * alerts.length);
      setPushNotification(alerts[idx]);
      setTimeout(() => {
        setPushNotification(null);
      }, 4000);
    };

    // Trigger alerts periodically to mock mobile push notifications
    const firstTimer = setTimeout(triggerRandomAlert, 6000);
    const interval = setInterval(triggerRandomAlert, 25000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  // --- State synchronizations (Local Storage Writes) ---
  // Keep cart/favorites locally.
  useEffect(() => {
    localStorage.setItem('fb_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('fb_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Keep products/reviews locally as fallback only.
  // If backend is live, we overwrite these shortly after mount.
  useEffect(() => {
    if (!liveReady) localStorage.setItem('fb_products', JSON.stringify(products));
  }, [products, liveReady]);

  useEffect(() => {
    if (!liveReady) localStorage.setItem('fb_reviews', JSON.stringify(reviews));
  }, [reviews, liveReady]);

  // Orders: backend-only (per your choice). Keep local copy only as temporary UI buffer.
  useEffect(() => {
    if (!ordersLoadedFromBackend) localStorage.setItem('fb_orders', JSON.stringify(orders));
  }, [orders, ordersLoadedFromBackend]);

  // --- Toast Trigger helper ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // --- Toggle Favorite ID list ---
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        triggerToast('Removed item from your favorites list ❤️');
        return prev.filter(id => id !== productId);
      } else {
        triggerToast('Added item to your favorites list! ❤️');
        return [...prev, productId];
      }
    });
  };

  // --- Add item to Shopping Cart ---
  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });
    triggerToast(`Added x${quantity} ${product.name} to your Basket! 🍔`);
  };

  // --- Update Basket item count ---
  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  // --- Remove item completely from Basket ---
  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    triggerToast('Removed item from your Basket');
  };

  // --- Pushing placed order record locally ---
  const handlePlaceOrder = async (newOrder: Order) => {
    // Backend-only orders for live tracking (choice A):
    // 1) POST order to backend
    // 2) Update local UI buffer with optimistic order
    // 3) Refresh orders from backend when possible (not yet implemented server-side for customers)
    try {
      const payload = {
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        deliveryAddress: newOrder.deliveryAddress,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        discount: newOrder.discount,
        deliveryCharges: newOrder.deliveryCharges,
        total: newOrder.total,
        paymentMethod: newOrder.paymentMethod,
        status: newOrder.status,
        notes: newOrder.notes,
      };

      // Create order in backend (live source of truth)
      await createOrder(payload);

      // Optimistically show it in tracker UI as well.
      setOrders((prev) => [newOrder, ...prev]);

      setCartItems([]); // Wipe checkout items
      setActiveOrderSuccessCode(newOrder.trackCode); // Show success modal!
      triggerToast(`Order placed successfully! Track ref: ${newOrder.trackCode} 🎉`);
    } catch (e) {
      console.error(e);
      triggerToast('Order dispatch failed. Try again.');
    }
  };

  // --- Pushing testimonial review ---
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const nr: Review = {
      ...newReviewData,
      id: 'rev-' + Date.now(),
      date: 'Just now',
    };
    setReviews(prev => [nr, ...prev]);
    triggerToast('Thank you! Testimonial published instantly to feed ⭐');
  };

  // promotions removed
  const handlePromoApply = (_codeToApply: string) => {};
  const handlePromoBrowseSelection = (_category?: string) => {};

  // --- Direct global prefilled WhatsApp trigger ---
  const handleGlobalWhatsAppClick = () => {
    const initMessage = encodeURIComponent("Hello Fast Burgers,\nI want to place an order.");
    window.open(`https://wa.me/${BRAND_INFO.whatsappNumber}?text=${initMessage}`, '_blank');
  };

  // Aggregated quantities in Cart for Navbar badge count
  const cartTotalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b12] via-[#0e0e1a] to-[#050507] text-editorial-cream font-sans selection:bg-editorial-orange selection:text-black antialiased overflow-x-hidden pb-28 sm:pb-32">
      
      {/* Fixed Global Navbar Header */}
      <Header
        cartCount={cartTotalItemsCount}
        openCart={() => setIsCartOpen(true)}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Primary Layout Switch between Admin backoffice or standard client homepage */}
      <main className="relative pt-[88px]">
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        <AnimatePresence mode="wait">
          {isAdminMode ? (
            <motion.div
              key="admin-terminal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel
                products={products}
                setProducts={setProducts}
                orders={orders}
                setOrders={setOrders}
                promotions={[]}
                setPromotions={() => {}}
                onClose={() => setIsAdminMode(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="client-homepage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-0"
            >
               {/* 1. Large Hero presentation with sliders */}
              <Hero
                onOrderOnlineClick={() => {
                  const menuEl = document.getElementById('menu');
                  if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                }}
                onWhatsAppOrderClick={handleGlobalWhatsAppClick}
                onLoginClick={() => setAuthOpen(true)}
              />

              {/* 1.5 Promotional Ticker Banner Strip (removed delivery/offers info) */}
              <PromoTicker />

              {/* 3. Central Interactive Menu and Custom Cards Section */}
              <MenuSection
                products={products}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addToCart={addToCart}
                showFavoritesOnly={showFavoritesOnly}
                setShowFavoritesOnly={setShowFavoritesOnly}
                preselectedCategory={preselectedCategory}
              />

              {/* 4.5 Why Choose Us (Statistics Section) */}
              <StatsSection />

              {/* 5. Online Order status Visual tracker */}
              <OrderTracker orders={orders} />

              {/* 5.5 Customer Reviews */}
              <Reviews reviews={reviews} onAddReview={handleAddReview} />

              {/* 6. High-velocity Deliveries estimates info cards */}
              <DeliverySection />

              {/* 6.5 FAQ Accordion section */}
              <FAQSection />

              {/* 8. Google Map directions and Inquiry contact forms */}
              <Contact />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global standard brand footer */}
      <Footer />

      {/* Global Slideover Shopping Cart overlay drawer */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateCartQty={updateCartQty}
        removeFromCart={removeFromCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Global Success Modal overlay */}
      <OrderSuccessModal
        isOpen={!!activeOrderSuccessCode}
        trackCode={activeOrderSuccessCode || ''}
        onClose={() => setActiveOrderSuccessCode(null)}
        onTrackStatusClick={() => {
          setActiveOrderSuccessCode(null);
          setTimeout(() => {
            const trackEl = document.getElementById('tracking');
            if (trackEl) trackEl.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* REQUIRED: Sticky Floating WhatsApp Action Button on every page */}
      <div className="fixed bottom-6 right-6 z-[140] flex flex-col items-center space-y-2">
        {/* Helper tip above button */}
        <div className="bg-neutral-900 border border-green-500/30 text-[10px] text-green-400 font-black px-2.5 py-1 rounded-md shadow-lg pointer-events-none select-none uppercase tracking-wider block sm:flex items-center space-x-1 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1 inline-block" />
ORDER ON WHATSAPP: {BRAND_INFO.contactNumbers[1] ? BRAND_INFO.contactNumbers[1].includes('-') ? BRAND_INFO.contactNumbers[1] : BRAND_INFO.contactNumbers[1].replace(/^(\d{4})(\d{6,})$/, '$1-$2') : BRAND_INFO.contactNumbers[0] }

        </div>

        <motion.button
          onClick={handleGlobalWhatsAppClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-center justify-center h-14 w-14 rounded-full bg-green-500 text-white shadow-2xl shadow-green-600/50 hover:bg-green-400 transition-colors select-none cursor-pointer group"
          id="floating-whatsapp-btn"
          title="Order FAST Burgers on WhatsApp"
        >
          {/* Green Pulse Ring */}
          <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping opacity-60 pointer-events-none" />
          
          <span className="text-3xl font-bold group-hover:rotate-12 transition-transform select-none">💬</span>
        </motion.button>
      </div>

      {/* Interactive Visual Toast Alerts Alert popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-[250] bg-neutral-900/95 text-white border border-orange-500/30 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2.5"
            id="global-toast-notification"
          >
            <div className="p-1 bg-orange-500 text-black rounded-lg">
              <Sparkles size={16} />
            </div>
            <span className="text-xs font-black tracking-wide text-gray-200 uppercase">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Push Notification Slide-in (Top Right) */}
      <AnimatePresence>
        {pushNotification && (
          <motion.div
            initial={{ opacity: 0, x: 200, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 150 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed top-24 right-6 z-[250] bg-neutral-900 border border-white/10 p-4 rounded-none shadow-2xl flex items-start space-x-3 max-w-sm select-none"
            id="simulated-push-notification"
          >
            <div className="p-2 bg-editorial-orange text-black rounded-none flex-shrink-0">
              <span className="text-base font-bold animate-pulse">🔔</span>
            </div>
            <div className="flex-1 text-left">
              <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-editorial-orange">LIVE NOTIFICATION</h5>
              <p className="text-xs text-white/90 mt-1 font-semibold leading-relaxed">
                {pushNotification}
              </p>
            </div>
            <button 
              onClick={() => setPushNotification(null)}
              className="text-white/30 hover:text-white text-xs cursor-pointer select-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
