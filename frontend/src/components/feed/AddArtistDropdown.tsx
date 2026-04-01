'use client';

import { useCallback } from "react";
import type { SearchArtistResponse } from "@/api/generated/model";
import { SkeletonImage } from "@/components/common/SkeletonImage";

interface AddArtistProps {
  displayValue: string;
  setDisplayValue: (val: string) => void;
  searchResults: SearchArtistResponse[];
  isSearching: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  selectArtist: (artist: SearchArtistResponse) => void;
}

export const AddArtistDropdown = ({
  displayValue,
  setDisplayValue,
  searchResults,
  isSearching,
  isLoadingMore,
  loadMore,
  selectArtist,
}: AddArtistProps) => {
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 50) {
        loadMore();
      }
    },
    [loadMore],
  );
  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 focus-within:border-slate-400 transition-all">
            <input
              autoFocus
              className="bg-transparent border-none text-slate-900 dark:text-slate-50 text-sm w-full outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Search artist on Spotify"
              value={displayValue}
              onChange={(e) => setDisplayValue(e.target.value)}
            />
          </div>

          {isSearching && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg px-4 py-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">Searching...</span>
            </div>
          )}

          {searchResults.length > 0 && (
            <div
              className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg max-h-64 overflow-y-auto"
              onScroll={handleScroll}
            >
              {searchResults.map((artist, idx) => (
                <button
                  key={idx}
                  onClick={() => selectArtist(artist)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
                >
                  {artist.imageUrl && (
                    <SkeletonImage
                      src={artist.imageUrl}
                      alt={artist.name ?? ""}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-slate-900 dark:text-slate-50 font-medium">
                    {artist.name}
                  </span>
                </button>
              ))}
              {isLoadingMore && (
                <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                  Loading more...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
