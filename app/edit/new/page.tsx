"use client";
import React, { useState, useRef } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { Menu, Video, FileUp, Eraser, Clock, Trash2, Plus, Save } from 'lucide-react';
import Link from 'next/link';

interface Subtitle {
  id: number;
  time: string;
  text: string;
}

export default function SRTEditorMaster() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [metaType, setMetaType] = useState<'movie' | 'series'>('movie');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    { id: 1, time: "00:00:01,240 --> 00:00:04,500", text: "မင်္ဂလာပါ၊ Yangon TV မှ ကြိုဆိုပါတယ်။" }
  ]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoSrc(URL.createObjectURL(file));
  };

  const clearBlankLines = () => {
    const cleaned = subtitles.filter(s => s.text.trim() !== '');
    setSubtitles(cleaned.length > 0 ? cleaned : [{ id: Date.now(), time: "00:00:01,000 --> 00:00:04,000", text: '' }]);
  };

  const addLine = () => {
    setSubtitles(prev => [...prev, { id: Date.now(), time: "00:00:00,000 --> 00:00:00,000", text: '' }]);
  };

  const updateSubtitle = (id: number, field: 'time' | 'text', value: string) => {
    setSubtitles(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d11]">
      <Sidebar isOpen={isSidebarOpen} toggleMenu={toggleSidebar} />

      <header className="p-5 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0b0d11]/90 backdrop-blur-md z-40">
        <button onClick={toggleSidebar} className="w-10 h-10 flex items-center justify-center rounded-xl glass active:scale-90 transition">
          <Menu className="text-slate-300" size={22} />
        </button>
        <div className="text-center">
          <h1 className="text-base font-black italic tracking-tighter leading-none uppercase">
            Yangon TV <span className="text-blue-500">Lab</span>
          </h1>
          <p className="text-[8px] font-bold text-slate-500 tracking-[0.1em] uppercase mt-1">
            Subtitle File Editor
          </p>
        </div>
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600/40 p-0.5 cursor-pointer">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zin" alt="Profile" className="w-full h-full rounded-full" />
          </div>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto w-full p-4 space-y-5 flex-1 animate-fade-in pb-28">

        <div
          className="relative glass aspect-video rounded-[1.8rem] flex flex-col items-center justify-center overflow-hidden group border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
          onClick={() => !videoSrc && document.getElementById('video-input')?.click()}
        >
          {videoSrc ? (
            <video src={videoSrc} controls className="w-full h-full object-contain rounded-[1.8rem]" />
          ) : (
            <div className="flex flex-col items-center gap-3 pointer-events-none">
              <div className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                <Video size={28} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Tap to load Preview Video</p>
                <p className="text-[9px] text-slate-500 mt-1">MP4, MKV, AVI supported</p>
              </div>
            </div>
          )}
          <input id="video-input" type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
        </div>

        <div className="space-y-3">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
            <button
              onClick={() => setMetaType('movie')}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-200 ${metaType === 'movie' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              Movie
            </button>
            <button
              onClick={() => setMetaType('series')}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-200 ${metaType === 'series' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              Series
            </button>
          </div>

          {metaType === 'movie' && (
            <div className="p-5 glass rounded-[1.8rem] space-y-3 animate-fade-in">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Movie Title</label>
              <input type="text" placeholder="e.g. The Batman (2022)" className="premium-input" />
              <input type="text" placeholder="Editor Name" className="premium-input" />
            </div>
          )}

          {metaType === 'series' && (
            <div className="p-5 glass rounded-[1.8rem] space-y-3 animate-fade-in">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Series Info</label>
              <input type="text" placeholder="e.g. Vincenzo" className="premium-input" />
              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="Season" className="premium-input text-center" />
                <input type="number" placeholder="Episode" className="premium-input text-center" />
                <input type="text" placeholder="Editor" className="premium-input text-center" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="relative py-10 glass rounded-[1.8rem] border-2 border-dashed border-blue-500/15 text-center hover:border-blue-500/40 hover:bg-blue-600/5 transition-all cursor-pointer">
            <FileUp className="mx-auto text-blue-500 mb-3" size={36} />
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Upload SRT File</p>
            <p className="text-[9px] text-slate-500 mt-1">.srt format only</p>
            <input type="file" accept=".srt" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={clearBlankLines}
              className="py-4 glass rounded-2xl text-[9px] font-black text-red-400 uppercase flex items-center justify-center gap-2 border border-red-500/10 active:scale-95 transition hover:bg-red-500/10 hover:border-red-500/30"
            >
              <Eraser size={15} /> Clear Blanks
            </button>
            <button className="py-4 glass rounded-2xl text-[9px] font-black text-blue-400 uppercase flex items-center justify-center gap-2 border border-blue-500/10 active:scale-95 transition hover:bg-blue-500/10 hover:border-blue-500/30">
              <Clock size={15} /> Shift Offset
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtitle Lines ({subtitles.length})</h3>
            <button onClick={addLine} className="flex items-center gap-1.5 text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition">
              <Plus size={12} /> Add Line
            </button>
          </div>

          {subtitles.map((sub, index) => (
            <div key={sub.id} className="bg-white/[0.025] p-5 rounded-[1.6rem] border border-white/5 hover:border-blue-500/25 transition-colors group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Line #{index + 1}</span>
                <button
                  onClick={() => setSubtitles(prev => prev.filter(s => s.id !== sub.id))}
                  className="w-7 h-7 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <input
                type="text"
                value={sub.time}
                onChange={(e) => updateSubtitle(sub.id, 'time', e.target.value)}
                className="bg-transparent text-[10px] font-mono text-blue-400 mb-3 block outline-none border-b border-white/5 focus:border-blue-500/50 w-full pb-1 transition-colors"
              />
              <textarea
                value={sub.text}
                onChange={(e) => updateSubtitle(sub.id, 'text', e.target.value)}
                className="bg-transparent w-full text-sm font-medium outline-none resize-none leading-relaxed text-slate-200 placeholder:text-slate-600"
                rows={2}
                placeholder="Enter translation..."
              />
            </div>
          ))}

          <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 mt-2 active:scale-95 transition-all text-white flex items-center justify-center gap-2">
            <Save size={16} /> Save & Upload
          </button>
        </div>

      </main>
    </div>
  );
}
