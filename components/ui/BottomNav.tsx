"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileEdit, Library, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Browser မှာ Render မလုပ်ခင် (သို့မဟုတ်) Login/Signup page တွေမှာ ဖျောက်ထားမယ်
  if (!mounted) return null;
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/';
  if (isAuthPage) return null;

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Editor', href: '/edit/new', icon: FileEdit },
    { name: 'Projects', href: '/projects', icon: Library },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden backdrop-blur-xl bg-black/80 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Sub-routes တွေမှာပါ Active ဖြစ်နေအောင် .startsWith သုံးထားပါတယ်
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 group">
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-500",
                isActive 
                  ? "text-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]" 
                  : "text-slate-500 group-hover:text-blue-300"
              )}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.15em] transition-colors",
                isActive ? "text-blue-400" : "text-slate-600"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};