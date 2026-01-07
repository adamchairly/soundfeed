import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { text, button } from "../../styles/tailwind";

export const Footer = () => {
  const email = import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <img src={logo} alt="Soundfeed Logo" className="w-10 h-10" />
              <span className={`font-black ${text.primary} text-lg tracking-tight`}>
                soundfeed
              </span>
            </div>
            <p className={`${text.mutedDark} text-sm leading-relaxed max-w-xs`}>
            © {new Date().getFullYear()} soundfeed • {import.meta.env.VITE_APP_VERSION}
            </p>
          </div>

          <div>
            <h4 className={`font-black ${text.primary} mb-4`}>Navigation</h4>
            <ul className={`space-y-3 text-sm ${text.mutedDark}`}>
              <li>
                <Link to="/" className={button.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/feed" className={button.link}>
                  Feed
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-black ${text.primary} mb-4`}>Legal</h4>
            <ul className={`space-y-3 text-sm ${text.mutedDark}`}>
              <li>
                <Link to="/privacy" className={button.link}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={button.link}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {email && (
            <div>
              <h4 className={`font-black ${text.primary} mb-4`}>Contact</h4>
              <ul className={`space-y-3 text-sm ${text.mutedDark}`}>
                <li>
                  <a 
                    href={`mailto:${email}`} 
                    className={button.link}
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