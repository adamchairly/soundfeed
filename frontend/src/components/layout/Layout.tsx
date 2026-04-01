'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SettingsModal } from '@/components/header/SettingsModal';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      <Footer />

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
