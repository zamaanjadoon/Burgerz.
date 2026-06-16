import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Users, Clock, Star } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      id: 'stat-orders',
      value: '10,000+',
      label: 'Orders Delivered',
      description: 'Satisfying burger cravings across sectors',
      icon: <ShoppingBag className="text-editorial-orange" size={24} />,
    },
    {
      id: 'stat-customers',
      value: '5,000+',
      label: 'Happy Customers',
      description: 'Diners and hostel students trust us',
      icon: <Users className="text-editorial-orange" size={24} />,
    },
    {
      id: 'stat-delivery',
      value: '30 Mins',
      label: 'Average Delivery',
      description: 'Cooked fresh & brought straight to you',
      icon: <Clock className="text-editorial-orange" size={24} />,
    },
    {
      id: 'stat-rating',
      value: '4.9 Stars',
      label: 'Customer Rating',
      description: 'Top-rated taste in Islamabad',
      icon: <Star className="text-editorial-orange fill-editorial-orange" size={24} />,
    },
  ];

  return (
    <section className="bg-editorial-darker py-16 border-b border-white/10 editorial-grid scroll-mt-20" id="stats">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Title Content */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
            OUR TRACK RECORD BY NUMBERS
          </span>
          <h2 className="text-3xl font-light text-white font-serif italic tracking-tight">
            why barakahu Chooses Us
          </h2>
          <hr className="w-16 border-white/20 mx-auto mt-4" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-editorial-dark border border-white/5 hover:border-editorial-orange/30 p-6 rounded-none flex flex-col justify-between h-48 group transition-all duration-300 relative overflow-hidden"
              id={stat.id}
            >
              {/* Grid Fine Lines */}
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {stat.icon}
              </div>

              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/5 border border-white/10 rounded-none group-hover:border-editorial-orange/40 transition-colors">
                  {stat.icon}
                </div>
                <span className="text-[9px] font-mono text-white/30 tracking-widest font-bold">
                  // 0{idx + 1}
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-black font-serif italic text-white tracking-tight group-hover:text-editorial-orange transition-colors">
                  {stat.value}
                </h3>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-1">
                  {stat.label}
                </h4>
                <p className="text-[10px] text-white/40 mt-1 font-semibold leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* Bottom Orange Line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-editorial-orange group-hover:w-full transition-all duration-300" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
