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
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert("အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။");
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0b0d11] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter mb-2">Yangon TV</h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 font-medium leading-tight">
            Production Lab ကနေ <br /> အဖွဲ့သားများကို ကြိုဆိုပါတယ်။
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1c23] p-5 rounded-xl shadow-xl border border-gray-200 dark:border-white/5">
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              required
              type="email" 
              placeholder="Email address"
              className="w-full px-4 py-3 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              required
              type="password" 
              placeholder="Password"
              className="w-full px-4 py-3 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xl transition-all active:scale-[0.98] flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Log In"}
            </button>
          </form>

          <div className="mt-4 pt-6 border-t border-gray-200 dark:border-white/5 text-center">
            <button 
              onClick={() => router.push('/signup')}
              className="bg-[#42b72a] hover:bg-[#36a420] text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}