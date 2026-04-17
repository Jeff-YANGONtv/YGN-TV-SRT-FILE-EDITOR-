"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { Menu, Download } from 'lucide-react';

export default function HistoryPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'movie' | 'series'>('movie');

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar Component */}
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
        
        {/* Header Title */}
        <div className="flex justify-between items-end px-2">
          <h2 className="text-xl font-black italic tracking-tighter uppercase">Team History</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Sync</span>
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

        {/* Movie Table */}
        {activeTab === 'movie' && (
          <div className="overflow-x-auto custom-scrollbar glass rounded-[2rem] p-2 animate-fade-in">
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
                {/* Sample Row 1 */}
                <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zin" className="w-6 h-6 rounded-full" />
                    Zin Ko Ko Lwin
                  </td>
                  <td className="p-4 italic text-white">The Batman (2022)</td>
                  <td className="p-4 opacity-70">18 Apr 2026</td>
                  <td className="p-4 text-center">
                    <button className="bg-blue-600/20 text-blue-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-blue-500/20 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 mx-auto">
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
                {/* Sample Row 2 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold flex items-center gap-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hsu" className="w-6 h-6 rounded-full opacity-80" />
                    Hsu Hsu
                  </td>
                  <td className="p-4 italic">Damsel (2024)</td>
                  <td className="p-4 opacity-70">17 Apr 2026</td>
                  <td className="p-4 text-center">
                    <button className="bg-blue-600/20 text-blue-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-blue-500/20 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 mx-auto">
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Series Table */}
        {activeTab === 'series' && (
          <div className="overflow-x-auto custom-scrollbar glass rounded-[2rem] p-2 animate-fade-in">
            <table className="w-full text-left text-[11px] min-w-[600px]">
              <thead>
                <tr className="text-blue-500 font-black uppercase tracking-widest border-b border-white/5">
                  <th className="p-4">Editor</th>
                  <th className="p-4">Series Title</th>
                  <th className="p-4 text-center">SS</th>
                  <th className="p-4 text-center">EP</th>
                  <th className="p-4">Edited On</th>
                  <th className="p-4 text-center">Download</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 font-medium">
                {/* Sample Row 1 */}
                <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold flex items-center gap-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Cola" className="w-6 h-6 rounded-full opacity-80" />
                    Cola
                  </td>
                  <td className="p-4 italic text-white font-bold">Vincenzo</td>
                  <td className="p-4 text-center font-mono text-blue-400">01</td>
                  <td className="p-4 text-center font-mono text-blue-400">16</td>
                  <td className="p-4 opacity-70">18 Apr 2026</td>
                  <td className="p-4 text-center">
                    <button className="bg-blue-600/20 text-blue-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-blue-500/20 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 mx-auto">
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
                 {/* Sample Row 2 */}
                 <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold flex items-center gap-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zin" className="w-6 h-6 rounded-full" />
                    Zin Ko Ko Lwin
                  </td>
                  <td className="p-4 italic text-white font-bold">Queen of Tears</td>
                  <td className="p-4 text-center font-mono text-blue-400">01</td>
                  <td className="p-4 text-center font-mono text-blue-400">12</td>
                  <td className="p-4 opacity-70">16 Apr 2026</td>
                  <td className="p-4 text-center">
                    <button className="bg-blue-600/20 text-blue-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-blue-500/20 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 mx-auto">
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}