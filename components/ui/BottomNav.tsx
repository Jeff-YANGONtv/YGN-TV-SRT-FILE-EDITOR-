"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { File as FileEdit, CircleUser as UserCircle2, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/';
  if (isAuthPage) return null;

  const uniqueItems = [
    { name: 'Editor', href: '/edit/new', icon: FileEdit },
    { name: 'Profile', href: '/profile', icon: UserCircle2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0b0d11]/95 backdrop-blur-xl border-t border-white/8 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center h-16 px-2">
        {uniqueItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/edit/new' && pathname.startsWith(item.href));

          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 min-w-[64px] py-2">
              <div className={cn(
                "p-2 rounded-xl transition-all duration-200",
                isActive ? "text-blue-500 bg-blue-500/10" : "text-slate-500 hover:text-slate-300"
              )}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest transition-colors",
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
