"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { Menu, FileUp, Eraser, Clock, Save, Loader2, History, Link as LinkIcon } from 'lucide-react';
import { parseSRTContent, subtitlesToSRTString } from '@/lib/srtParser';

interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export default function SRTEditorMaster() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [metaType, setMetaType] = useState<'movie' | 'series'>('movie');
  const [title, setTitle] = useState('');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]); // အစမှာ Sample မထားတော့ပါ
  const [isSyncing, setIsSyncing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // ✅ 1. SRT File Upload Logic (Improved with robust parsing)
  const handleSRTUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseSRTContent(content);
        setSubtitles(parsed);
      } catch (error) {
        alert('Error parsing SRT file. Please check the file format.');
        console.error('SRT parsing error:', error);
      }
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // ✅ 2. Blank Lines Delete Logic
  const clearBlankLines = () => {
    if (subtitles.length === 0) return;
    const cleaned = subtitles.map(s => ({
      ...s,
      text: s.text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .join('\n')
    }));
    setSubtitles(cleaned);
  };

  // ✅ 3. Save to Google Apps Script (with UTF-8 encoding)
  const saveToGoogleAppsScript = async () => {
    if (!title || subtitles.length === 0) {
      return alert("Title နဲ့ SRT ဖိုင် လိုအပ်ပါတယ် အစ်ကို!");
    }

    setIsSyncing(true);
    let finalTitle = title;
    if (metaType === 'series') finalTitle += ` - S${season}E${episode}`;

    try {
      // Convert subtitles to SRT format string
      const srtContent = subtitlesToSRTString(subtitles);

      // Prepare JSON payload
      const payload = {
        srtContent: srtContent,
        editorName: "Zin KO KO Lwin",
        movieTitle: title,
        season: metaType === 'series' ? season : null,
        episode: metaType === 'series' ? episode : null,
        videoUrl: videoUrl || null,
        // Note: Local files are not persisted to database, only URLs are stored
      };

      // Send to our internal API that handles Drive, Sheets, and Telegram
      const response = await fetch('/api/save-all', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        alert("အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ!");
        // Reset form
        setTitle('');
        setSubtitles([]);
        setSeason('');
        setEpisode('');
      } else {
        alert("Error: " + result.message);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
      console.error('Save error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white flex flex-col">
      <Sidebar isOpen={isSidebarOpen} toggleMenu={toggleSidebar} />
      
      {/* Header */}
      <header className="p-5 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0b0d11]/90 backdrop-blur-md z-40">
        <button onClick={toggleSidebar} className="w-10 h-10 flex items-center justify-center rounded-xl glass active:scale-90 transition">
          <Menu size={22} className="text-slate-300" />
        </button>
        <div className="text-center">
            <h1 className="text-base font-black italic uppercase text-blue-500 tracking-tighter leading-none">Yangon TV Lab</h1>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Subtitle Editor Unit</p>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-blue-600/40 p-0.5" onClick={() => window.location.href='/profile'}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zin" className="w-full h-full rounded-full" alt="Profile" />
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full p-4 space-y-6 flex-1 pb-32">
        {/* Project Type */}
        <div className="p-1 bg-white/5 rounded-[2rem] flex mt-2">
          <button onClick={() => setMetaType('movie')} className={`flex-1 py-3 rounded-[1.7rem] font-black text-[10px] uppercase transition-all ${metaType === 'movie' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Movie</button>
          <button onClick={() => setMetaType('series')} className={`flex-1 py-3 rounded-[1.7rem] font-black text-[10px] uppercase transition-all ${metaType === 'series' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Series</button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title Name..." className="w-full bg-white/5 border border-white/10 rounded-[1.2rem] p-4 outline-none focus:border-blue-500 italic font-bold text-sm" />
          {metaType === 'series' && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <input value={season} onChange={e => setSeason(e.target.value)} placeholder="Season" className="bg-white/5 border border-white/10 rounded-[1.2rem] p-4 text-center outline-none focus:border-blue-500 text-sm" />
              <input value={episode} onChange={e => setEpisode(e.target.value)} placeholder="Episode" className="bg-white/5 border border-white/10 rounded-[1.2rem] p-4 text-center outline-none focus:border-blue-500 text-sm" />
            </div>
          )}
        </div>

        {/* Video Player Section */}
        {(videoUrl || videoFile) && (
          <div className="space-y-2 animate-fade-in">
            <label className="text-[10px] font-black text-slate-600 uppercase ml-4 tracking-widest">Video Preview</label>
                  <VideoPlayer videoUrl={videoUrl} videoFile={videoFile} subtitles={subtitles as any} />
          </div>
        )}

        {/* Video Input Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-600 uppercase ml-4 tracking-widest">Video File (Optional)</label>
          <div className="grid grid-cols-2 gap-2">
            {/* File Upload */}
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setVideoFile(e.target.files[0]);
                    setVideoUrl(''); // Clear URL if file is selected
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <button className="w-full px-4 py-4 glass rounded-[1.2rem] text-[10px] font-black uppercase text-green-500 border border-green-500/10 hover:bg-green-600/10 transition flex items-center justify-center gap-2">
                <FileUp size={14} /> Upload Local
              </button>
            </div>
            {/* URL Input */}
            <div className="relative">
              <input
                type="text"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="Or paste URL..."
                className="w-full bg-white/5 border border-white/10 rounded-[1.2rem] p-4 outline-none focus:border-blue-500 italic font-medium text-sm"
              />
              <button
                onClick={() => {
                  if (videoUrlInput.trim()) {
                    setVideoUrl(videoUrlInput.trim());
                    setVideoUrlInput('');
                    setVideoFile(null); // Clear file if URL is selected
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 text-blue-500 hover:text-blue-400 transition"
                title="Add URL"
              >
                <LinkIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="flex gap-3">
          <button onClick={clearBlankLines} className="flex-1 py-4 glass rounded-[1.5rem] text-[10px] font-black uppercase text-red-500 border border-red-500/10 hover:bg-red-500/10 transition flex items-center justify-center gap-2">
            <Eraser size={14} /> Blank Delete
          </button>
          <button onClick={() => alert("Shift Offset functionality coming soon!")} className="flex-1 py-4 glass rounded-[1.5rem] text-[10px] font-black uppercase text-blue-500 border border-blue-500/10 hover:bg-blue-600/10 transition flex items-center justify-center gap-2">
            <Clock size={14} /> Shift Offset
          </button>
        </div>

        {/* Upload Box (အမှန်တကယ် ဖိုင်လက်ခံသည်) */}
        <div className="relative glass p-10 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center cursor-pointer hover:border-blue-500/30 transition-all">
          <input type="file" accept=".srt" onChange={handleSRTUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          <FileUp size={32} className="mx-auto text-blue-500 mb-3" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload SRT File</p>
        </div>

        {/* Subtitle Editor List */}
        <div className="space-y-4">
          {subtitles.length > 0 ? subtitles.map((sub, idx) => (
            <div key={sub.id} className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 animate-fade-in">
              <div className="flex justify-between text-[9px] font-black text-blue-500 mb-3 uppercase tracking-widest">
                <span>Line #{sub.id}</span>
                <span className="font-mono text-slate-500 text-[8px]">{sub.startTime} → {sub.endTime}</span>
              </div>
              <textarea 
                value={sub.text} 
                onChange={e => {
                  const newSubs = [...subtitles];
                  newSubs[idx].text = e.target.value;
                  setSubtitles(newSubs);
                }}
                className="w-full bg-transparent outline-none text-slate-200 text-sm resize-none font-medium leading-relaxed" rows={2} 
              />
            </div>
          )) : (
            <div className="text-center py-20 opacity-20">
                <i className="fa-solid fa-keyboard text-4xl mb-4"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">No Subtitles Loaded</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11] to-transparent z-50 md:z-40" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}>
        <button 
          onClick={saveToGoogleAppsScript}
          disabled={isSyncing}
          className="w-full max-w-xl mx-auto flex items-center justify-center gap-3 py-5 bg-[#42b72a] hover:bg-[#3bab25] rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-green-600/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSyncing ? "Saving to Google Drive..." : "Save & Upload to Drive"}
        </button>
      </div>
    </div>
  );
}
