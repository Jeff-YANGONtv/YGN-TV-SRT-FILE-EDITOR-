"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { MonitorPlay, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0d11] relative overflow-hidden">
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="p-6 text-center border-b border-white/5 bg-[#0b0d11]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-center gap-2.5 mb-1">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
            <MonitorPlay size={14} className="text-white" />
          </div>
          <h1 className="text-xl font-black italic tracking-tighter leading-none uppercase">
            Yangon TV <span className="text-blue-500">Lab</span>
          </h1>
        </div>
        <p className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">
          Production Subtitle System
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-sm">

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black tracking-tight">
              {activeTab === 'signin' ? 'Welcome back' : 'Join the team'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === 'signin' ? 'Sign in to your editor account' : 'Create your editor account'}
            </p>
          </div>

          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-8">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${activeTab === 'signin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${activeTab === 'signup' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'signin' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Email Address</label>
                <input type="email" placeholder="example@ygn.tv" className="premium-input" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="premium-input pr-12" />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <a href="#" className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition">Forgot password?</a>
              </div>
              <Link href="/edit/new" className="block w-full pt-2">
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition active:scale-95">
                  Sign In
                </button>
              </Link>
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Full Name</label>
                <input type="text" placeholder="Zin Ko Ko Lwin" className="premium-input" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Email Address</label>
                <input type="email" placeholder="example@ygn.tv" className="premium-input" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">New Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="premium-input pr-12" />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 mt-2 transition active:scale-95">
                Create Account
              </button>
            </div>
          )}

        </div>
      </main>

      <footer className="p-6 text-center border-t border-white/5">
        <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-600">
          Developed by <span className="text-blue-500">YGN TV - OFFICE</span>
        </p>
      </footer>
    </div>
  );
}
