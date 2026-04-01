'use client';

import Link from 'next/link';
import { ArrowRight, Rss, Clock, Shield, KeyRound, EyeOff } from 'lucide-react';
import { StatsBar } from '@/modules/landing/components/StatsBar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-slate-200 dark:selection:bg-slate-700">
      <div className="max-w-2xl mx-auto w-full pt-10 pb-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl tracking-tight text-slate-900 dark:text-slate-50 mb-6 leading-[1.1]">
          Follow artists <br />
          <span className="italic text-slate-900 dark:text-slate-50">you</span> want to hear
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto mb-6">
          Soundfeed tracks your artists and displays new releases
        </p>

        <StatsBar />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/feed"
            className="font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all px-8 py-4 rounded-2xl font-bold text-sm active:scale-95 shadow-lg shadow-slate-200 dark:shadow-slate-900"
          >
            Open my feed
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            How it works
          </a>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border-y border border-slate-200 dark:border-slate-800 pt-10 pb-0 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
          <h2 className="text-3xl md:text-5xl tracking-tight text-slate-900 dark:text-slate-50 mb-6">
            Stop feeding the algorithm
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Cut through the noise and get the releases you want to hear
          </p>

          <div className="relative mx-auto max-w-[350px] md:max-w-[500px] -mb-8">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90%] h-full bg-slate-200/50 dark:bg-slate-700/50 blur-3xl -z-10 rounded-full"></div>

            <img
              src="/screen_light.png"
              alt="Soundfeed App Screenshot"
              className="relative z-10 w-full shadow-2xl border-x-4 border-t-4 border-slate-50 dark:hidden"
            />
            <img
              src="/screen_dark.png"
              alt="Soundfeed App Screenshot"
              className="relative z-10 w-full shadow-2xl border-x-4 border-t-4 border-slate-950 hidden dark:block"
            />
          </div>
        </div>
      </div>

      <section id="how-it-works" className="scroll-mt-20 py-12 flex justify-center px-6">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <Shield size={18} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Anonymous identity created on your first visit, no login needed</span>
          </div>
          <div className="flex items-start gap-3">
            <Rss size={18} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Follow artists and their new releases appear in your feed</span>
          </div>
          <div className="flex items-start gap-3">
            <KeyRound size={18} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Save your recovery code to sync across devices</span>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Inactive accounts are cleaned up after 30 days</span>
          </div>
          <div className="flex items-start gap-3">
            <EyeOff size={18} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">No analytics, no tracking cookies</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
