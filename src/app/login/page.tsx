'use client';

import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    // Check if running in Electron with the new OAuth method
    if (typeof window !== 'undefined' && (window as any).electron && (window as any).electron.startOAuth) {
        try {
            await (window as any).electron.startOAuth();
            // The actual sign-in happens in AuthProvider via onOAuthSuccess listener
            // We can keep loading true until the user user state changes or redirect happens
        } catch (error) {
            console.error("Electron OAuth error:", error);
            setLoading(false);
        }
        return;
    }

    // Fallback for Web / Legacy
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/'); 
    } catch (error) {
      console.error('Login failed:', error);
      // set error state if you had one
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Abstract gradient blob 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        {/* Abstract gradient blob 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Main Modal Container */}
      <div className="relative z-10 w-full max-w-[480px] bg-white dark:bg-[#151f16] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Header Section with Image & Logo */}
        <div 
          className="relative h-48 w-full bg-cover bg-center flex flex-col justify-end p-6" 
          style={{ 
            backgroundImage: "linear-gradient(180deg, rgba(16, 34, 19, 0) 0%, #151f16 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCaKFIo0I6UsqGLqbvdwPH2PiYv24fd8ypDhH-32jPZk1mdrzKp7hrcxIqhAQ5imvY_x4rsgCIhPAFrzEdbX8MNKjZeuhYY4FUtzZZ4LAWTalZlXu_0QZ-4XKIueAK14DiolEXVIJ7Ls_Wkwu4VU027B6II10YbCnX7pZgpDd5LMUC3-DQqeWYVnpgsI-Jqc3S0i0I-_cjg3A4Kj9UpfZ_LJb4yDHZeCVmWEnBTprjDxmXELuC4ir_-jI4sc57VV943RjEBJvAlA8fr')" 
          }}
        >
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined text-xl">polyline</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Vectory AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">Welcome Back</h1>
          <p className="text-slate-300 text-sm mt-1">Turn your pixels into paths in seconds.</p>
        </div>

        {/* Form Content */}
        <div className="p-6 pt-2 flex flex-col gap-5 pb-8">
          {/* Google Button */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-full h-12 px-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="text-sm font-bold tracking-wide">Signing in...</span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"></path>
                  <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.2812H1.46395V17.4218C3.53296 21.5366 7.63288 24.0008 12.2401 24.0008Z" fill="#34A853"></path>
                  <path d="M5.50253 14.2812C5.00309 12.7805 5.00309 11.2195 5.50253 9.71885V6.57828H1.46395C-0.422078 10.3342 -0.422078 14.6658 1.46395 18.4218L5.50253 14.2812Z" fill="#FBBC05"></path>
                  <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.63288 0.000808666 3.53296 2.46498 1.46395 6.57999L5.50262 9.72056C6.45064 6.86188 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"></path>
                </svg>
                <span className="text-sm font-bold tracking-wide">Continue with Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
