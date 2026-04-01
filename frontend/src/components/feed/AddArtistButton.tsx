import { X } from "lucide-react";
import type { GetArtistResponse } from "@/api/generated/model";
import { SkeletonImage } from "@/components/common/SkeletonImage";

export const AddArtistButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="transition-colors flex flex-col items-center gap-1 group w-full"
  >
    <div className="aspect-square w-full max-w-[56px] flex items-center justify-center border-2 border-dashed transition-colors group-hover:border-green-500 group-hover:text-green-500 text-slate-400 dark:text-slate-500">
      +
    </div>
    <span className="text-slate-400 dark:text-slate-500 text-[11px] text-center">Add</span>
  </button>
);

export const ArtistItem = ({
  artist,
  onRemove,
}: {
  artist: GetArtistResponse;
  onRemove?: (id: number) => void;
}) => (
  <div className="flex flex-col items-center w-full">
    <div className="relative">
      <a
        href={artist.spotifyUrl ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <SkeletonImage
          src={
            artist.imageUrl ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              artist.name ?? "",
            )}`
          }
          alt={artist.name ?? ""}
          className="aspect-square w-full max-w-[56px] object-cover border border-slate-200 dark:border-slate-700"
        />
      </a>

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(Number(artist.id));
          }}
          className="absolute -top-1.5 -right-1.5 z-10 bg-white dark:bg-slate-800 flex items-center justify-center transition-colors w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-full shadow-sm"
          title={`Remove ${artist.name}`}
        >
          <X size={10} />
        </button>
      )}
    </div>

    <a
      href={artist.spotifyUrl ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 dark:text-slate-500 mt-1 text-[11px] text-center leading-tight line-clamp-2 w-full hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
    >
      {artist.name}
    </a>
  </div>
);
