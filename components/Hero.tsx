"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowRight, Terminal, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fade = (target: number, duration: number) => {
      const startOpacity = parseFloat(video.style.opacity) || 0;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        video.style.opacity = (
          startOpacity +
          (target - startOpacity) * progress
        ).toString();
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    video.oncanplay = () => fade(1, 500);

    video.ontimeupdate = () => {
      if (video.duration - video.currentTime <= 0.55) fade(0, 500);
    };

    video.onended = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
        fade(1, 500);
      }, 100);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col bg-black">
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/damecjgp9/video/upload/f_auto,q_auto,c_limit,w_1920,h_1080/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a_vemyif"
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        style={{ opacity: 0 }}
        muted
        autoPlay
        playsInline
        preload="auto"
      />

      <nav className="relative z-[100] px-6 py-6 mb-8 w-full">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <Link href="/">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <Terminal className="text-black w-6 h-6" />
                </div>
              </Link>
              <span className="font-['Instrument_Serif'] text-2xl tracking-tight italic text-white">
                Studio.ai
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8">
              {["Features", "About"].map((item) => (
                <a
                  key={item}
                  href={"#" + item.toLowerCase()}
                  className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all overflow-hidden cursor-pointer relative z-[101]"
                >
                  <UserIcon size={18} className="text-white/60" />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[110]"
                    >
                      <div className="px-4 py-4 border-b border-white/5 mb-3">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Authenticated Node</p>
                        <p className="text-xs text-white/90 truncate font-medium">{user.email}</p>
                      </div>
                      <div className="space-y-2">
                        <Link 
                          href="/chat" 
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm group"
                        >
                          <LayoutDashboard size={16} className="group-hover:text-blue-400 transition-colors" />
                          <span className="font-medium">Enter Platform</span>
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all text-sm group cursor-pointer"
                        >
                          <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                          <span className="font-bold uppercase tracking-tight">Log Out System</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/chat" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                  Sign In
                </Link>
                <Link href="/chat">
                  <button className="bg-white text-black rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -translate-y-[10%]">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl text-white tracking-tight font-['Instrument_Serif'] leading-none mb-8"
        >
          Know it then <em className="italic text-white/50">all</em>.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white/40 text-xs uppercase tracking-[0.4em] font-medium max-w-sm mb-12 leading-relaxed"
        >
          Advanced neural orchestration for the next generation of digital intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Link href="/chat">
            <button className="group relative liquid-glass cursor-pointer rounded-full px-12 py-5 text-white text-xs font-bold hover:bg-white/5 transition-all border border-white/10 uppercase tracking-[0.3em] overflow-hidden">
              <span className="relative z-10">Enter Chat Platform</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
