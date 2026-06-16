import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Star, Sparkles, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface MenuSectionProps {
  products: Product[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  addToCart: (product: Product, quantity: number) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  preselectedCategory?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🍽️' },
  { id: 'burgers', label: 'Burgers', icon: '🍔' },
  { id: 'fries', label: 'Fries', icon: '🍟' },
  { id: 'wraps', label: 'Wraps & Shawar', icon: '🌯' },
  { id: 'wings', label: 'Crispy Wings', icon: '🍗' },
  { id: 'sandwiches', label: 'Sandwiches', icon: '🥪' },
  { id: 'drinks', label: 'Drinks', icon: '🍹' },
] as const;

export default function MenuSection({
  products,
  favorites,
  toggleFavorite,
  addToCart,
  showFavoritesOnly,
  setShowFavoritesOnly,
  preselectedCategory = 'all',
}: MenuSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(preselectedCategory);
  
  // Local quantity buffer states for each product
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Sync category state with parent-driven category trigger if passed
  React.useEffect(() => {
    if (preselectedCategory) {
      setActiveCategory(preselectedCategory);
    }
  }, [preselectedCategory]);

  const incrementQty = (id: string) => {
    setQuantities(item => ({ ...item, [id]: (item[id] || 1) + 1 }));
  };

  const decrementQty = (id: string) => {
    setQuantities(item => ({
      ...item,
      [id]: Math.max(1, (item[id] || 1) - 1)
    }));
  };

  const getQty = (id: string) => {
    return quantities[id] || 1;
  };

  const handleAddToCart = (product: Product) => {
    const qty = getQty(product.id);
    addToCart(product, qty);
    // Reset individual product buffer
    setQuantities(item => ({ ...item, [product.id]: 1 }));
  };

  // Memoized filtered items based on search word and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Favorites toggle filter
      if (showFavoritesOnly && !favorites.includes(p.id)) {
        return false;
      }
      // 2. Category tab filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // 3. Search query filter
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
        
      return matchesSearch;
    });
  }, [products, favorites, showFavoritesOnly, activeCategory, searchTerm]);

  return (
    <section id="menu" className="bg-editorial-dark py-20 scroll-mt-10 editorial-grid border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Content Header: Editorial Serif Style */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
            ORIGINAL DISPATCH SPECIFICATIONS
          </span>
          <h2 className="text-4xl font-light text-white font-serif italic mt-1 tracking-tight">
            Explore Our Fresh Menu Card
          </h2>
          <hr className="w-16 border-white/20 mx-auto mt-4" />
          <p className="text-xs text-white/50 mt-4 leading-relaxed font-semibold">
            Fresh smashed beef, bold spices, crispy sides, and cold drinks—built for quick cravings.
          </p>
        </div>

        {/* Search, Filter & Quick Favorites Tabs Section */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40 p-4 border border-white/10">
            {/* Direct Search Bar */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search burgers, fries, wings..."
                className="w-full bg-black/40 text-white pl-9 pr-4 py-2 hover:border-white/20 border border-white/10 focus:outline-none focus:border-editorial-orange/50 text-[11px] font-mono tracking-wide placeholder:text-white/30"
              />
            </div>

            {/* Total count badge */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              {showFavoritesOnly && (
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="text-[10px] uppercase tracking-wider font-extrabold text-[#f43f5e] hover:underline cursor-pointer"
                >
                  Clear Favorites Toggle
                </button>
              )}
              <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-white/40 bg-black border border-white/10 px-3.5 py-1.5 select-none">
                Items Found: <strong className="text-white font-bold">{filteredProducts.length}</strong>
              </span>
            </div>
          </div>

          {/* Categories Tab (Lookbook rectangular tag buttons) */}
          <div className="flex flex-wrap gap-1.5 justify-center" id="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setShowFavoritesOnly(false); // Reset favorites only viewing
                }}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-none text-[10px] font-extrabold uppercase tracking-[0.18em] leading-none cursor-pointer border transition-all duration-300 select-none ${
                  activeCategory === cat.id && !showFavoritesOnly
                    ? 'bg-editorial-orange text-black border-editorial-orange'
                    : 'bg-black text-white/60 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="text-[11px]">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Empty Grid Representation */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-neutral-950 border border-dashed border-white/10 rounded-none"
              id="no-items-placeholder"
            >
              <h3 className="text-sm uppercase tracking-widest font-bold text-white/40">No matching catalog items</h3>
              <p className="text-xs text-white/30 mt-2 font-mono">
                "NO CORRESPONDENCE ON SEARCH: {searchTerm}"
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                  setShowFavoritesOnly(false);
                }}
                title="Reset Menu Filters"
                aria-label="Reset Menu Filters"
                className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] border border-editorial-orange text-editorial-orange px-4 py-2 hover:bg-editorial-orange hover:text-black transition-all"
              >
                Reset Menu Filters
              </button>
            </motion.div>
          ) : (
            // Curved cards converted into ultra sleek rectangle boxes
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              id="products-grid"
            >
              {filteredProducts.map((p) => {
                const isFavorite = favorites.includes(p.id);
                const currentQty = getQty(p.id);

                return (
                  <motion.div
                    key={p.id}
                    layoutId={`product-${p.id}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex flex-col justify-between rounded-none bg-neutral-950 border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300"
                    id={`menu-item-${p.id}`}
                  >
                    
                    {/* Visual Media Header */}
                    <div className="relative h-48 w-full bg-black overflow-hidden border-b border-white/10">
                      {/* Popularity or Newness Banner Tag (Rectangular) */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
                        {p.isPopular && (
                          <span className="flex items-center space-x-1 border border-editorial-gold text-editorial-gold text-[8px] font-extrabold tracking-widest px-2 py-0.5 bg-black/80">
                            <Sparkles size={8} />
                            <span>BEST SELLER</span>
                          </span>
                        )}
                        {p.isNew && (
                          <span className="border border-editorial-orange text-editorial-orange text-[8px] font-extrabold tracking-widest px-2 py-0.5 bg-black/80">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Favorites Heart Button */}
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className={`absolute top-3 right-3 z-10 p-1.5 rounded-none border transition-all ${
                          isFavorite
                            ? 'bg-rose-500 text-white border-rose-400'
                            : 'bg-black/95 text-white/50 hover:text-rose-500 border-white/15'
                        }`}
                        title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                      >
                        <Heart size={13} className={isFavorite ? 'fill-current' : ''} />
                      </button>

                      {/* Actual Image Tag */}
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter grayscale-[15%] group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30" />
                    </div>

                    {/* Interactive Body Text Description */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Rating block & Tag list (Fine Lookbook layout style) */}
                        <div className="flex flex-wrap items-center gap-1.5 ">
                          <span className="flex items-center text-[9px] font-mono text-editorial-gold border border-editorial-gold/20 px-1.5 py-0.5 select-none bg-editorial-gold/5">
                            <Star size={9} className="fill-editorial-gold mr-0.5" />
                            {p.rating}
                          </span>
                          {p.tags?.map((t, idx) => (
                            <span key={idx} className="text-[8px] font-mono text-white/40 border border-white/5 px-1.5 py-0.5 bg-white/[0.02]">
                              {t}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-editorial-orange transition-colors">
                          {p.name}
                        </h3>

                        <p className="text-[11px] text-white/40 leading-relaxed font-semibold">
                          {p.description}
                        </p>
                      </div>

                      {/* Bottom Price, Selector, Actions Grid */}
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white font-mono uppercase">
                            Rs. <span className="text-base text-editorial-orange font-black">{p.price}</span>
                          </span>
                          
                          {/* Quantity Selector mechanism (Sharp square layouts) */}
                          <div className="flex items-center bg-black border border-white/10 p-0.5">
                            <button
                              onClick={() => decrementQty(p.id)}
                              className="p-1 text-white/40 hover:text-white transition-all rounded-none"
                              id={`qty-dec-${p.id}`}
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white font-mono select-none">
                              {currentQty}
                            </span>
                            <button
                              onClick={() => incrementQty(p.id)}
                              className="p-1 text-white/40 hover:text-white transition-all rounded-none"
                              id={`qty-inc-${p.id}`}
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Add to Cart Click button */}
                        <button
                          onClick={() => handleAddToCart(p)}
                          className="w-full flex items-center justify-center space-x-2 py-2.5 bg-white border border-white/10 hover:bg-neutral-900 group-hover:border-editorial-orange text-black font-extrabold group-hover:text-white text-[10px] tracking-[0.2em] transition-all rounded-none cursor-pointer uppercase"
                          id={`add-to-cart-${p.id}`}
                        >
                          <ShoppingBag size={11} className="fill-current text-black group-hover:text-white" />
                          <span>ADD TO BASKET</span>
                        </button>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
