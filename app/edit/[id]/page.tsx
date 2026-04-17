"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  MonitorPlay, 
  Type, 
  Trash2, 
  Save, 
  Eraser, 
  Film, 
  Layers,
  ChevronLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import WaveSurfer from 'wavesurfer.js';

export default function SubtitleEditor() {
  // --- States ---
  const [contentType, setContentType] = useState('Movie');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState([{ id: 1, start: '00:00:01,000', end: '00:00:04,000', text: '' }]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Refs for Waveform & Video
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- 1. Local Video Handler ---
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      initWaveform(url);
    }
  };

  // --- 2. Waveform Initialization ---
  const initWaveform = (url: string) => {
    if (waveformRef.current) {
      setIsScanning(true);
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#3b82f6',
        progressColor: '#00f2ff',
        cursorColor: '#ffffff',
        height: 80,
        barWidth: 2,
      });
      wavesurfer.current.load(url);
      wavesurfer.current.on('ready', () => setIsScanning(false));
    }
  };

  // --- 3. Blank Line Cleaner ---
  const clearBlankLines = () => {
    const cleaned = subtitles.filter(sub => sub.text.trim() !== '');
    setSubtitles(cleaned.length > 0 ? cleaned : [{ id: Date.now(), start: '00:00:01', end: '00:00:04', text: '' }]);
  };

  // --- 4. Delete Single Line ---
  const deleteLine = (id: number) => {
    setSubtitles(subtitles.filter(sub => sub.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white p-4 md:p-6 pb-32">
      {/* Top Navigation & Info Box */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard" className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Production Lab <span className="text-blue-500">Editor</span></h1>
        </div>

        {/* Info Box Section */}
        <div className="glass p-6 rounded-[2rem] border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Layers size={12} /> Content Type
            </label>
            <select 
              className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50"
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="Movie">Movie</option>
              <option value="Series">Series</option>
            </select>
          </div>
          
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Film size={12} /> Title
            </label>
            <input type="text" placeholder="Stranger Things" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50" />
          </div>

          {contentType === 'Series' && (
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Season</label>
                <input type="number" placeholder="1" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Episode</label>
                <input type="number" placeholder="5" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Type size={12} /> Editor Name
            </label>
            <input type="text" placeholder="Zin Ko Ko Lwin" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50" />
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Video Preview & Waveform */}
        <div className="space-y-6">
          <div className="relative aspect-video glass rounded-[2.5rem] overflow-hidden flex items-center justify-center border-white/5 group">
            {videoSrc ? (
              <video ref={videoRef} src={videoSrc} controls className="w-full h-full object-contain" />
            ) : (
              <div className="text-center">
                <div className="p-6 bg-blue-500/10 rounded-full inline-block mb-4 text-blue-500">
                  <MonitorPlay size={48} />
                </div>
                <p className="text-slate-500 text-sm font-medium">Select a video to start scanning</p>
                <input type="file" accept="video/*" onChange={handleVideoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-[2rem] border-blue-500/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Audio Waveform Analysis</h3>
              {isScanning && <Loader2 className="animate-spin text-blue-500" size={16} />}
            </div>
            <div ref={waveformRef} className="rounded-xl overflow-hidden bg-black/20" />
          </div>
        </div>

        {/* Right: Subtitle List & Tools */}
        <div className="glass rounded-[2.5rem] flex flex-col h-[600px] border-white/5">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-2">
              <button onClick={clearBlankLines} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">
                <Eraser size={14} /> Blank Line Clear
              </button>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20">
              <Save size={14} /> Save to Cloud
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {subtitles.map((sub) => (
              <div key={sub.id} className="flex gap-4 items-start group">
                <div className="flex flex-col gap-1 text-[10px] font-mono text-slate-500 pt-3">
                  <input value={sub.start} className="bg-transparent border-none outline-none w-20" />
                  <input value={sub.end} className="bg-transparent border-none outline-none w-20" />
                </div>
                <textarea 
                  value={sub.text}
                  placeholder="Enter translation..."
                  className="flex-1 bg-black/30 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-blue-500/30 transition-all resize-none h-24"
                  onChange={(e) => {
                    const newSubs = [...subtitles];
                    newSubs.find(s => s.id === sub.id)!.text = e.target.value;
                    setSubtitles(newSubs);
                  }}
                />
                <button onClick={() => deleteLine(sub.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}