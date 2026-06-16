import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const faqs = [
    {
      question: 'Which areas do you deliver to?',
      answer: 'We deliver hot and fresh burgers across all areas of Bharakahu (Barakahu), including local sectors, streets, and adjacent hostel rooms. Orders near our Bherapul Soneri Bank kitchen arrive in as fast as 20 minutes!',
    },
    {
      question: 'Why do I need to confirm my order on WhatsApp?',
      answer: 'Confirming on WhatsApp sends the exact cooked-item registry, coupons, and address details to our kitchen instantly. This lets us verify coordinates in real-time, preventing fake requests and ensuring lightning-fast dispatcher matching.',
    },
    {
      question: 'What is the minimum order threshold and delivery cost?',
      answer: 'Our base minimum order threshold is Rs. 300. Deliveries carry a standard base courier tariff of Rs. 80. However, orders exceeding Rs. 1500 qualify for completely free delivery!',
    },
    {
      question: 'What payment methods do you support?',
      answer: 'We support Cash on Delivery (COD) as well as secure mobile wallets. You can transfer easily via Easypaisa (03409631937) or JazzCash (0309-5040097) and present the transfer slip screenshot to the dispatcher upon arrival.',
    },
    {
      question: 'Is your meat halal and freshly sourced?',
      answer: 'Absolutely! We source 100% certified Halal beef and chicken breast daily. All patties are freshly hand-ground, smashed, and seared to order on our flat-top grills—never frozen.',
    },
    {
      question: 'Are there special student or hostel combo deals?',
      answer: 'Yes! We recognize the hostel budget. We offer special combo deals like our Family Deal (Rs. 1999) and flat discount coupons (e.g. use code HOSTELDEAL for Rs. 100 off orders over Rs. 1000). Enter coupon codes inside the basket drawer.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-editorial-dark py-20 border-b border-white/10 editorial-grid scroll-mt-20" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Title Content */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
            COMMON CONCERNS RESOLVED
          </span>
          <h2 className="text-3xl font-light text-white font-serif italic tracking-tight">
            Frequently Asked Questions
          </h2>
          <hr className="w-16 border-white/20 mx-auto mt-4" />
        </div>

        {/* Accordions Stack */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-editorial-darker border border-white/5 hover:border-white/15 transition-colors rounded-none"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-white select-none cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <HelpCircle size={14} className="text-editorial-orange flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex-shrink-0 p-1 bg-white/5 border border-white/10 rounded-none text-white/50">
                    {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-white/50 border-t border-white/5 leading-relaxed font-semibold">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
