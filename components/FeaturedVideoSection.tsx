"use client";
import { motion } from "framer-motion";

export default function FeaturedVideoSection() {
  return (
    <section id="features" className="bg-black py-20 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="max-w-6xl mx-auto rounded-3xl overflow-hidden aspect-video relative group"
      >
        <video
          src="https://res.cloudinary.com/damecjgp9/video/upload/f_auto,q_auto,c_limit,w_1920,h_1080/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8_dbppml"
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
            <span className="text-white/50 text-[10px] tracking-widest uppercase mb-3 block font-bold">
              Our Approach
            </span>
            <p className="text-white text-sm md:text-base leading-relaxed">
              We believe in the power of curiosity-driven exploration. Every
              chat interaction starts with a prompt, and every answer is a step
              toward insight.
            </p>
          </div>
          {/* <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:scale-105 transition-transform">
            Explore more
          </button> */}
        </div>
      </motion.div>
    </section>
  );
}
