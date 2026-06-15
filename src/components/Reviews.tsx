import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquarePlus, MessageSquare, Quote, User } from 'lucide-react';
import { Review } from '../types';

interface ReviewsProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function Reviews({ reviews, onAddReview }: ReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [tag, setTag] = useState('Hostel Boy');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    onAddReview({
      name,
      rating,
      comment,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      tag: tag || 'Verified Buyer',
    });

    setName('');
    setRating(5);
    setComment('');
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowReviewForm(false);
    }, 2500);
  };

  return (
    <section id="reviews" className="bg-black py-20 scroll-mt-20 border-b border-white/10 editorial-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-4 border-b border-white/10">
          <div className="text-left">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
              GUEST LOG & VERIFICATIONS
            </span>
            <h2 className="text-3xl font-light text-white font-serif italic mt-1 tracking-tight font-serif">
              What Our Burger Lovers Say
            </h2>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center space-x-2 mt-4 md:mt-0 bg-editorial-orange text-black px-4 py-3 rounded-none text-xs font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all w-fit cursor-pointer"
            id="write-review-button"
          >
            <MessageSquarePlus size={12} className="fill-current mr-1" />
            <span>WRITE A TESTIMONIAL</span>
          </button>
        </div>

        {/* Floating Add Review Form Panel (Lookbook Box) */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-neutral-950 rounded-none border border-white/10 p-6 mb-12 shadow-2xl"
              id="review-form-panel"
            >
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-white flex items-center mb-5">
                <MessageSquare className="text-editorial-orange mr-2" size={14} /> Write Your FAST Testimonial
              </h3>

              {submitSuccess ? (
                <div className="border border-green-500/20 bg-green-500/5 p-4 text-center text-xs uppercase font-extrabold tracking-wider text-green-400">
                  🎉 Testimonial registered instantly to our lookup feed! Thank you.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Abdullah Khan"
                        className="w-full bg-black text-white rounded-none border border-white/10 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">Your Status / Tag</label>
                      <select
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-full bg-black text-white rounded-none border border-white/10 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50"
                      >
                        <option value="Hostel Boy">Hostel Boy / Resident</option>
                        <option value="Islamabad Local">Islamabad Resident</option>
                        <option value="Beef Lover">Beef Smash Enthusiast</option>
                        <option value="Zinger Fanatic">Zinger Fan</option>
                        <option value="Diner Guest">Dine-In Customer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">Selected Rating Score</label>
                    <div className="flex items-center space-x-1 focus:outline-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-editorial-gold focus:outline-none active:scale-90 transition-transform"
                        >
                          <Star
                            size={18}
                            className={star <= rating ? 'fill-editorial-gold' : 'text-neutral-800'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1 font-mono">Comment details</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comment on beef smashed patty texture, slider bun softness near soneri bank, crunchiness of fries..."
                      rows={3}
                      className="w-full bg-black text-white rounded-none border border-white/10 p-3 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50 placeholder:text-white/20"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border border-white/10 rounded-none text-[10px] uppercase font-bold tracking-widest text-white/50 hover:bg-white/5 active:scale-95 transition-all"
                    >
                      Close Form
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-white text-black font-extrabold rounded-none text-[10px] uppercase tracking-widest transition-all hover:bg-editorial-orange"
                    >
                      Publish Testimonial
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Cards List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="reviews-card-container">
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-none bg-neutral-950 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              id={`review-card-${rev.id}`}
            >
              <Quote className="absolute top-4 right-4 text-white/5 pointer-events-none" size={32} />
              
              <div className="space-y-4">
                {/* Rating score stars */}
                <div className="flex items-center space-x-1 text-editorial-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.floor(rev.rating) ? 'fill-editorial-gold text-editorial-gold' : 'text-neutral-900'}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-white/40 ml-1.5">{rev.rating}</span>
                </div>

                <p className="text-xs text-white/75 italic leading-relaxed font-semibold">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Info (Lookbook minimalist layout) */}
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-white/5">
                <div className="w-8 h-8 rounded-none overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                  {rev.avatar ? (
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter grayscale"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <User size={13} className="text-editorial-orange" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">{rev.name}</h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[8px] font-extrabold tracking-wider text-editorial-gold uppercase font-mono bg-white/5 border border-white/10 px-1.5 py-0.2">
                      {rev.tag || 'Verified Client'}
                    </span>
                    <span className="text-[8px] text-white/30 font-bold font-mono">{rev.date}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
