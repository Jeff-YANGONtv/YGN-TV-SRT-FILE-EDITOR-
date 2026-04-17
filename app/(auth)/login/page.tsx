"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Loader2, MonitorPlay, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0b0d11]">
      <div className="w-full max-w-md glass p-10 rounded-[2.5rem] relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[120px]" />
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="p-4 bg-blue-500/10 rounded-3xl mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <MonitorPlay size={48} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-3 font-medium uppercase tracking-widest">Production Lab Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Registered Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                required
                type="email" 
                placeholder="editor@yangontv.com"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all duration-300"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Secure Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all duration-300"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:shadow-blue-600/40 active:scale-[0.97] flex items-center justify-center gap-3 overflow-hidden group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                <span>Enter Terminal</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm font-medium">
            New Editor? <Link href="/signup" className="text-blue-500 hover:text-blue-400 transition-colors font-bold underline-offset-4 hover:underline">Register Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}