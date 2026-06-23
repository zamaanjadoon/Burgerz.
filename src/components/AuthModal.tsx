import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Phone } from 'lucide-react';
import { login, register } from '../api';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const title = useMemo(() => (mode === 'login' ? 'Login' : 'Sign Up'), [mode]);

  const validate = () => {
    const p = phone.trim();
    if (!p) return 'Please enter your phone number.';
    if (!/^\d{10,12}$/.test(p)) return 'Please enter a valid phone number (digits only, e.g. 03087800089).';

    if (mode === 'signup' && !name.trim()) {
      return 'Please enter your full name.';
    }

    if (!password) {
      return 'Please enter your password.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    try {
      if (mode === 'signup') {
        // Register first
        await register(name.trim(), phone.trim(), password);
        // Automatical login after register
        const res = await login(phone.trim(), password);
        saveAuthData(res);
      } else {
        // Login directly
        const res = await login(phone.trim(), password);
        saveAuthData(res);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
        onClose();
      }, 900);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Authentication failed. Please check credentials.');
    }
  };

  const saveAuthData = (res: {
    token: string;
    user: { id: string; role: 'customer' | 'admin'; name: string; phone: string };
  }) => {
    localStorage.setItem('fb_token', res.token);
    localStorage.setItem(
      'fb_user_profile',
      JSON.stringify({
        name: res.user.name,
        phone: res.user.phone,
        role: res.user.role,
        address: localStorage.getItem('fb_user_profile') 
          ? JSON.parse(localStorage.getItem('fb_user_profile') || '{}').address || ''
          : '',
      })
    );
    localStorage.setItem(
      'fb_customer_auth',
      JSON.stringify({
        loginMode: mode,
        identifier: res.user.phone,
        name: res.user.name,
        role: res.user.role,
        savedAt: Date.now(),
      })
    );
    // Broadcast the auth change event globally
    window.dispatchEvent(new Event('fb_auth_changed'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] w-[92%] max-w-md bg-editorial-darker border border-white/10 shadow-2xl rounded-none"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-editorial-orange/10 text-editorial-orange border border-editorial-orange/20 rounded-none">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-editorial-orange">
                      {mode === 'login' ? 'Customer Access' : 'Create Account'}
                    </div>
                    <div className="text-sm font-bold text-white/80">{title}</div>
                  </div>
                </div>

                <button
                  className="p-1 rounded-none hover:bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                  onClick={onClose}
                  aria-label="Close auth modal"
                >
                  <X size={14} />
                </button>
              </div>

              {success ? (
                <div className="py-6 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-none bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    ✅
                  </div>
                  <div className="text-xs uppercase tracking-widest font-extrabold text-green-400">Authenticated!</div>
                  <div className="text-[11px] text-white/40 font-semibold leading-relaxed">
                    Welcome back! You are now securely logged in.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError(null); }}
                      className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-none border transition-all ${
                        mode === 'login'
                          ? 'bg-editorial-orange text-black border-editorial-orange'
                          : 'bg-black/10 text-white/60 border-white/10 hover:text-white'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setError(null); }}
                      className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-none border transition-all ${
                        mode === 'signup'
                          ? 'bg-editorial-orange text-black border-editorial-orange'
                          : 'bg-black/10 text-white/60 border-white/10 hover:text-white'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">
                        Full Name
                      </label>
                      <div className="flex items-center bg-editorial-dark/40 border border-white/10">
                        <span className="px-3 text-white/40">
                          <User size={14} />
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ali Khan"
                          className="w-full bg-transparent text-white rounded-none px-0 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">
                      Phone Number
                    </label>
                    <div className="flex items-center bg-editorial-dark/40 border border-white/10">
                      <span className="px-3 text-white/40">
                        <Phone size={14} />
                      </span>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 03087800089"
                        className="w-full bg-transparent text-white rounded-none px-0 py-2 text-xs font-mono font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-white/55 mb-1">
                      Password
                    </label>
                    <div className="flex items-center bg-editorial-dark/40 border border-white/10">
                      <span className="px-3 text-white/40">
                        <Lock size={14} />
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-white rounded-none px-0 py-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-semibold p-3 rounded-none">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-black font-extrabold rounded-none text-[10px] tracking-[0.2em] uppercase border border-transparent hover:bg-editorial-orange flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {mode === 'login' ? 'LOGIN / CONTINUE' : 'CREATE ACCOUNT'}
                  </button>

                  <div className="text-[11px] text-white/40 leading-relaxed font-semibold">
                    Account coordinates are securely authenticated via our server registry.
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


