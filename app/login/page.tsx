"use client";
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        window.location.href = '/edit/new';
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d11] flex items-center justify-center p-6 text-white overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <main className="w-full max-w-sm space-y-8 animate-fade-in relative z-10">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/10">
            <ShieldCheck className="text-blue-500" size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              Welcome <span className="text-blue-500">Back</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 italic">
              Login to Production Lab
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-[11px] text-red-400 font-bold text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-5 pl-14 outline-none focus:border-blue-600 focus:bg-white/[0.05] transition-all font-medium text-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-5 pl-14 outline-none focus:border-blue-600 focus:bg-white/[0.05] transition-all font-medium text-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {loading ? "Authenticating..." : "Login to Lab"}
          </button>
        </form>

        <div className="text-center">
            <a href="/" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-500 transition">
                Don't have an account? Register Now
            </a>
        </div>
      </main>
    </div>
  );
}
