"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function AuthPage() {
  // Tab တွေကို ထိန်းချုပ်မယ့် React State ပါ
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Navigation */}
      <header className="p-6 text-center border-b border-white/5 bg-[#0b0d11]/80 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-xl font-black italic tracking-tighter leading-none uppercase">
          Yangon TV <span className="text-blue-500">Production Lab</span>
        </h1>
        <p className="text-[9px] font-bold text-slate-500 tracking-[0.15em] uppercase mt-1">
          Subtitle Editor Group
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-sm space-y-8">
          
          {/* Auth Tabs */}
          <div className="flex border-b border-white/5 px-2">
            <button 
              onClick={() => setActiveTab('signin')} 
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'signin' ? 'active-tab' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setActiveTab('signup')} 
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'signup' ? 'active-tab' : 'text-slate-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Email Address</label>
                <input type="email" placeholder="example@ygn.tv" className="premium-input" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Password</label>
                <input type="password" placeholder="••••••••" className="premium-input" />
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:underline">Forget password?</a>
              </div>
              
              {/* Sign In နှိပ်ရင် Editor Page ကို ဝင်သွားအောင် Link ချိတ်ပေးထားပါတယ် */}
              <Link href="/edit/new" className="block w-full">
                <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition active:scale-95">
                  Sign In
                </button>
              </Link>
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Full Name</label>
                <input type="text" placeholder="Zin Ko Ko Lwin" className="premium-input" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Email Address</label>
                <input type="email" placeholder="example@ygn.tv" className="premium-input" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">New Password</label>
                <input type="password" placeholder="••••••••" className="premium-input" />
              </div>
              <button className="w-full py-5 bg-[#42b72a] hover:bg-[#36a420] rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 mt-4 transition active:scale-95">
                Create Account
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center border-t border-white/5 opacity-50">
        <p className="text-[9px] font-black tracking-[0.3em] uppercase">
          Developed by <span className="text-blue-500">YGN TV - OFFICE</span>
        </p>
      </footer>
    </div>
  );
}