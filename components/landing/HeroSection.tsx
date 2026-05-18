"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Activity, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-black">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/30 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left pt-12 lg:pt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              Next-Gen AI for Student Wellness
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Detect burnout <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                before it happens.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              MindGuard AI uses advanced behavioral analysis and machine learning to proactively identify student mental fatigue, providing timely interventions and personalized support.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Book a Demo
              </motion.button>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-zinc-500 font-medium">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> HIPAA Compliant</div>
              <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> Real-time Analytics</div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
          >
            <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-3xl p-4 shadow-2xl">
              {/* Abstract representation of dashboard */}
              <div className="w-full h-full rounded-xl bg-black/50 border border-white/5 relative overflow-hidden flex flex-col">
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-white/10 rounded" />
                      <div className="h-8 w-24 bg-white/20 rounded" />
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-white/10 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">84%</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 rounded-lg bg-gradient-to-t from-white/5 to-transparent relative mt-4 border border-white/5">
                    {/* Simulated Graph */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,100 L0,50 C20,60 40,20 60,40 C80,60 90,30 100,20 L100,100 Z" fill="url(#gradient)" opacity="0.3"/>
                      <path d="M0,50 C20,60 40,20 60,40 C80,60 90,30 100,20" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"/>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -right-4 top-20 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-white font-medium">Risk Decreased</div>
                    <div className="text-[10px] text-zinc-400">-12% this week</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-6 bottom-12 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-white font-medium">Insight Generated</div>
                    <div className="text-[10px] text-zinc-400">Study pattern optimized</div>
                  </div>
                </motion.div>
                
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
