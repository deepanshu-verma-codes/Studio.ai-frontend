"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id='about' ref={ref} className="bg-black pt-32 pb-14 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-8"
        >
          About Us
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-7xl text-white leading-[1.1] tracking-tight font-['Instrument_Serif']"
        >
          Pioneering then ideas <span className="italic text-white/60">for</span> <br className="hidden md:block" />
          <span className="italic text-white/60">minds that then create, build, and inspire.</span>
        </motion.h2>
      </div>
    </section>
  );
}