"use client";
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Lock, Mail, User, ShieldPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      
      // ✅ Supabase Real Registration Logic
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        alert("Account ဖွင့်တာ အောင်မြင်ပါတယ်။ Email ထဲမှာ Confirm လုပ်ပေးပါ ");
        window.location.href = '/login';
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d11] flex items-center justify-center p-6 text-white overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <main className="w-full max-w-sm space-y-8 animate-fade-in relative z-10">
        
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/10">
            <ShieldPlus className="text-blue-500" size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              YGNTV <span className="text-blue-500">Production Lab</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 italic">
              Create Team Member Account
            </p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-[11px] text-red-400 font-bold text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
             {/* Name Field */}
             <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name (Your Editor Name)" 
                className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-5 pl-14 outline-none focus:border-blue-600 focus:bg-white/[0.05] transition-all font-medium text-sm"
              />
            </div>
            {/* Email Field */}
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Team Email Address" 
                className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-5 pl-14 outline-none focus:border-blue-600 focus:bg-white/[0.05] transition-all font-medium text-sm"
              />
            </div>
            {/* Password Field */}
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set Secure Password" 
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
            {loading ? "Creating..." : "Register Account"}
          </button>
        </form>

        <div className="text-center">
            <a href="/login" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-500 transition">
                Already have an account? Log In
            </a>
        </div>
      </main>
    </div>
  );
}
