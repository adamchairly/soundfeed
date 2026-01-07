import type { SearchArtistResult } from "../types/SearchArtistResult";
import { button, text, border, rounded } from "../styles/tailwind";

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
    <div className="pt-6 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <div
            className={`flex items-center bg-slate-50 ${rounded.lg} px-3 py-2 ${border.default} focus-within:border-slate-400 transition-all`}
          >
            <input
              autoFocus
              className={`bg-transparent border-none ${text.primary} text-sm w-full outline-none placeholder:${text.muted}`}
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
              className={`absolute z-10 w-full mt-2 bg-white ${rounded.lg} ${border.default} shadow-lg px-4 py-3`}
            >
              <span className={`text-sm ${text.mutedDark}`}>Searching...</span>
            </div>
          )}

          {searchResults.length > 0 && (
            <div
              className={`absolute z-10 w-full mt-2 bg-white ${rounded.lg} ${border.default} shadow-lg max-h-64 overflow-y-auto`}
            >
              {searchResults.map((artist, idx) => (
                <button
                  key={idx}
                  onClick={() => selectArtist(artist)}
                  className={`w-full flex items-center gap-3 px-4 py-3 ${button.hoverBg} ${button.base} text-left`}
                >
                  {artist.imageUrl && (
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <span className={`text-sm ${text.primary} font-medium`}>
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
          className={`${button.secondary} font-medium px-6 py-2.5 ${rounded.lg} text-sm ${button.disabled}`}
        >
          {isSubmitting ? "..." : "Add"}
        </button>
      </div>
    </div>
  );
};
