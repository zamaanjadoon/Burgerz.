import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Star, Sparkles, Plus, Minus, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface CategoryPageProps {
  categoryId: string;
  products: Product[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  addToCart: (product: Product, quantity: number) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (catId: string) => void;
}

const CATEGORIES_INFO: Record<string, { label: string; icon: string; desc: string; banner: string }> = {
  burgers: {
    label: 'Gourmet Burgers',
    icon: '🍔',
    desc: 'Flame-grilled chicken breast fillets, and double smashed beef patties. Layered with cheese, jalapenos, and house-made sauces.',
    banner: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80',
  },
  fries: {
    label: 'Crispy Fries',
    icon: '🍟',
    desc: 'Golden-brown double-fried french fries. Try them plain, with Garlic Mayo dressing, or smothered in loaded cheese and chicken chunks.',
    banner: 'https://static.vecteezy.com/system/resources/thumbnails/057/837/665/small/delicious-loaded-fries-topped-with-bacon-and-creamy-sauce-on-a-black-plate-photo.jpg',
  },
  wraps: {
    label: 'Wraps & Shawarma',
    icon: '🌯',
    desc: 'Fresh soft tortilla rolls loaded with crispy zinger chicken, and local chicken shawarmas with spicy red sauce and garlic mayo wraps.',
    banner: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=1200&auto=format&fit=crop&q=80',
  },
  wings: {
    label: 'Crispy Wings',
    icon: '🍗',
    desc: 'Fresh, crunchy double-breaded chicken wings fried to order. Sprinkled with spices and served hot with savory garlic dip sauce.',
    banner: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&auto=format&fit=crop&q=80',
  },
  sandwiches: {
    label: 'Club Sandwiches',
    icon: '🥪',
    desc: 'Triple-decker classic toasted sandwiches packed with sliced chicken breast, fried egg layers, cucumber grids, tomatoes, and sandwich mayo.',
    banner: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=1200&auto=format&fit=crop&q=80',
  },
  drinks: {
    label: 'Cold Refreshers',
    icon: '🍹',
    desc: 'Chilled mint margaritas and rock salt lemon sodas made with fresh ingredients to refresh you instantly.',
    banner: 'https://static.tossdown.com/images/a18d1984-8640-45b2-93e0-c5ff60ada1ee.webp',
  },
};

const ALL_CATEGORIES = [
  { id: 'burgers', label: 'Burgers', icon: '🍔' },
  { id: 'fries', label: 'Fries', icon: '🍟' },
  { id: 'wraps', label: 'Wraps', icon: '🌯' },
  { id: 'wings', label: 'Wings', icon: '🍗' },
  { id: 'sandwiches', label: 'Sandwiches', icon: '🥪' },
  { id: 'drinks', label: 'Drinks', icon: '🍹' },
];

export default function CategoryPage({
  categoryId,
  products,
  favorites,
  toggleFavorite,
  addToCart,
  onNavigateHome,
  onNavigateCategory,
}: CategoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const catInfo = CATEGORIES_INFO[categoryId] || {
    label: 'Menu Catalog',
    icon: '🍽️',
    desc: 'Explore our fresh menu catalog items.',
    banner: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=1200&auto=format&fit=crop&q=80',
  };

  const incrementQty = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const decrementQty = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const getQty = (id: string) => quantities[id] || 1;

  const handleAddToCart = (product: Product) => {
    const qty = getQty(product.id);
    addToCart(product, qty);
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  // Filter products for this specific category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.category !== categoryId) return false;
      if (searchTerm) {
        return (
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())))
        );
      }
      return true;
    });
  }, [products, categoryId, searchTerm]);

  return (
    <div className="w-full pb-20 bg-editorial-dark">
      
      {/* Category Hero Banner */}
      <div className="relative w-full h-[320px] md:h-[400px] flex items-center bg-black overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={catInfo.banner}
            alt={catInfo.label}
            className="w-full h-full object-cover grayscale-[20%] opacity-35"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-editorial-dark via-editorial-dark/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left w-full">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-[9px] font-mono tracking-widest text-white/40 uppercase mb-4">
            <button onClick={onNavigateHome} className="hover:text-editorial-orange transition-colors">
              HOME
            </button>
            <ChevronRight size={10} />
            <span className="text-editorial-orange font-black">{catInfo.label}</span>
          </div>

          {/* Title */}
          <div className="space-y-4 max-w-3xl">
            <span className="text-[12px] bg-editorial-orange/20 border border-editorial-orange text-editorial-orange px-3 py-1.5 font-bold uppercase tracking-[0.2em] rounded-none">
              CATEGORY VIEW {catInfo.icon}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-none text-white font-serif italic tracking-tight">
              {catInfo.label}
            </h1>
            <p className="text-xs md:text-sm text-gray-400 font-semibold max-w-2xl leading-relaxed">
              {catInfo.desc}
            </p>
          </div>
        </div>

        {/* Home Back Button */}
        <button
          onClick={onNavigateHome}
          className="absolute top-6 left-6 z-20 flex items-center space-x-2 px-4 py-2 border border-white/10 bg-editorial-darker/90 backdrop-blur-md text-white hover:text-editorial-orange hover:border-editorial-orange/40 transition-all rounded-none cursor-pointer text-[10px] font-extrabold uppercase tracking-widest"
        >
          <ArrowLeft size={12} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sidebar quick category navigation */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-editorial-darker border border-editorial p-5 rounded-none">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 border-b border-editorial pb-3 mb-4">
                CATEGORIES MENU
              </h3>
              <div className="flex flex-col space-y-1">
                {ALL_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigateCategory(c.id);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-none text-[11px] font-bold uppercase tracking-wider text-left border transition-all ${
                      categoryId === c.id
                        ? 'bg-editorial-orange/10 border-editorial-orange text-editorial-orange font-black'
                        : 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-xs">{c.icon}</span>
                      <span>{c.label}</span>
                    </span>
                    <span className="text-[9px] opacity-40">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Helper Widget */}
            <div className="bg-editorial-darker border border-editorial p-5 rounded-none font-mono text-[9px] uppercase tracking-wider text-white/40 space-y-2">
              <div className="text-editorial-orange font-bold">Chef M. D. M. Irfan Says:</div>
              <p className="leading-relaxed">
                All food in this category is grilled to order, utilizing 100% Halal premium coordinates. Hot & fresh coordinates delivery to Bharakahu boys hostel.
              </p>
            </div>
          </div>

          {/* Right Column: Search, Stats, Products Grid */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Local Search and results ticker */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-editorial-darker/60 p-4 border border-editorial">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search in ${catInfo.label.toLowerCase()}...`}
                  className="w-full bg-editorial-darker/40 text-editorial-cream pl-9 pr-4 py-2 border border-editorial focus:outline-none focus:border-editorial-orange/50 text-[11px] font-mono tracking-wide placeholder:text-white/30"
                />
              </div>

              <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-white/40 bg-editorial-darker border border-editorial px-3.5 py-1.5 select-none">
                Category Items Found: <strong className="text-white font-bold">{filteredProducts.length}</strong>
              </span>
            </div>

            {/* Products Listing Grid */}
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24 bg-editorial-darker border border-dashed border-editorial rounded-none"
                >
                  <h3 className="text-sm uppercase tracking-widest font-bold text-white/40">No matching category items</h3>
                  <p className="text-xs text-white/30 mt-2 font-mono">
                    "NO RESULTS FOR '{searchTerm}' IN THIS VIEW"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] border border-editorial-orange text-editorial-orange px-4 py-2 hover:bg-editorial-orange hover:text-black transition-all"
                  >
                    Clear Filter
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => {
                    const isFavorite = favorites.includes(p.id);
                    const currentQty = getQty(p.id);

                    return (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="flex flex-col justify-between rounded-none bg-editorial-darker border border-editorial overflow-hidden group hover:border-editorial-strong transition-all duration-300 relative"
                      >
                        {/* Image Layer */}
                        <div className="relative h-44 w-full bg-editorial-darker overflow-hidden border-b border-editorial">
                          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
                            {p.isPopular && (
                              <span className="flex items-center space-x-1 border border-editorial-gold text-editorial-gold text-[7px] font-extrabold tracking-widest px-2 py-0.5 bg-black/85">
                                <Sparkles size={7} />
                                <span>BEST SELLER</span>
                              </span>
                            )}
                            {p.isNew && (
                              <span className="border border-editorial-orange text-editorial-orange text-[7px] font-extrabold tracking-widest px-2 py-0.5 bg-black/85">
                                NEW
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => toggleFavorite(p.id)}
                            className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-none border transition-all ${
                              isFavorite
                                ? 'bg-rose-500 text-white border-rose-400'
                                : 'bg-editorial-darker/95 text-white/50 hover:text-rose-500 border-editorial-strong'
                            }`}
                          >
                            <Heart size={12} className={isFavorite ? 'fill-current' : ''} />
                          </button>

                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover filter grayscale-[15%] group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        {/* Card Info Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="flex items-center text-[9px] font-mono text-editorial-gold border border-editorial-gold/25 px-1.5 py-0.5 bg-editorial-gold/5">
                                <Star size={8} className="fill-editorial-gold mr-0.5" />
                                {p.rating}
                              </span>
                              {p.tags?.map((t, idx) => (
                                <span key={idx} className="text-[8px] font-mono text-white/40 border border-editorial px-1.5 py-0.5">
                                  {t}
                                </span>
                              ))}
                            </div>

                            <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-editorial-orange transition-colors">
                              {p.name}
                            </h3>

                            <p className="text-[10px] text-white/40 leading-relaxed font-semibold">
                              {p.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-editorial space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono uppercase">
                                Rs. <span className="text-sm text-editorial-orange font-black">{p.price}</span>
                              </span>

                              <div className="flex items-center bg-editorial-darker border border-editorial p-0.5">
                                <button
                                  onClick={() => decrementQty(p.id)}
                                  className="p-1 text-white/40 hover:text-white transition-all rounded-none"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-white font-mono select-none">
                                  {currentQty}
                                </span>
                                <button
                                  onClick={() => incrementQty(p.id)}
                                  className="p-1 text-white/40 hover:text-white transition-all rounded-none"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => handleAddToCart(p)}
                              className="w-full flex items-center justify-center space-x-2 py-2 bg-white border border-editorial hover:bg-editorial-dark group-hover:border-editorial-orange text-black font-extrabold group-hover:text-white text-[9px] tracking-[0.2em] transition-all rounded-none cursor-pointer uppercase"
                            >
                              <ShoppingBag size={10} className="fill-current text-black group-hover:text-white" />
                              <span>ADD TO BASKET</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

    </div>
  );
}
