'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-72 h-full flex flex-col justify-between bg-surface-dark border-r border-border-dark shrink-0 transition-all duration-300">
      <div className="flex flex-col p-6 gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-dark border border-primary/20 shadow-lg shadow-primary/20 flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors"></div>
             <span className="text-primary font-bold text-xl">V</span>
            </div>
            <div className="flex flex-col">
                <h1 className="text-white text-lg font-bold leading-none tracking-tight">Vectory AI</h1>
                <p className="text-text-secondary text-xs font-medium mt-1">v3.0.0</p>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
            <Link 
                href="/" 
                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${isActive('/') ? 'bg-border-dark/60 text-white border border-border-dark shadow-sm' : 'text-text-secondary hover:bg-border-dark/40 hover:text-white'}`}
            >
                <span className={`material-symbols-outlined ${isActive('/') ? 'text-primary icon-fill' : 'group-hover:text-white'}`}>home</span>
                <span className="text-sm font-semibold">Home</span>
            </Link>
            
            <Link 
                href="#" 
                className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-border-dark/40 text-text-secondary hover:text-white transition-all duration-200 group"
            >
                <span className="material-symbols-outlined group-hover:text-white">history</span>
                <span className="text-sm font-medium">History</span>
            </Link>

            <Link 
                href="/pricing" 
                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${isActive('/pricing') ? 'bg-border-dark/60 text-white border border-border-dark shadow-sm' : 'text-text-secondary hover:bg-border-dark/40 hover:text-white'}`}
            >
                <span className="material-symbols-outlined group-hover:text-white">credit_card</span>
                <span className="text-sm font-medium">Pricing</span>
            </Link>

            <Link 
                href="#" 
                className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-border-dark/40 text-text-secondary hover:text-white transition-all duration-200 group"
            >
                <span className="material-symbols-outlined group-hover:text-white">settings</span>
                <span className="text-sm font-medium">Settings</span>
            </Link>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="flex flex-col p-6 gap-4">
        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full h-11 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-bold transition-all">
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            <span>Admin Panel</span>
        </button>
        <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
