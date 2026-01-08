import { Link } from 'react-router-dom';
import { Github, Shield } from 'lucide-react';
import logo from '@/assets/logo.svg';
import { button, text, border, rounded } from '@/styles/tailwind';

interface HeaderProps {
  recoveryCode: string;
  onCodeClick: () => void;
}

export const Header = ({ recoveryCode, onCodeClick }: HeaderProps) => (
  <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-[100]">
    <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
      
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img src={logo} alt="Soundfeed Logo" className="w-10 h-10" />
        <h1 className={`text-xl font-black ${text.primary}`}>
          soundfeed
        </h1>
      </Link>

      <div className={`flex items-center gap-4 ${text.muted}`}>
        <button 
          onClick={onCodeClick}
          className={`flex items-center gap-2 ${button.secondary} px-3 py-1.5 ${rounded.md} ${border.default} hover:border-slate-300 transition-all group`}
        >
          <Shield className={`w-3 h-3 ${text.muted} group-hover:text-green-500 transition-colors`} />
          <span className={`text-[11px] font-mono font-bold ${text.secondary} tracking-wider`}>
            {recoveryCode || '--- ---'}
          </span>
        </button>
                
        <a href="https://github.com/adamchairly/soundfeed" target="_blank" rel="noreferrer" className={button.link}>
          <Github className="w-5 h-5" />
        </a>
      </div>
    </div>
  </header>
);