"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { Menu, FileUp, Eraser, Save, Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabase = createClient(
  "https://jrgehklgjajjiwjtzrzk.supabase.co",
  "sb_publishable_anDWJPy4dk8B7AJFGCGUlw_5I-DTYBN"
);

interface Subtitle {
  id: number;
  time: string;
  text: string;
}

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id; // URL ထဲက ID ကို ယူတာပါ

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // ✅ 1. Database ကနေ မူရင်း Data ကို ပြန်ဆွဲထုတ်ခြင်း
  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      // Database ကနေ project info ယူမယ်
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('id', projectId)
        .single();

      if (data && !error) {
        setTitle(data.title);
        // SRT File URL ကနေ စာသားကို ပြန်ဖတ်မယ်
        try {
          const res = await fetch(data.download_url);
          const srtText = await res.text();
          parseSRT(srtText);
        } catch (e) {
          console.error("File loading error:", e);
        }
      }
      setIsLoading(false);
    }
    if (projectId) fetchProject();
  }, [projectId]);

  // SRT စာသားကို Editor Format ပြောင်းတဲ့ Function
  const parseSRT = (content: string) => {
    const blocks = content.trim().split(/\n\s*\n/);
    const parsed = blocks.map((b, i) => {
      const lines = b.trim().split('\n');
      if (lines.length >= 3) {
        return { id: i + 1, time: lines[1], text: lines.slice(2).join('\n') };
      }
      return null;
    }).filter((s): s is Subtitle => s !== null);
    setSubtitles(parsed);
  };

  // ✅ 2. Update Logic (မူရင်းဖိုင်ကို ဖျက်ပြီး အသစ်တင်တာ သို့မဟုတ် Update လုပ်တာ)
  const updateProject = async () => {
    if (subtitles.length === 0) return;
    setIsSyncing(true);

    const srtText = subtitles.map(s => `${s.id}\n${s.time}\n${s.text}\n\n`).join('');
    const fileName = `${Date.now()}_edited_${title.replace(/\s+/g, '_')}.srt`;
    const fileBody = new Blob([srtText], { type: 'text/plain' });

    try {
      // Step A: Storage အသစ်ထဲ တင်မယ်
      const { data: storageData, error: storageError } = await supabase.storage
        .from('history')
        .upload(fileName, fileBody);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('history')
        .getPublicUrl(fileName);

      // Step B: Database မှာ Link အသစ်နဲ့ Title ကို Update လုပ်မယ်
      const { error: dbError } = await supabase
        .from('history')
        .update({ 
          title: title, 
          download_url: publicUrl,
          created_at: new Date() // ပြင်တဲ့အချိန်ကို Update လုပ်ချင်ရင်
        })
        .eq('id', projectId);

      if (dbError) throw dbError;

      alert("Project ကို အောင်မြင်စွာ Update လုပ်ပြီးပါပြီ!");
      window.location.href = '/history';

    } catch (err: any) {
      alert("Update Error: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white flex flex-col">
      <Sidebar isOpen={isSidebarOpen} toggleMenu={toggleSidebar} />
      
      {/* Header */}
      <header className="p-5 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0b0d11]/95 backdrop-blur-md z-40">
        <button onClick={() => window.location.href='/history'} className="w-10 h-10 flex items-center justify-center rounded-xl glass">
          <ArrowLeft size={20} className="text-slate-400" />
        </button>
        <div class="text-center">
            <h1 class="text-base font-black italic uppercase text-blue-500 tracking-tighter leading-none">Edit Mode</h1>
            <p class="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">Updating Lab Project</p>
        </div>
        <button onClick={toggleSidebar} class="w-10 h-10 flex items-center justify-center rounded-xl glass">
            <Menu size={20} className="text-slate-300" />
        </button>
      </header>

      <main className="max-w-xl mx-auto w-full p-4 space-y-6 flex-1 pb-32">
        {isLoading ? (
          <div className="py-40 text-center opacity-30 flex flex-col items-center">
             <Loader2 className="animate-spin mb-4" size={30} />
             <p className="text-[10px] font-black uppercase tracking-widest">Loading Project Data</p>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-4 tracking-widest">Project Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-5 outline-none focus:border-blue-500 font-bold italic text-sm" />
            </div>

            {/* Subtitle Editor List */}
            <div className="space-y-4">
              {subtitles.map((sub, idx) => (
                <div key={sub.id} className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5">
                  <div className="flex justify-between text-[9px] font-black text-blue-500 mb-3 uppercase tracking-widest">
                    <span>Line #{sub.id}</span>
                    <span className="font-mono text-slate-500">{sub.time}</span>
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
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Save Button */}
      {!isLoading && (
        <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11] to-transparent z-40">
          <button 
            onClick={updateProject}
            disabled={isSyncing}
            className="w-full max-w-xl mx-auto flex items-center justify-center gap-3 py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSyncing ? "Updating Lab..." : "Update Changes"}
          </button>
        </div>
      )}
    </div>
  );
        }
