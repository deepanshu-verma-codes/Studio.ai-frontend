'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Terminal, ShieldCheck, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-sans antialiased selection:bg-white/20">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] mb-6">
            <Terminal className="text-black w-8 h-8" />
          </div>
          <h2 className="text-4xl font-['Instrument_Serif'] italic tracking-tight mb-2">
            {isSignUp ? 'Join the Studio' : 'Resume Synapse'}
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium text-center">
            {isSignUp ? 'Initialize your neural node' : 'Enter your credentials to connect'}
          </p>
        </div>

        <div className="liquid-glass border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-white/60 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all text-sm placeholder:text-white/10"
                  placeholder="name@nexus.ai"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-2">Secure Key</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-white/60 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all text-sm placeholder:text-white/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full group/btn relative overflow-hidden py-4 px-6 bg-white text-black rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <span className="relative z-10">{loading ? 'Processing...' : isSignUp ? 'Initialize Node' : 'Establish Connection'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
            </button>
          </form>

          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-6 p-4 rounded-xl border text-center text-xs font-medium ${
                message.includes('Check') 
                  ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                  : 'bg-red-500/5 border-red-500/20 text-red-400'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage('');
              }}
              className="group flex items-center justify-center gap-2 mx-auto"
            >
              <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                {isSignUp ? 'Already registered?' : 'Need a neural node?'}
              </span>
              <span className="text-xs text-white/60 font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                {isSignUp ? 'Sign In' : 'Get Started'}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 opacity-20">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} />
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold">End-to-End Encrypted</span>
          </div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Sparkles size={12} />
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Powered by Gemini</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
