"use client";

import React, { useRef, useEffect } from "react";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

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

      <nav className="relative z-20 px-6 py-6 mb-8 w-full">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <Link href="/">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <Terminal className="text-black w-6 h-6" />
                </div>
              </Link>
              <span className="font-['Instrument_Serif'] text-2xl tracking-tight italic">
                Studio.ai
              </span>
            </div>
            <div className="hidden md:flex gap-8 ml-12">
              {["Features", "About"].map((item) => (
                <a
                  key={item}
                  href={"#" + item.toLowerCase()}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          {/* <div className="flex items-center gap-4">
            <button className="text-white text-sm font-medium">Sign Up</button>
            <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">
              Login
            </button>
          </div> */}
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -translate-y-[10%]">
        <h1 className="text-6xl md:text-8xl lg:text-9xl text-white tracking-tight font-['Instrument_Serif'] leading-none mb-8">
          Know it then <em className="italic">all</em>.
        </h1>

        {/* <div className="max-w-xl w-full mb-6">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-sm"
            />
            <button className="bg-white rounded-full p-3 text-black hover:scale-105 transition-transform">
              <ArrowRight size={20} />
            </button>
          </div>
        </div> */}

        <p className="text-white/60 text-sm max-w-sm mb-10 leading-relaxed">
          Stay updated with the latest AI breakthroughs. Join 10,000+ developers
          mastering the future of chat.
        </p>

        <Link href="/chat">
          <button className="liquid-glass cursor-pointer rounded-full px-10 py-4 text-white text-sm font-medium hover:bg-white/5 transition-colors border border-white/10 uppercase tracking-widest">
            Enter Chat Platform
          </button>
        </Link>
      </div>

      {/* <div className="relative z-10 flex justify-center gap-4 pb-12">
        {[Globe].map((Icon, i) => (
          <button
            key={i}
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <Icon size={20} />
          </button>
        ))}
      </div> */}
    </section>
  );
}
