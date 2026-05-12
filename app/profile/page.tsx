"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { supabase } from '@/lib/supabase';
import { Menu, Camera, LogOut, Loader2, User } from 'lucide-react';

// Google Apps Script URL for fetching history data
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiU7Z_rbs_LN5iz8rEGs8FI8AJi5ckGXsmykFW2c9nczFqZ8HQVtUBhNwq68LOIe44_w/exec';

export default function ProfilePage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ movie: 0, series: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
    }
    getProfile();

    async function fetchStats() {
      setIsLoading(true);
      try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
        const result = await response.json();
        
        if (result.success && result.data) {
          const movieCount = result.data.filter((i: any) => i.type?.toLowerCase() === 'movie').length;
          const seriesCount = result.data.filter((i: any) => i.type?.toLowerCase() === 'series').length;
          setStats({ movie: movieCount, series: seriesCount });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d11] text-white">
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
          <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Zin'}`} alt="Profile" className="w-full h-full rounded-full" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full p-6 space-y-8 animate-fade-in pt-10">
        
        {/* Live Stats Dashboard */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-8 rounded-[2.5rem] text-center border-blue-500/10">
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto text-blue-500" size={20} />
            ) : (
              <h4 className="text-3xl font-black text-blue-500 italic">{stats.movie}</h4>
            )}
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Movies Done</p>
          </div>
          <div className="glass p-8 rounded-[2.5rem] text-center border-green-500/10">
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto text-green-500" size={20} />
            ) : (
              <h4 className="text-3xl font-black text-green-500 italic">{stats.series}</h4>
            )}
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Series Done</p>
          </div>
        </div>

        {/* Profile Identity */}
        <div className="text-center space-y-4 pt-4">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full border-4 border-blue-600/30 p-1 bg-slate-800">
              <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Zin'}`} alt="Avatar" className="w-full h-full rounded-full" />
            </div>
            <button className="absolute bottom-1 right-1 bg-blue-600 w-8 h-8 rounded-full border-4 border-[#0b0d11] flex items-center justify-center text-xs">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">{profile?.full_name || user?.email?.split('@')[0] || 'Member'}</h2>
            <p className="text-[9px] font-bold text-blue-500 tracking-widest uppercase px-4 py-1.5 bg-blue-500/10 rounded-full inline-block border border-blue-500/10 mt-2">
              {profile?.role || 'Team Member'}
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-4 pt-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase ml-4 tracking-widest">Email Address</label>
            <input type="text" value={user?.email || ''} disabled className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-4 outline-none font-bold text-sm text-slate-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase ml-4 tracking-widest">Full Name</label>
            <input type="text" defaultValue={profile?.full_name || ''} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-4 outline-none focus:border-blue-500 font-bold text-sm text-slate-200" />
          </div>
          
          <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all mt-4">
            Update Profile
          </button>
        </div>

        {/* Sign Out Section */}
        <div className="pt-6">
            <button 
              onClick={handleSignOut}
              className="w-full py-4 bg-red-600/5 text-red-500 border border-red-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
                <LogOut size={14} /> Sign Out Account
            </button>
        </div>

      </main>
    </div>
  );
}
