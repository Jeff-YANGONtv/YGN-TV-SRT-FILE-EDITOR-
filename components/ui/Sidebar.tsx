"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { File as FileEdit, UserCog, LogOut, X, MonitorPlay } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function Sidebar({ isOpen, toggleMenu }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/edit/new', label: 'EDIT', icon: FileEdit, match: '/edit' },
    { href: '/profile', label: 'PROFILE', icon: UserCog, match: '/profile' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#0d0f14] z-[70] border-r border-white/5 p-8 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <MonitorPlay size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-black italic tracking-tighter uppercase leading-none text-white">
                Yangon TV
              </h2>
              <p className="text-[8px] font-bold text-blue-500 tracking-widest mt-0.5 uppercase">
                Production Lab
              </p>
            </div>
          </div>
          <button onClick={toggleMenu} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition">
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map(({ href, label, icon: Icon, match }) => {
            const isActive = pathname.includes(match);
            return (
              <Link
                key={href}
                href={href}
                onClick={toggleMenu}
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
              toggleMenu();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500/10 transition border border-transparent hover:border-red-500/15"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
