import { useState } from "react";
import { ChevronDown, ChevronUp, X, ExternalLink } from "lucide-react";
import type { Release } from "@/types/Release";

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
      className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-all mb-3 group"
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
                className="font-bold text-slate-900 truncate text-base leading-tight hover:text-slate-700 transition-colors"
              >
                {release.title}
              </h3>
              <p className="text-slate-600 font-semibold text-sm truncate">
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
                <ExternalLink size={16} />
              </a>

              {hasTracks && (
                <button
                  onClick={toggleExpand}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
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
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div
            className="flex items-center gap-2 text-xs text-slate-400 mt-1 cursor-pointer"
            onClick={toggleExpand}
          >
            <span
              className="font-bold uppercase tracking-wider text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded"
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
            <p className="text-slate-400 text-sm">
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
                  className="text-sm text-slate-600 truncate flex items-center py-0.5 hover:text-slate-900"
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
