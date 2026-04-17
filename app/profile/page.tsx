"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/ui/Sidebar';
import { Menu, Camera, LogOut, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleMenu={toggleSidebar} />

      {/* Header Panel */}
      <header className="p-5 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0b0d11]/90 backdrop-blur-md z-40">
        <button onClick={toggleSidebar} className="w-10 h-10 flex items-center justify-center rounded-xl glass active:scale-90 transition">
          <Menu className="text-slate-300" size={24} />
        </button>

        <div className="text-center">
          <h1 className="text-base font-black italic tracking-tighter leading-none uppercase">
            Yangon TV <span className="text-blue-500">Lab</span>
          </h1>
          <p className="text-[8px] font-bold text-slate-500 tracking-[0.1em] uppercase mt-1">
            Subtitle File Editor Group
          </p>
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600/40 p-0.5">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zin" alt="Profile" className="w-full h-full rounded-full" />
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="max-w-xl mx-auto w-full p-4 space-y-8 flex-1 animate-fade-in pt-6 pb-10">
        
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-[2rem] text-center border-blue-500/10 hover:border-blue-500/30 transition-colors">
            <h4 className="text-3xl font-black text-blue-500 italic">14</h4>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Movies Done</p>
          </div>
          <div className="glass p-6 rounded-[2rem] text-center border-green-500/10 hover:border-green-500/30 transition-colors">
            <h4 className="text-3xl font-black text-[#42b72a] italic">52</h4>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Episodes Done</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center space-y-4">
          <div className="relative inline-block group cursor-pointer">
            <div className="w-24 h-24 rounded-full border-4 border-blue-600/50 p-1 overflow-hidden transition-all group-hover:border-blue-500">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zin" className="w-full h-full rounded-full" alt="User" />
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 w-8 h-8 rounded-full border-2 border-[#0b0d11] flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase">Zin Ko Ko Lwin</h2>
            <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase mt-1">SME Founder / Admin</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Full Name</label>
            <input type="text" defaultValue="Zin Ko Ko Lwin" className="premium-input" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">New Password</label>
            <input type="password" placeholder="••••••••" className="premium-input" />
          </div>
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest mt-4 shadow-xl shadow-blue-600/20 active:scale-95 transition">
            Update Profile
          </button>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 border-t border-white/5 space-y-3">
          <Link href="/edit/new" className="block">
            <button className="w-full py-4 glass rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Back to Editor
            </button>
          </Link>
          
          <Link href="/" className="block">
            <button className="w-full py-4 bg-red-600/10 text-red-500 border border-red-500/20 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-red-500/20 transition flex items-center justify-center gap-2">
              <LogOut size={16} /> Sign Out Account
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}