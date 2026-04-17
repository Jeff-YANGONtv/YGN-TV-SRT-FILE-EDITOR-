"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Edit3, History, UserCog, LogOut, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function Sidebar({ isOpen, toggleMenu }: SidebarProps) {
  const pathname = usePathname(); // လက်ရှိရောက်နေတဲ့ Page ကို သိဖို့ပါ

  return (
    <>
      {/* Overlay Background */}
      <div 
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleMenu}
      />
      
      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-[#0d0f14] z-[70] border-r border-white/5 p-8 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">
              Yangon TV
            </h2>
            <p className="text-[9px] font-bold text-blue-500 tracking-widest mt-1 uppercase">
              Menu Navigation
            </p>
          </div>
          <button onClick={toggleMenu} className="text-slate-500 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3 flex-1">
          {/* EDIT Link */}
          <Link 
            href="/edit/new" 
            onClick={toggleMenu}
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition ${
              pathname.includes('/edit') 
                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Edit3 size={20} className={pathname.includes('/edit') ? 'text-blue-500' : ''} /> 
            EDIT
          </Link>

          {/* HISTORY Link */}
          <Link 
            href="/history" 
            onClick={toggleMenu}
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition ${
              pathname.includes('/history') 
                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <History size={20} className={pathname.includes('/history') ? 'text-blue-500' : ''} /> 
            HISTORY
          </Link>

          {/* PROFILE Link */}
          <Link 
            href="/profile" 
            onClick={toggleMenu}
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition ${
              pathname.includes('/profile') 
                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <UserCog size={20} className={pathname.includes('/profile') ? 'text-blue-500' : ''} /> 
            PROFILE
          </Link>
        </nav>

        {/* Sign Out Button */}
        <div className="pt-6 border-t border-white/5">
          <Link href="/">
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500/10 transition">
              <LogOut size={20} /> SIGN OUT
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}