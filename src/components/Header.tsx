'use client';

import { useAuth } from './AuthProvider';
import Link from 'next/link';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function Header() {
  const { user, userData, loading, signIn, signOut } = useAuth();
  const ADMIN_UID = "YOUR_ADMIN_UID"; // Should match env

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          V
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Vectory AI
        </span>
      </div>

      <nav className="flex items-center gap-6">
        {!loading && (
          <>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Pricing
                </Link>
                
                {user.uid === ADMIN_UID && (
                    <Link href="/admin" className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                        <Shield size={14} />
                        Admin
                    </Link>
                )}

                <div className="flex items-center gap-3 bg-slate-800/80 rounded-full pl-4 pr-2 py-1.5 border border-slate-700">
                  <div className="flex flex-col items-end leading-none mr-2">
                    <span className="text-xs font-medium text-emerald-400">
                      {userData?.credits ?? 0} Credits
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {userData?.role || 'Free Plan'}
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user.email?.[0] || <UserIcon size={14} />}
                  </div>
                </div>

                <button 
                  onClick={signOut}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-lg shadow-blue-900/20"
              >
                Sign In
              </button>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
