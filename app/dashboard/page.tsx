"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Download, 
  Trash2, 
  FileText, 
  Clock, 
  User as UserIcon,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Dashboard() {
  const [files, setFiles] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchFiles();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setUserProfile(data);
    }
  };

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setFiles(data);
    setLoading(false);
  };

  const handleDelete = async (fileId: string, msgId: string) => {
    if (confirm("Are you sure you want to delete this file from Dashboard and Telegram?")) {
      // ၁။ Database မှဖျက်ခြင်း
      const { error } = await supabase.from('files').delete().eq('id', fileId);
      
      if (!error) {
        // ၂။ Telegram မှဖျက်ရန် API Call (API route ကို နောက်အဆင့်တွင် ပို့ပေးမည်)
        await fetch(`/api/telegram/delete?message_id=${msgId}`);
        setFiles(files.filter(f => f.id !== fileId));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d11] p-4 md:p-8 transition-colors duration-500">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Production <span className="text-blue-500">Lab</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
            <UserIcon size={14} className="text-blue-500" />
            Editor: <span className="text-blue-500">{userProfile?.full_name || 'Loading...'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/edit/new" className="bg-blue-600 hover:bg-blue-500 text-white p-3 md:px-6 md:py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
            <Plus size={20} />
            <span className="hidden md:block font-bold">New Project</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass p-6 rounded-[2rem] border-blue-500/10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Files</p>
          <h3 className="text-3xl font-black dark:text-white">{files.length}</h3>
        </div>
        <div className="glass p-6 rounded-[2rem] border-blue-500/10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">My Edits</p>
          <h3 className="text-3xl font-black dark:text-white">
            {files.filter(f => f.editor_name === userProfile?.full_name).length}
          </h3>
        </div>
        <div className="glass p-6 rounded-[2rem] border-blue-500/10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Storage Status</p>
          <h3 className="text-3xl font-black text-blue-500 uppercase">Unlimited</h3>
        </div>
      </div>

      {/* File List Table */}
      <div className="max-w-7xl mx-auto glass rounded-[2.5rem] overflow-hidden border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="font-bold flex items-center gap-2 dark:text-white">
            <Clock size={18} className="text-blue-500" /> Recent Activities
          </h2>
          <div className="flex gap-2">
            <div className="hidden md:flex items-center bg-black/20 rounded-xl px-3 border border-white/5">
              <Search size={16} className="text-slate-500" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none p-2 text-sm text-white" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] bg-white/5">
                <th className="px-8 py-4">Title / Info</th>
                <th className="px-8 py-4">Editor</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {files.map((file) => (
                <tr key={file.id} className="group hover:bg-blue-500/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold dark:text-white leading-none mb-1">{file.file_name}</p>
                        <p className="text-xs text-slate-500">{new Date(file.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-semibold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                      {file.editor_name}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold dark:text-slate-300">
                      {file.content_type === 'Series' ? `S${file.season_number} E${file.episode_number}` : 'MOVIE'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <a 
                        href={`https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/${file.telegram_file_id}`}
                        download
                        className="p-3 rounded-xl hover:bg-blue-500/20 text-blue-500 transition-all active:scale-90"
                      >
                        <Download size={18} />
                      </a>
                      <button 
                        onClick={() => handleDelete(file.id, file.telegram_message_id)}
                        className="p-3 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-all active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}