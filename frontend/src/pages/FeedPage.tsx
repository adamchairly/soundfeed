import { useState, useEffect, useRef } from "react";
import { useReleases } from "../contexts/ReleaseContext";
import { useUser } from "../contexts/UserContext";
import { useAddArtistLogic } from "../hooks/useAddArtist";
import { ArtistCarousel } from "../components/ArtistCarousel";
import { RecoveryModal } from "../components/RecoveryModal";
import { FeedList } from "../components/FeedList"; 

const FeedPage = () => {
  const { releases, loading: releasesLoading, dismissRelease } = useReleases();
  const { userCode, recoverIdentity } = useUser();
  const logic = useAddArtistLogic();

  const [showRecovery, setShowRecovery] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        logic.setShowAdd(false);
      }
    };
    if (logic.showAdd)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [logic.showAdd]);

  const handleRecover = async (code: string) => {
    const success = await recoverIdentity(code);
    if (success) {
      setShowRecovery(false);
      window.location.reload();
    } else {
      alert("Invalid Code");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-slate-200">
      <main className="flex-1 max-w-2xl mx-auto w-full py-6 px-4">
        <div className="mb-2 relative" ref={containerRef}>
          <ArtistCarousel onAddClick={() => logic.setShowAdd(!logic.showAdd)} />
          {logic.showAdd && (
            <div className="pt-6">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-slate-400 transition-all">
                    <input
                      autoFocus
                      className="bg-transparent border-none text-slate-900 text-sm w-full outline-none placeholder:text-slate-400"
                      placeholder="Search artist or paste Spotify URL"
                      value={logic.inputUrl}
                      onChange={(e) => logic.setInputUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !logic.searchResults.length && logic.submit()}
                    />
                  </div>
                  {logic.searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl border border-slate-200 shadow-lg max-h-64 overflow-y-auto">
                      {logic.searchResults.map((artist, idx) => (
                        <button
                          key={idx}
                          onClick={() => logic.selectArtist(artist)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                          {artist.imageUrl && (
                            <img
                              src={artist.imageUrl}
                              alt={artist.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm text-slate-900 font-medium">{artist.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {logic.isSearching && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl border border-slate-200 shadow-lg px-4 py-3">
                      <span className="text-sm text-slate-500">Searching...</span>
                    </div>
                  )}
                </div>
                <button
                  disabled={logic.isSubmitting}
                  onClick={() => logic.submit()}
                  className="bg-slate-900 text-white font-black px-6 py-2.5 rounded-xl text-xs hover:bg-slate-800 disabled:opacity-50 transition-all"
                >
                  {logic.isSubmitting ? "..." : "Add"}
                </button>
              </div>
            </div>
          )}
        </div>
        <FeedList releases={releases} loading={releasesLoading} onDismiss={dismissRelease} />
      </main>

      {showRecovery && (
        <RecoveryModal
          currentCode={userCode}
          onClose={() => setShowRecovery(false)}
          onRecover={handleRecover}
        />
      )}
    </div>
  );
};

export default FeedPage;