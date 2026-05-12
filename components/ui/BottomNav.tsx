"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { File as FileEdit, CircleUser as UserCircle2, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const pathname = usePathname();
  // Hide BottomNav on auth pages (login, register)
  const isAuthPage = pathname === '/' || pathname === '/login';
  if (isAuthPage) return null;

  const uniqueItems = [
    { name: 'Editor', href: '/edit/new', icon: FileEdit },
    { name: 'Profile', href: '/profile', icon: UserCircle2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0b0d11]/95 backdrop-blur-xl border-t border-white/8 md:hidden" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}>
      <div className="flex justify-around items-center h-16 px-2 max-w-xl mx-auto w-full">
        {uniqueItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/profile' && pathname.startsWith(item.href));

          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 flex-1 py-2 justify-center">
              <div className={cn(
                "p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center",
                isActive ? "text-blue-500 bg-blue-500/10" : "text-slate-500 hover:text-slate-300"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                "text-[7px] font-black uppercase tracking-widest transition-colors text-center",
                isActive ? "text-blue-500" : "text-slate-600"
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
