import { Link } from 'react-router-dom';
import { Github, Settings } from 'lucide-react';
import logo from '@/assets/logo.svg'; 

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => (
  <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-[100]">
    <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
      
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img src={logo} alt="Soundfeed Logo" className="w-10 h-10" />
        <h1 className="text-xl font-black text-slate-900">
          soundfeed
        </h1>
      </Link>

      <div className="flex items-center gap-4 text-slate-400">
        <button 
          onClick={onSettingsClick}
          className="hover:text-slate-900 transition-colors p-2"
        >
          <Settings className="w-5 h-5" />
        </button>
                
        <a href="https://github.com/adamchairly/soundfeed" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">
          <Github className="w-5 h-5" />
        </a>
      </div>
    </div>
  </header>
);