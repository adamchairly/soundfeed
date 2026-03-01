import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import screenshot from "@/assets/screenshot.png";
import { StatsBar } from "@/components/landing/StatsBar";
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-slate-200">
      <div className="max-w-2xl mx-auto w-full pt-10 pb-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Follow artists <br />
          <span className="italic text-slate-900">you</span> want to hear
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto mb-6">
          Soundfeed tracks your artists and displays new releases
        </p>

        <StatsBar />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/feed"
            className="font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-all px-8 py-4 rounded-2xl font-bold text-sm active:scale-95 shadow-lg shadow-slate-200"
          >
            Open my feed
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            How it works
          </a>
        </div>
      </div>

      <div className="bg-white border-y border border-slate-200 pt-20 pb-0 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
          <h2 className="text-3xl md:text-5xl tracking-tight mb-6">
            Stop feeding the algorithm
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
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

      <div className="max-w-2xl mx-auto px-6 flex flex-col gap-6 py-12">
        <section id="how-it-works" className="scroll-mt-20 bg-white border border-slate-200 rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            How it works
          </h2>
          <div className="space-y-3 text-slate-600 leading-relaxed marker:text-slate-400">
            <div>
              When you first visit, a unique anonymous identity is created for
              you automatically.
            </div>
            <div>
              Follow artists through the feed page. Their releases will start
              showing up in your feed.
            </div>
            <div>
              Inactive users are deleted after 30 days of no activity, to minimize data storage.
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 bg-white border border-slate-200 rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Features</h2>
          <div className="space-y-3 text-slate-600 leading-relaxed marker:text-slate-400">
            <div>
              Search for any Spotify artist and add them to your follow list.
            </div>
            <div>
              New releases are checked daily and appear in your feed
              automatically.
            </div>
            <div>
            You can also sync manually at any time, once every 15 minutes.
            </div>
          </div>
        </section>

        <section id="privacy" className="scroll-mt-20 bg-white border border-slate-200 rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Privacy</h2>
          <div className="space-y-3 text-slate-600 leading-relaxed marker:text-slate-400">
            <div>
              No login or email required. Your identity is a random token stored
              in your browser.
            </div>
            <div>
              Save your recovery code to access your feed from another device or
              browser.
            </div>
            <div>
              No analytics, no cookies beyond what's needed to keep your
              session.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
