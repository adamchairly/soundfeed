import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SettingsModal } from "@/components/header/SettingsModal";

export const Layout = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-display">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
