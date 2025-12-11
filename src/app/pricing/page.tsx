'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function PricingPage() {
  const { user, userData } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-200 min-h-screen flex overflow-hidden font-display">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-72 flex-shrink-0 flex flex-col justify-between border-r border-white/5 bg-sidebar-dark h-screen overflow-y-auto z-20 transition-all duration-300">
        <div className="flex flex-col gap-6 p-4 lg:p-6">
          {/* Logo Area */}
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="bg-primary/10 flex items-center justify-center rounded-2xl h-10 w-10 text-primary flex-shrink-0">
              <span className="material-symbols-outlined">polyline</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-white text-lg font-bold tracking-tight">Vectory AI</h1>
              <p className="text-emerald-100/40 text-xs">Vectorize your raster</p>
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-emerald-100/60 hover:text-white hover:bg-white/5 rounded-full transition-colors group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">dashboard</span>
              <span className="font-medium hidden lg:block">Dashboard</span>
            </Link>
            <Link href="/history" className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-emerald-100/60 hover:text-white hover:bg-white/5 rounded-full transition-colors group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">history</span>
              <span className="font-medium hidden lg:block">History</span>
            </Link>
            <Link href="/pricing" className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 bg-primary/20 text-primary rounded-full transition-colors shadow-[0_0_15px_rgba(19,236,55,0.1)]">
              <span className="material-symbols-outlined fill-current">payments</span>
              <span className="font-medium hidden lg:block">Pricing</span>
            </Link>
            <Link href="/settings" className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-emerald-100/60 hover:text-white hover:bg-white/5 rounded-full transition-colors group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">settings</span>
              <span className="font-medium hidden lg:block">Settings</span>
            </Link>
          </nav>
        </div>
        {/* Sidebar Footer */}
        <div className="p-4 lg:p-6 border-t border-white/5 flex flex-col gap-4">
          {/* Credits Badge */}
          <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 hidden lg:block relative overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl -mr-10 -mt-10 transition-all group-hover:bg-primary/10"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-[10px] font-bold text-emerald-100/40 uppercase tracking-widest">Balance</span>
              <span className="text-primary text-[10px] font-bold bg-primary/10 px-2 py-1 rounded-full">{userData?.credits ?? 0} Credits</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 relative z-10">
              <div className="bg-primary h-1.5 rounded-full shadow-[0_0_10px_#13ec37]" style={{ width: '15%' }}></div>
            </div>
            <div className="text-[10px] text-emerald-100/40 group-hover:text-primary transition-colors relative z-10">
              Refills in 12 days
            </div>
          </div>
          <a className="flex items-center justify-center lg:justify-start gap-3 px-2 py-2 text-emerald-100/60 hover:text-white rounded-full transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="font-medium text-sm hidden lg:block">Help Center</span>
          </a>
          <div className="flex items-center justify-center lg:justify-start gap-3 px-1 lg:px-2 pt-2">
            <div 
                className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-cover bg-center border border-white/10 ring-2 ring-transparent hover:ring-primary/50 transition-all cursor-pointer" 
                style={{ backgroundImage: `url('${user?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuChdXhubnCxXUt6Kpv3lvlo6h9DBcBr2aU4v1c6zoXtrpwKwtXYCYpPk-AK8KtY9dbp0RJII9pEabxVG5zS3k6-MPIJ_JLOi8h1c_4rXCpTIGZ0geAep_G2AGWzLL_cnqW9Omj478TCPvj0fjIdRXEkOrnHprwYo5c_4AeK_-dzXQPkK7x0aIUejy1ZKERWMFRZYRIxJbVsl65qoNResIjCRjit5Cm6fubvK5NKD4pB__jvPIMkLM4jscFNsa3ev2MOYwlUZRhPrWJS' }')` }}
            ></div>
            <div className="flex-col hidden lg:flex">
              <span className="text-sm font-bold text-white leading-tight">{user?.displayName || 'Guest User'}</span>
              <span className="text-xs text-emerald-100/40">{userData?.role || 'Free Plan'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-background-dark relative scroll-smooth">
        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 via-primary/0 to-transparent pointer-events-none"></div>
        
        {/* Mobile Header */}
        <header className="flex lg:hidden items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-background-dark/80 backdrop-blur-md z-30">
          <span className="text-lg font-bold text-white">Pricing</span>
          <div className="h-8 w-8 rounded-full bg-surface-dark flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-sm">menu</span>
          </div>
        </header>

        {/* Desktop Top Bar */}
        <div className="hidden lg:flex justify-end px-10 py-6 items-center gap-4 z-20">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-dark rounded-full border border-white/5">
            <span className="material-symbols-outlined text-emerald-100/40 text-sm">search</span>
            <input className="bg-transparent border-none text-xs text-white placeholder-emerald-100/30 focus:ring-0 w-48 focus:outline-none" placeholder="Search documentation..." type="text" />
          </div>
          <button className="bg-surface-dark hover:bg-white/5 text-white p-2.5 rounded-full transition-colors border border-white/5 relative">
            <span className="material-symbols-outlined text-sm">notifications</span>
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 pb-20 z-10 flex flex-col items-center">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-10 mt-4 lg:mt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              New Pricing
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Unlock the full power of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-400">vectorization</span>
            </h1>
            <p className="text-lg text-emerald-100/50 max-w-xl mx-auto font-light">
              Choose a plan that fits your creative workflow. Whether you're a hobbyist or a professional studio, we have you covered.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="bg-surface-dark border border-white/10 p-1.5 rounded-full inline-flex items-center mb-14 relative shadow-2xl">
            <label className="cursor-pointer" onClick={() => setBillingPeriod('monthly')}>
              <input 
                type="radio" 
                name="billing" 
                className="peer sr-only" 
                checked={billingPeriod === 'monthly'} 
                readOnly
              />
              <span className={`block px-8 py-2.5 rounded-full text-sm font-bold transition-all ${billingPeriod === 'monthly' ? 'bg-primary text-background-dark shadow-lg' : 'text-emerald-100/50 hover:text-white'}`}>
                Monthly
              </span>
            </label>
            <label className="cursor-pointer" onClick={() => setBillingPeriod('yearly')}>
              <input 
                type="radio" 
                name="billing" 
                className="peer sr-only" 
                checked={billingPeriod === 'yearly'}
                readOnly
              />
              <span className={`block px-8 py-2.5 rounded-full text-sm font-bold transition-all ${billingPeriod === 'yearly' ? 'bg-primary text-background-dark shadow-lg' : 'text-emerald-100/50 hover:text-white'}`}>
                Yearly <span className={`text-[10px] ml-1 ${billingPeriod === 'yearly' ? 'text-background-dark opacity-70' : 'text-primary'}`}>(Save 20%)</span>
              </span>
            </label>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-start">
            
            {/* Starter Card */}
            <div className="bg-surface-dark/50 border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col hover:bg-surface-dark transition-all duration-300 group">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-white">hiking</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <p className="text-sm text-emerald-100/50 h-10 leading-relaxed">Perfect for hobbyists and occasional users just getting started.</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-emerald-100/40 text-sm font-medium">/mo</span>
              </div>
              <div className="border-t border-white/5 my-6"></div>
              <ul className="flex-col gap-4 mb-8 flex-1 flex">
                <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                  <span className="material-symbols-outlined text-white text-[20px] shrink-0">check</span>
                  <span><strong>5 Credits</strong> per month</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                  <span className="material-symbols-outlined text-white text-[20px] shrink-0">check</span>
                  <span>Standard processing speed</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                  <span className="material-symbols-outlined text-white text-[20px] shrink-0">check</span>
                  <span>Public gallery access</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-emerald-100/30 line-through">
                  <span className="material-symbols-outlined text-[20px] shrink-0">close</span>
                  <span>Commercial license</span>
                </li>
              </ul>
              <button className="w-full py-3.5 rounded-full border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all text-sm tracking-wide">
                Current Plan
              </button>
            </div>

            {/* Pro Card (Hero) */}
            <div className="bg-surface-dark border-2 border-primary relative rounded-3xl p-6 lg:p-8 flex flex-col shadow-[0_0_50px_-15px_rgba(19,236,55,0.2)] transform lg:-translate-y-6 z-10 overflow-hidden">
              {/* Glow effect inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-background-dark text-[10px] font-extrabold px-6 py-1.5 rounded-b-xl uppercase tracking-widest shadow-lg">
                Best Value
              </div>
              <div className="mb-6 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(19,236,55,0.4)]">
                  <span className="material-symbols-outlined text-background-dark font-bold">rocket_launch</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
                <p className="text-sm text-emerald-100/60 h-10 leading-relaxed">For professional designers needing power and speed.</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white tracking-tight">${billingPeriod === 'monthly' ? '29' : '23'}</span>
                <span className="text-emerald-100/40 text-sm font-medium">/mo</span>
              </div>
              <div className="border-t border-primary/20 my-6"></div>
              <ul className="flex-col gap-4 mb-8 flex-1 flex relative z-10">
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                  <span><strong>100 Credits</strong> per month</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                  <span><strong>4x Faster</strong> processing</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                  <span>Private gallery & Folders</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                  <span>Priority email support</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                  <span>Bulk upload (up to 10 files)</span>
                </li>
              </ul>
              <button className="w-full py-4 rounded-full bg-primary text-background-dark font-bold hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(19,236,55,0.3)] hover:shadow-[0_6px_25px_rgba(19,236,55,0.5)] transform hover:-translate-y-0.5 text-sm tracking-wide">
                Upgrade to Pro
              </button>
              <p className="text-center text-[10px] text-emerald-100/30 mt-3">7-day money-back guarantee</p>
            </div>

            {/* Lifetime Card */}
            <div className="bg-surface-dark/50 border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col hover:bg-surface-dark transition-all duration-300 group">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-white">diamond</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Lifetime</h3>
                <p className="text-sm text-emerald-100/50 h-10 leading-relaxed">Pay once, own it forever. No monthly subscriptions.</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$299</span>
                <span className="text-emerald-100/40 text-sm font-medium">/once</span>
              </div>
              <div className="border-t border-white/5 my-6"></div>
              <ul className="flex-col gap-4 mb-8 flex-1 flex">
                <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                  <span className="material-symbols-outlined text-white text-[20px] shrink-0">check</span>
                  <span><strong>Unlimited</strong> local processing</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                  <span className="material-symbols-outlined text-white text-[20px] shrink-0">check</span>
                  <span>Full Commercial license</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                  <span className="material-symbols-outlined text-white text-[20px] shrink-0">check</span>
                  <span>No monthly credits needed</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                  <span className="material-symbols-outlined text-white text-[20px] shrink-0">check</span>
                  <span>Lifetime software updates</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                  <span className="material-symbols-outlined text-white text-[20px] shrink-0">check</span>
                  <span>Desktop App License (Mac/Win)</span>
                </li>
              </ul>
              <button className="w-full py-3.5 rounded-full border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all text-sm tracking-wide">
                Get Lifetime Access
              </button>
            </div>
          </div>

          {/* Trust / Footer Area */}
          <div className="mt-24 flex flex-col items-center gap-8 w-full">
            <p className="text-xs font-semibold text-emerald-100/30 uppercase tracking-widest">Trusted by creative teams at</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 items-center opacity-40 grayscale w-full max-w-4xl">
               <h3 className="text-xl font-black text-white tracking-tighter">ACME <span className="font-light">CORP</span></h3>
               <h3 className="text-xl font-bold text-white flex items-center gap-1"><span className="w-3 h-3 bg-white rounded-full"></span> GLOBEX</h3>
               <h3 className="text-xl font-black italic text-white">INTER<span className="font-light">TECH</span></h3>
               <h3 className="text-lg font-bold text-white border-2 border-white px-2 py-0.5">UMBRELLA</h3>
               <h3 className="text-xl font-medium text-white tracking-[0.2em]">SOYLENT</h3>
            </div>
          </div>

          {/* FAQ Teaser */}
          <div className="mt-20 text-center">
            <p className="text-emerald-100/50 text-sm">Have questions about our plans?</p>
            <a className="text-primary text-sm font-bold hover:underline mt-1 inline-block" href="#">Visit our Help Center</a>
          </div>
        </div>
      </main>
    </div>
  );
}
