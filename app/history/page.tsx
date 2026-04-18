"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { Menu, Download, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase Connection
const supabase = createClient(
  "https://jrgehklgjajjiwjtzrzk.supabase.co",
  "sb_publishable_anDWJPy4dk8B7AJFGCGUlw_5I-DTYBN"
);

export default function HistoryPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'movie' | 'series'>('movie');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // ⭐ Database ကနေ Data ဆွဲထုတ်ခြင်း
  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setHistoryData(data || []);
      setIsLoading(false);
    }
    fetchHistory();
  }, []);

  // Tab အလိုက် Data စစ်ထုတ်ခြင်း
  const filteredData = historyData.filter(item => 
    item.type?.toLowerCase() === activeTab.toLowerCase()
  );

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
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zin" alt="Profile" className="w-full h-full rounded-full" />
        </div>
      </header>

      {/* Main History Content */}
      <main className="max-w-4xl mx-auto w-full p-4 space-y-6 flex-1 animate-fade-in pb-10">
        
        <div className="flex justify-between items-end px-2">
          <h2 className="text-xl font-black italic tracking-tighter uppercase">Team History</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-spin' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                {isLoading ? 'Fetching...' : 'Live Sync'}
            </span>
          </div>
        </div>

        {/* Tabs for Movie & Series */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => setActiveTab('movie')} 
            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'movie' ? 'active-tab border-b-2 border-blue-500 text-white' : 'text-slate-500'
            }`}
          >
            Movie History
          </button>
          <button 
            onClick={() => setActiveTab('series')} 
            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'series' ? 'active-tab border-b-2 border-blue-500 text-white' : 'text-slate-500'
            }`}
          >
            Series History
          </button>
        </div>

        {/* Dynamic Table Content */}
        <div className="overflow-x-auto custom-scrollbar glass rounded-[2rem] p-2 animate-fade-in">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center opacity-20">
               <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
               <p className="text-[10px] font-black uppercase">Loading Database</p>
            </div>
          ) : (
            <table className="w-full text-left text-[11px] min-w-[500px]">
              <thead>
                <tr className="text-blue-500 font-black uppercase tracking-widest border-b border-white/5">
                  <th className="p-4">Editor</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Edited On</th>
                  <th className="p-4 text-center">Download</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 font-medium">
                {filteredData.length > 0 ? filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.editor_name}`} className="w-6 h-6 rounded-full bg-slate-800" />
                      {item.editor_name}
                    </td>
                    <td className="p-4 italic text-white font-bold uppercase truncate max-w-[200px]">
                      {item.title}
                    </td>
                    <td className="p-4 opacity-70 font-mono">
                      {new Date(item.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4 text-center">
                      <a 
                        href={item.download_url} 
                        target="_blank" 
                        className="bg-blue-600/20 text-blue-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-blue-500/20 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 mx-auto w-fit"
                      >
                        <Download size={12} /> Download
                      </a>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center opacity-20 font-black uppercase tracking-widest">
                      No {activeTab} Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
      }
