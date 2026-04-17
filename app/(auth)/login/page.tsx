"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, MonitorPlay } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(formData);
    if (error) {
      alert("အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။");
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-blue-500 tracking-tighter mb-2">Yangon TV</h1>
          <p className="text-slate-400 font-medium">Production Lab Terminal</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" placeholder="Email address" className="fb-input"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input required type="password" placeholder="Password" className="fb-input"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <button disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Log In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <button onClick={() => router.push('/signup')} className="btn-secondary">
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}