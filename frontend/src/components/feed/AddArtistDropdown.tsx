import type { SearchArtistResult } from "@/types/SearchArtistResult";

interface AddArtistProps {
  inputUrl: string;
  setInputUrl: (val: string) => void;
  searchResults: SearchArtistResult[];
  isSearching: boolean;
  isSubmitting: boolean;
  submit: () => void;
  selectArtist: (artist: SearchArtistResult) => void;
}

export const AddArtistDropdown = ({
  inputUrl,
  setInputUrl,
  searchResults,
  isSearching,
  isSubmitting,
  submit,
  selectArtist,
}: AddArtistProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <div
            className="flex items-center bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-slate-400 transition-all"
          >
            <input
              autoFocus
              className="bg-transparent border-none text-slate-900 text-sm w-full outline-none placeholder:text-slate-400"
              placeholder="Search artist or paste Spotify URL"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !searchResults.length && submit()
              }
            />
          </div>

          {isSearching && (
            <div
              className="absolute z-10 w-full mt-2 bg-white rounded-lg border border-slate-200 shadow-lg px-4 py-3"
            >
              <span className="text-sm text-slate-500">Searching...</span>
            </div>
          )}

          {searchResults.length > 0 && (
            <div
              className="absolute z-10 w-full mt-2 bg-white rounded-lg border border-slate-200 shadow-lg max-h-64 overflow-y-auto"
            >
              {searchResults.map((artist, idx) => (
                <button
                  key={idx}
                  onClick={() => selectArtist(artist)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-200 transition-colors text-left"
                >
                  {artist.imageUrl && (
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-slate-900 font-medium">
                    {artist.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          disabled={isSubmitting}
          onClick={submit}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all font-medium px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "..." : "Add"}
        </button>
      </div>
    </div>
  );
};
