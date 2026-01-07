import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { Release } from "../types/Release";
import { button, text, border, rounded } from "../styles/tailwind";

interface ReleaseCardProps {
  release: Release;
  onDismiss?: (releaseId: number) => void;
}

export const ReleaseCard = ({ release, onDismiss }: ReleaseCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasTracks = release.tracks && release.tracks.length > 0;

  const date = new Date(release.releaseDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const toggleExpand = () => {
    if (hasTracks) setIsExpanded(!isExpanded);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.(release.id);
  };

  return (
    <div
      className={`bg-white ${border.default} ${rounded.md} overflow-hidden hover:shadow-md transition-all mb-3 group`}
    >
      <div className="flex items-center p-3 gap-4">
        <div
          className="relative flex-shrink-0 cursor-pointer"
          onClick={toggleExpand}
        >
          <img
            src={release.coverUrl ?? "https://via.placeholder.com/80"}
            alt={release.title}
            className="w-16 h-16 rounded shadow-sm object-cover border border-slate-100"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 cursor-pointer" onClick={toggleExpand}>
              <h3
                className={`font-bold ${text.primary} truncate text-base leading-tight hover:text-slate-700 transition-colors`}
              >
                {release.title}
              </h3>
              <p className={`${text.secondary} font-semibold text-sm truncate`}>
                {release.artistName}
              </p>
            </div>

            <div className="flex items-center gap-2 pl-2">
              <a
                href={release.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 text-green-600 hover:bg-green-50 rounded-full border border-slate-100 transition-colors"
                title="Open in Spotify"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.491 17.293a.75.75 0 01-1.03.249c-2.822-1.724-6.375-2.113-10.559-1.157a.751.751 0 01-.336-1.463c4.58-1.046 8.508-.598 11.676 1.337a.75.75 0 01.249 1.034zm1.465-3.265a.939.939 0 01-1.288.309c-3.229-1.984-8.151-2.559-11.97-1.4a.94.94 0 01-.541-1.798c4.363-1.323 9.789-.675 13.491 1.601a.94.94 0 01.308 1.288zm.126-3.411c-3.873-2.3-10.258-2.511-13.935-1.395a1.125 1.125 0 11-.652-2.155c4.233-1.285 11.29-1.026 15.728 1.609a1.125 1.125 0 11-1.141 1.941z" />
                </svg>
              </a>

              {hasTracks && (
                <button
                  onClick={toggleExpand}
                  className={`flex-shrink-0 ${button.icon.size.sm} ${button.icon.base} ${button.icon.color.default} ${button.icon.rounded}`}
                >
                  {isExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              )}

              <button
                onClick={handleDismiss}
                className={`flex-shrink-0 ${button.icon.size.sm} ${button.icon.base} ${button.icon.color.red} ${button.icon.rounded}`}
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 text-xs ${text.muted} mt-1 cursor-pointer`}
            onClick={toggleExpand}
          >
            <span
              className={`font-bold uppercase tracking-wider text-[9px] bg-slate-100 ${text.mutedDark} px-1.5 py-0.5 ${rounded.sm}`}
            >
              {release.releaseType ?? "Album"}
            </span>
            <span>•</span>
            <span>{date}</span>
            {release.label && (
              <>
                <span>•</span>
                <span className="truncate max-w-[150px]">{release.label}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {isExpanded && hasTracks && (
        <div className="bg-slate-50/50 border-t border-slate-100 px-4 py-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-2">
            <p
              className={`text-[10px] font-black ${text.muted} uppercase tracking-widest`}
            >
              Tracklist ({release.tracks?.length})
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-1">
            {release.tracks
              ?.slice()
              .sort((a, b) => a.trackNumber - b.trackNumber)
              .map((track) => (
                <li
                  key={track.trackNumber}
                  className={`text-sm ${text.secondary} truncate flex items-center py-0.5 hover:text-slate-900`}
                >
                  <span className="text-slate-300 tabular-nums mr-3 text-xs font-medium w-4 text-right">
                    {track.trackNumber}
                  </span>
                  <span className="truncate">{track.title}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
