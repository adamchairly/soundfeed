import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import screenshot from "@/assets/screenshot.png";
import { useStats } from "@/contexts/StatsContext";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { formatStatNumber } from "@/utils/formatters";

const LandingPage = () => {
  const { stats } = useStats();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-slate-200">
      <div className="max-w-2xl mx-auto w-full pt-10 pb-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Follow artists <br />
          <span className="italic text-slate-900">you</span> want to hear
        </h1>

        <p
          className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto mb-6"
        >
          Soundfeed tracks your artists and displays new releases
        </p>

        {stats && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {formatStatNumber(stats.users)}
              </div>
              <div className="text-sm text-slate-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {formatStatNumber(stats.tracks)}
              </div>
              <div className="text-sm text-slate-600">Releases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {formatStatNumber(stats.artists)}
              </div>
              <div className="text-sm text-slate-600">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {formatStatNumber(stats.userSubscriptions)}
              </div>
              <div className="text-sm text-slate-600">Subscriptions</div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/feed"
            className="font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-all px-8 py-4 rounded-2xl font-bold text-sm active:scale-95 shadow-lg shadow-slate-200"
          >
            Open my feed
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="font-dsiplay w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Features
          </a>
        </div>
      </div>

      <div
        className="bg-white border-y border border-slate-200 pt-20 pb-0 overflow-hidden relative"
      >
        <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
          <h2 className="text-3xl md:text-5xl tracking-tight mb-6">Stop feeding the algorithm</h2>
          <p
            className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
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

      <div id="features" className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Follow artists"
            description={
              <>
                Search or paste Spotify URLs, unfollow anytime.
              </>
            }
          />
          <FeatureCard
            title="Get releases"
            description={
              <>
                We check daily, you can sync manually whenever you want.
              </>
            }
          />
          <FeatureCard
            title="Control your feed"
            description={
              <>
                Dismiss what you've seen, browse your history.
              </>
            }
          />
          <FeatureCard
            title="Optional emails"
            description={
              <>
                Weekly digests if you want them, toggle on/off.
              </>
            }
          />
          <FeatureCard
            title="Anonymous usage"
            description={
              <>
                No login required, we don't collect personal data.
              </>
            }
          />
          <FeatureCard
            title="Portability"
            description={
              <>
                With a recovery code, access your feed from any device.
              </>
            }
          />
        </div>
      </div>  
    </div>
  );
};

export default LandingPage;
