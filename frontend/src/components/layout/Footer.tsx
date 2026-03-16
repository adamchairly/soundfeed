import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

export const Footer = () => {
  const email = import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-8 pb-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <img src={logo} alt="Soundfeed Logo" className="w-10 h-10" />
              <span className="font-black text-slate-900 dark:text-slate-50 text-lg tracking-tight">
                soundfeed
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
            © {new Date().getFullYear()} soundfeed • {import.meta.env.VITE_APP_VERSION}
            </p>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-slate-50 mb-4">Navigation</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                  Feed
                </Link>
              </li>
            </ul>
          </div>


          {email && (
            <div>
              <h4 className="font-black text-slate-900 dark:text-slate-50 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
                  >
                    {email}
                  </a>
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </footer>
  );
};