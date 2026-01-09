import { Link } from "react-router-dom";
import { ArrowRight} from "lucide-react";
import screenshot from "@/assets/screenshot.png";
import {
  text,
  button,
  border,
  rounded,
  shadow,
  page,
  heading,
} from "@/styles/tailwind";

const LandingPage = () => {
  return (
    <div className={page.background}>
      <div className="max-w-2xl mx-auto w-full pt-10 pb-16 px-6 text-center">
        <h1 className={`${heading.h1} ${text.primary} mb-6 leading-[1.1]`}>
          Follow artists <br />
          <span className={`italic ${text.primary}`}>you</span> want to hear
        </h1>

        <p
          className={`text-lg ${text.secondary} leading-relaxed max-w-lg mx-auto`}
        >
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
            href="#features"
            className={`font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white ${text.button} ${border.default} px-8 py-4 ${rounded.xl} font-bold text-sm hover:bg-slate-50 transition-all`}
          >
            Features
          </a>
        </div>
      </div>

      <div
        className={`bg-white border-y ${border.default} pt-20 pb-0 overflow-hidden relative`}
      >
        <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
          <h2 className={`${heading.h1} mb-6`}>Stop feeding the algorithm</h2>
          <p
            className={`text-lg ${text.secondary} max-w-2xl mx-auto leading-relaxed`}
          >
            Streaming platforms prioritize what they want to promote
          </p>
          <p
            className={`text-lg ${text.secondary} mb-10 max-w-2xl mx-auto leading-relaxed`}
          >
            Cut through the noise and get the releases you want to hear
          </p>

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

      <div id="features" className="max-w-4xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <ul className="space-y-8">
              <li className="group">
                <h4 className="font-semibold text-slate-900 mb-1">
                  Artist Subscriptions
                </h4>
                <p className={`${text.secondary} text-sm leading-relaxed`}>
                  Follow artists by searching or pasting Spotify URLs.
                  Unsubscribe from artists at any time.
                </p>
              </li>
              <li className="group">
                <h4 className="font-semibold text-slate-900 mb-1">
                  Account Portability
                </h4>
                <p className={`${text.secondary} text-sm leading-relaxed`}>
                  Sync your existing follows or recover your entire feed on any
                  device using a recovery code.
                </p>
              </li>
              <li className="group">
                <h4 className="font-semibold text-slate-900 mb-1">
                  Anonymous Usage
                </h4>
                <p className={`${text.secondary} text-sm leading-relaxed`}>
                  Your usage is anonymous and we don't store any personal data. 
                  Optionally, you can provide an email address to receive weekly digest emails, but it is not associated with your identity.
                </p>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-8">
              <li className="group">
                <h4 className="font-semibold text-slate-900 mb-1">
                  Feed Control
                </h4>
                <p className={`${text.secondary} text-sm leading-relaxed`}>
                  Dismiss seen entries to keep your workspace clean. Navigate
                  your release history chronologically without algorithmic
                  interference.
                </p>
              </li>
              <li className="group">
                <h4 className="font-semibold text-slate-900 mb-1">
                  Automatic and Manual Synchronization
                </h4>
                <p className={`${text.secondary} text-sm leading-relaxed`}>
                  While we monitor daily, you can trigger a manual sync at any
                  time to fetch the latest releases instantly.
                </p>
              </li>
              <li className="group">
                <h4 className="font-semibold text-slate-900 mb-1">
                  Email Notifications
                </h4>
                <p className={`${text.secondary} text-sm leading-relaxed`}>
                  Receive weekly digest emails with the latest releases. You can
                  enable or disable them at any time.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
