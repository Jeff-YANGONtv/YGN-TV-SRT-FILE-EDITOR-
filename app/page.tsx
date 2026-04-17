"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/ui/SplashScreen';

/**
 * YANGON TV - PRODUCTION LAB
 * Master Entry Point (Root Page)
 * အဝင်ဝမှာ Splash Screen ပြပြီး Login သို့ Redirect လုပ်ပေးမည့်ဖိုင်
 */

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ၂.၅ စက္ကန့် (Splash ပြချိန်) ပြည့်ရင် Login စာမျက်နှာကို ပို့ပါမယ်
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0b0d11] flex items-center justify-center overflow-hidden">
      {/* SplashScreen Component က Logo နဲ့ Loading animation ကို ပြပေးမှာပါ 
      */}
      <SplashScreen />

      {/* အောက်ခြေမှာ ပေါ်မယ့် Loading စာသားလေး (Option) */}
      <div className="absolute bottom-12 w-full text-center animate-pulse">
        <p className="text-blue-500/50 text-[10px] font-bold uppercase tracking-[0.5em]">
          System Loading
        </p>
      </div>
    </main>
  );
}