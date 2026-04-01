'use client';

import { X } from "lucide-react";
import type { GetReleaseResponse } from "@/api/generated/model";
import { SkeletonImage } from "@/components/common/SkeletonImage";

interface ReleaseCardProps {
  release: GetReleaseResponse;
  onDismiss?: (releaseId: number) => void;
}

export const ReleaseCard = ({ release, onDismiss }: ReleaseCardProps) => {
  const date = new Date(release.releaseDate!).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.(release.id!);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-all mb-3 group">
      <div className="flex items-center p-3 gap-4">
        <a
          href={release.spotifyUrl ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex-shrink-0 cursor-pointer"
        >
          <SkeletonImage
            src={release.coverUrl ?? "https://via.placeholder.com/80"}
            alt={release.title ?? ""}
            className="w-16 h-16 rounded shadow-sm object-cover border border-slate-100 dark:border-slate-800"
          />
        </a>

        <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-50 truncate text-base leading-tight">
                {release.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm truncate">
                {release.artistName}
              </p>
            </div>

            <div className="flex items-center gap-2 pl-2">
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-full"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div
            className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-1"
          >
            <span className="font-bold uppercase tracking-wider text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
              {release.releaseType ?? "Album"}
            </span>
            <span>&bull;</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
