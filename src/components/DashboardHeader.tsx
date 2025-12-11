'use client';

import { useAuth } from './AuthProvider';
import Link from 'next/link';

export default function DashboardHeader() {
  const { user, userData } = useAuth();

  return (
    <header className="h-20 w-full border-b border-border-dark flex items-center justify-between px-8 bg-background-light dark:bg-background-dark z-10 shrink-0">
        {/* Breadcrumbs */}
        <div className="hidden md:flex text-text-secondary text-sm">
            Dashboard / <span className="text-white ml-1 font-medium">Upload</span>
        </div>

        <div className="flex items-center gap-6 ml-auto">
            {/* Credits Badge */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-border-dark/50 rounded-full border border-border-dark">
                <span className="material-symbols-outlined text-primary text-[20px] icon-fill">bolt</span>
                <span className="text-sm font-bold text-white tracking-wide">{userData?.credits ?? 0} Credits Left</span>
                <button className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-background-dark hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[14px] font-bold">add</span>
                </button>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
                {user?.photoURL ? (
                     // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="rounded-full w-10 h-10 border-2 border-border-dark group-hover:border-primary transition-colors object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-dark border-2 border-border-dark group-hover:border-primary flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                )}
                
                <div className="hidden lg:flex flex-col items-start">
                    <p className="text-sm font-bold text-white leading-none">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-text-secondary mt-1">{userData?.role || 'Free Plan'}</p>
                </div>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-white transition-colors">expand_more</span>
            </div>
        </div>
    </header>
  );
}
