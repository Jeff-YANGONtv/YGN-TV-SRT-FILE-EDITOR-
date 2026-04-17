"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/ui/SplashScreen';

/**
 * Yangon TV - Production Lab
 * Main Landing Page Redirect Logic
 * Created by: Zin Ko Ko Lwin
 */

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ၁။ App စဖွင့်တာနဲ့ Splash Screen ကို ခဏပြမယ်
    // ၂။ ၃ စက္ကန့်ပြည့်တာနဲ့ Login Page ကို အလိုအလျောက် ပို့ပေးမယ်
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f0f2f5] dark:bg-[#0b0d11]">
      {/* Splash Screen Component ကို ဒီမှာ ခေါ်သုံးထားပါတယ် */}
      <SplashScreen />
      
      {/* Background မှာ တစ်ခုခု လွဲချော်ခဲ့ရင် ပြဖို့ Loading အသေးစား */}
      <div className="fixed bottom-10 left-0 right-0 text-center animate-pulse">
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">
          Initializing Terminal...
        </p>
      </div>
    </main>
  );
}