import { Link } from "react-router-dom";
import {
  ArrowRight,
  Music,
  Radio,
  Search,
  CheckCircle2,
} from "lucide-react";
import screenshot from '../assets/screenshot.png';
import { text, button, border, rounded, shadow, page, heading, badge } from '../styles/tailwind';

const LandingPage = () => {
  return (
    <div className={page.background}>
      <div className="max-w-2xl mx-auto w-full pt-10 pb-16 px-6 text-center">
        <h1 className={`${heading.h1} ${text.primary} mb-6 leading-[1.1]`}>
          Follow artists <br />
          <span className={`italic ${text.primary}`}>you</span> want to hear
        </h1>

        <p className={`text-lg ${text.secondary} leading-relaxed max-w-lg mx-auto`}>
          Soundfeed tracks your artists and displays new releases
        </p>
        <p className={`text-lg ${text.secondary} mb-10`}>
          Built for music lovers, against the algorithm
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/feed"
            className={`font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 ${button.primary} px-8 py-4 ${rounded.xl} font-bold text-sm active:scale-95 ${shadow.lg} shadow-slate-200`}
          >
            Open my feed
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className={`font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white ${text.button} ${border.default} px-8 py-4 ${rounded.xl} font-bold text-sm hover:bg-slate-50 transition-all`}
          >
            How it works
          </a>
        </div>
      </div>

      <div className={`bg-white border-y ${border.default} pt-20 pb-0 overflow-hidden relative`}>
        <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
          
          <h2 className={`${heading.h1} mb-6`}>
            Stop fighting the algorithm
          </h2>
          <p className={`text-lg ${text.secondary} mb-10 max-w-2xl mx-auto leading-relaxed`}>
            Streaming platforms prioritize what they want to promote
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className={badge.base}>
               <CheckCircle2 size={16}/>
               <span>Curated by you</span>
            </div>
            <div className={badge.base}>
               <CheckCircle2 size={16} className={text.primary} />
               <span>Chronological feed</span>
            </div>
            <div className={badge.base}>
               <CheckCircle2 size={16} className={text.primary} />
               <span>No account needed</span>
            </div>
          </div>

          <div className="relative mx-auto max-w-[350px] md:max-w-[500px] -mb-8">
             <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90%] h-full bg-slate-200/50 blur-3xl -z-10 rounded-full"></div>
             
            <img 
              src={screenshot} 
              alt="Soundfeed App Screenshot" 
              className="relative z-10 w-full shadow-2xl border-x-4 border-t-4 border-slate-50"
            />
          </div>
        </div>
      </div>

      <div id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className={`${heading.h1} mb-6`}>
            Simple by design
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 bg-slate-100 ${rounded.xl} flex items-center justify-center mb-6 ${text.primary}`}>
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-lg mb-2">
              Add Artists
            </h4>
            <p className={`${text.mutedDark} text-sm leading-relaxed max-w-xs`}>
              Paste the URL of your favorite artist's Spotify page
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 bg-slate-100 ${rounded.xl} flex items-center justify-center mb-6 ${text.primary}`}>
              <Radio className="w-6 h-6" />
            </div>
            <h4 className="text-lg mb-2">
              We Monitor
            </h4>
            <p className={`${text.mutedDark} text-sm leading-relaxed max-w-xs`}>
              Our system checks Spotify daily for singles, EPs and albums from
              your artists
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 bg-slate-100 ${rounded.xl} flex items-center justify-center mb-6 ${text.primary}`}>
              <Music className="w-6 h-6" />
            </div>
            <h4 className="text-lg mb-2">
              You Listen
            </h4>
            <p className={`${text.mutedDark} text-sm leading-relaxed max-w-xs`}>
              Open your feed to see a clean, chronological list of releases you
              actually care about
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
