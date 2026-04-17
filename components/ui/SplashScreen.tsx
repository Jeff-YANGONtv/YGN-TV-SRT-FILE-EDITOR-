"use client";
import React from 'react';
import { MonitorPlay } from 'lucide-react';

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0d11]">
      {/* Background Glow Effect */}
      <div className="absolute w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
          <div className="relative p-5 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/50 animate-bounce">
            <MonitorPlay size={60} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
          YANGON <span className="text-blue-500">TV</span>
        </h1>
        
        {/* Loading Bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-blue-500 w-1/2 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
        
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-6">
          Production Lab Terminal
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};