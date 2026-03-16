import logo from "@/assets/logo.svg";

export const Footer = () => {
  const email = import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-8 pb-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Soundfeed Logo" className="w-10 h-10" />
            <span className="font-black text-slate-900 dark:text-slate-50 text-lg tracking-tight">
              soundfeed
            </span>
          </div>
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              {email}
            </a>
          )}
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} soundfeed • {import.meta.env.VITE_APP_VERSION}
          </p>
        </div>
      </div>
    </footer>
  );
};