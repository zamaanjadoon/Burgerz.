import React from 'react';
import { motion } from 'motion/react';

const CATEGORIES_DATA = [
  {
    id: 'burgers',
    label: 'Burgers',
    count: '7 Items',
    icon: '🍔',
    desc: 'Premium hand-smashed beef, crunchy zinger, and flame-grilled chicken breasts.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'fries',
    label: 'Crispy Fries',
    count: '3 Items',
    icon: '🍟',
    desc: 'Golden plain fries, loaded garlic mayo, and giant cheesy loaded fries bowls.',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/057/837/665/small/delicious-loaded-fries-topped-with-bacon-and-creamy-sauce-on-a-black-plate-photo.jpg',
  },
  {
    id: 'wraps',
    label: 'Wraps & Shawarma',
    count: '2 Items',
    icon: '🌯',
    desc: 'Crispy chicken zinger wraps and authentic local chicken shawarmas.',
    image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'wings',
    label: 'Crispy Wings',
    count: '2 Items',
    icon: '🍗',
    desc: 'Crunchy hot wings fried to golden perfection with signature savory dips.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sandwiches',
    label: 'Club Sandwiches',
    count: '1 Item',
    icon: '🥪',
    desc: 'Triple-decker classic toasted sandwiches packed with chicken, egg, and fresh salad.',
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'drinks',
    label: 'Cold Refreshers',
    count: '2 Items',
    icon: '🍹',
    desc: 'Ice-cold mint margaritas and bubbly lemon sodas to beat the heat.',
    image: 'https://static.tossdown.com/images/a18d1984-8640-45b2-93e0-c5ff60ada1ee.webp',
  },
];

interface CategoriesSectionProps {
  onCategoryClick: (categoryId: string) => void;
}

export default function CategoriesSection({ onCategoryClick }: CategoriesSectionProps) {
  return (
    <section id="categories" className="bg-editorial-dark py-20 editorial-grid border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Content Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
            BROWSE BY CATEGORY
          </span>
          <h2 className="text-4xl font-light text-white font-serif italic mt-1 tracking-tight">
            Select A Food Category
          </h2>
          <hr className="w-16 border-white/20 mx-auto mt-4" />
          <p className="text-xs text-white/50 mt-4 leading-relaxed font-semibold">
            Choose from our premium selected fast food catalog. Click any category to open its dedicated menu page.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6, borderColor: 'var(--color-accent)' }}
              onClick={() => onCategoryClick(cat.id)}
              className="group cursor-pointer bg-editorial-darker border border-editorial overflow-hidden flex flex-col justify-between transition-all duration-300 relative h-72"
            >
              {/* background image container with opacity/grayscale control */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 opacity-25"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-editorial-darker via-editorial-darker/90 to-transparent" />
              </div>

              {/* Tag/Badge for items count */}
              <div className="relative z-10 p-5 flex justify-between items-start">
                <span className="text-[18px] bg-editorial-dark/80 p-2 border border-white/5">{cat.icon}</span>
                <span className="text-[8px] font-mono font-extrabold tracking-widest text-white/40 border border-editorial px-2.5 py-1 bg-black/60">
                  {cat.count}
                </span>
              </div>

              {/* Title & Description Info */}
              <div className="relative z-10 p-5 border-t border-white/[0.03] bg-gradient-to-t from-black/85 to-transparent">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-editorial-orange transition-colors duration-200">
                  {cat.label}
                </h3>
                <p className="text-[11px] text-white/50 mt-1 font-semibold leading-relaxed">
                  {cat.desc}
                </p>
                <div className="mt-4 flex items-center space-x-1 text-[9px] font-bold uppercase tracking-[0.2em] text-editorial-orange">
                  <span>ENTER MENU PAGE</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
