"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { Menu, Save, Loader2, ArrowLeft, Link as LinkIcon, FileUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { parseSRTContent, subtitlesToSRTString } from '@/lib/srtParser';

// Auth check hook
const useAuthCheck = () => {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
        } else {
          setIsAuthed(true);
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  return { isAuthed, isLoading };
};

interface Subtitle {
  id: number;
  time: string;
  text: string;
  startTime: string;
  endTime: string;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  const { isAuthed, isLoading: authLoading } = useAuthCheck();
  const [title, setTitle] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('id', projectId)
        .single();

      if (data && !error) {
        setTitle(data.title);
        if (data.video_url) {
          setVideoUrl(data.video_url);
        }
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

  const parseSRT = (content: string) => {
    try {
      const parsed = parseSRTContent(content);
      // Map back to the local interface if needed, but here we can just use the parsed format
      // If the local interface 'Subtitle' only has 'time' instead of 'startTime/endTime', we adapt it
      const adapted: Subtitle[] = parsed.map(s => ({
        id: s.id,
        time: `${s.startTime} --> ${s.endTime}`,
        text: s.text,
        startTime: s.startTime,
        endTime: s.endTime
      }));
      setSubtitles(adapted);
    } catch (e) {
      console.error("Parse error:", e);
    }
  };

  const updateProject = async () => {
    if (!title || subtitles.length === 0) return alert("Data အစုံအလင်မရှိပါ!");
    setIsSyncing(true);

    // Use the robust utility for conversion
    const srtText = subtitlesToSRTString(subtitles);
    const fileName = `${Date.now()}_edited_${title.replace(/\s+/g, '_')}.srt`;
    const fileBody = new Blob([srtText], { type: 'text/plain' });

    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('history')
        .upload(fileName, fileBody);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('history')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('history')
        .update({ 
          title: title, 
          download_url: publicUrl,
          video_url: videoUrl || null
        })
        .eq('id', projectId);

      if (dbError) throw dbError;

      alert("Update အောင်မြင်ပါတယ် အစ်ကို!");
      router.push('/edit/new');

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0d11] text-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white flex flex-col">
      <Sidebar isOpen={isSidebarOpen} toggleMenu={toggleSidebar} />
      
      <header className="p-5 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0b0d11]/95 backdrop-blur-md z-40">
        <button onClick={() => router.push('/edit/new')} className="w-10 h-10 flex items-center justify-center rounded-xl glass active:scale-90 transition">
          <ArrowLeft size={20} className="text-slate-400" />
        </button>
        <div className="text-center">
            <h1 className="text-base font-black italic uppercase text-blue-500 tracking-tighter leading-none">Edit Mode</h1>
            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">Updating Lab Project</p>
        </div>
        <button onClick={toggleSidebar} className="w-10 h-10 flex items-center justify-center rounded-xl glass">
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
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase ml-4 tracking-widest">Project Title</label>
                <input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-5 outline-none focus:border-blue-500 font-bold italic text-sm" 
                />
            </div>

            <div className="space-y-6">
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

              {/* Subtitles List */}
              <div className="space-y-4">
                {subtitles.map((sub, idx) => (
                  <div key={sub.id} className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 animate-fade-in">
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
                      className="w-full bg-transparent outline-none text-slate-200 text-sm resize-none font-medium leading-relaxed" 
                      rows={2} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {!isLoading && (
        <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11] to-transparent z-50 md:z-40" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}>
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
