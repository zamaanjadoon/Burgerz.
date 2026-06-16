import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Send, Award } from 'lucide-react';
import { BRAND_INFO } from '../data';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    // Simulate sending inquiry message
    setSuccess(true);
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  return (
    <section id="contact" className="bg-editorial-dark py-20 scroll-mt-20 border-b border-editorial editorial-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title elements header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-editorial-orange uppercase block mb-1">
            LOCATION OVERVIEW & DISPATCH
          </span>
          <h2 className="text-4xl font-light text-white font-serif italic mt-1 tracking-tight">
            Contact & Store Coordinates
          </h2>
          <hr className="w-16 border-editorial mx-auto mt-4" />
        </div>

        {/* Triple Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Store Coordinates (4 spans) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-none bg-editorial-darker border border-editorial space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 border-b border-editorial pb-3">
                // STORE COORDINATES
              </h3>

              {/* Physical Location */}
              <div className="flex items-start space-x-3">
                <MapPin className="text-editorial-orange mt-0.5 flex-shrink-0" size={15} />
                <div>
                  <h4 className="text-[10px] font-extrabold text-white uppercase tracking-wider">PHYSICAL ADRESS</h4>
                  <p className="text-xs text-white/45 mt-1 font-semibold leading-relaxed font-mono">
                    {BRAND_INFO.address}
                  </p>
                </div>
              </div>

              {/* Dialing Connections */}
              <div className="flex items-start space-x-3">
                <Phone className="text-editorial-orange mt-0.5 flex-shrink-0" size={15} />
                <div>
                  <h4 className="text-[10px] font-extrabold text-white uppercase tracking-wider">CALL HOTLINE</h4>
                  <div className="flex flex-col gap-1.5 mt-1">
                    {BRAND_INFO.contactNumbers.map((num, i) => (
                      <button
                        key={i}
                        onClick={() => handleCall(num)}
                        className="text-left text-xs font-extrabold text-[#f59e0b] hover:text-white transition-colors cursor-pointer font-mono"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start space-x-3">
                <Clock className="text-editorial-orange mt-0.5 flex-shrink-0" size={15} />
                <div>
                  <h4 className="text-[10px] font-extrabold text-white uppercase tracking-wider">OPERATIONAL HOURS</h4>
                  <p className="text-xs text-white/45 mt-1 font-semibold">
                    {BRAND_INFO.businessHours}
                  </p>
                  <span className="text-[8px] font-bold text-editorial-gold uppercase tracking-widest font-mono">
                    OPEN 7 DAYS A WEEK
                  </span>
                </div>
              </div>

              {/* Contact Personnel Info */}
              <hr className="border-editorial" />
              <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-none">
                OWNER: <strong className="text-white font-extrabold">{BRAND_INFO.owner}</strong>
              </div>
            </div>
          </div>

          {/* Column 2: Inquiries Custom Form (4 spans) */}
          <div className="lg:col-span-4 p-6 rounded-none bg-editorial-darker border border-editorial">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 border-b border-editorial pb-3 mb-4">
              // DISPATCH INQUIRY FORM
            </h3>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-green-500/20 bg-green-500/5 p-5 text-center space-y-2 rounded-none"
              >
                <h4 className="text-xs uppercase tracking-widest font-extrabold text-green-400">Inquiry Transmitted!</h4>
                <p className="text-xs text-white/40 leading-relaxed font-semibold">
                  Thank you for writing. We will notify you or respond to your coordinate phone number if required.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hammad Ahmed"
                    className="w-full bg-editorial-dark text-editorial-cream rounded-none border border-editorial px-3 py-2 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Active Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 03409631937"
                    className="w-full bg-editorial-dark text-editorial-cream rounded-none border border-editorial px-3 py-2 text-xs font-mono focus:outline-none focus:border-editorial-orange/50"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Message Detail</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Custom student celebration adjustments? Or bulk grill options needed for boys hostel events?"
                    rows={4}
                    className="w-full bg-editorial-dark text-editorial-cream rounded-none border border-editorial p-3 text-xs font-semibold focus:outline-none focus:border-editorial-orange/50 placeholder:text-white/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-extrabold rounded-none text-[10px] tracking-[0.2em] transition-all cursor-pointer uppercase border border-transparent hover:bg-editorial-orange"
                >
                  DISPATCH TO TEAM
                </button>
              </form>
            )}
          </div>

          {/* Column 3: Satellite Embed (4 spans) */}
          <div className="lg:col-span-4 p-6 rounded-none bg-editorial-darker border border-editorial space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 border-b border-editorial pb-3 flex items-center justify-between">
              <span>// SATELLITE LOCATOR</span>
              <span className="text-[8px] bg-editorial-orange text-black px-1.5 py-0.2 font-mono font-bold uppercase">SONERI BANK SECTORS</span>
            </h3>

            {/* Google map iframe with strict lookbook rectangular borders */}
            <div className="relative rounded-none overflow-hidden bg-editorial-dark aspect-video md:aspect-square border border-editorial flex items-center justify-center">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.635850989045!2d73.18181607593635!3d33.77027557326417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbf84cd6d71bf%3A0xe54dbccb20fc6ea5!2sSoneri%20Bank!5e0!3m2!1sen!2spk!4v1718365123281!5m2!1sen!2spk" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-70 hover:opacity-95 transition-opacity duration-300"
              />
            </div>

            <p className="text-[11px] text-white/40 leading-relaxed text-center font-semibold">
              📍 Situated directly beside <strong>Soneri Bank, Bherapul, Bharakahu, Islamabad</strong>. Very convenient for hostel boyz to walk in or request doorstep courier in minutes!
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
