import { X } from "lucide-react";
import type { Artist } from "@/types/Artist";

export const AddArtistButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="transition-colors flex flex-col items-center gap-1 group w-full"
  >
    <div
      className="aspect-square w-full max-w-[56px] flex items-center justify-center border-2 border-dashed transition-colors group-hover:border-green-500 group-hover:text-green-500 text-slate-400"
    >
      +
    </div>
    <span className="text-slate-400 text-[11px] text-center">Add</span>
  </button>
);

export const ArtistItem = ({
  artist,
  onRemove,
}: {
  artist: Artist;
  onRemove?: (id: number) => void;
}) => (
  <div className="flex flex-col items-center w-full">
    <div className="relative">
      <img
        src={
          artist.imageUrl ??
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            artist.name ?? ""
          )}`
        }
        alt={artist.name}
        className="aspect-square w-full max-w-[56px] object-cover border border-slate-200"
      />

      {onRemove && (
        <button
          onClick={() => onRemove(Number(artist.id))}
          className="absolute -top-1.5 -right-1.5 z-10 bg-white flex items-center justify-center transition-colors w-5 h-5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm"
          title={`Remove ${artist.name}`}
        >
          <X size={10} />
        </button>
      )}
    </div>

    <span
      className="text-slate-400 mt-1 text-[11px] text-center leading-tight line-clamp-2 w-full"
    >
      {artist.name}
    </span>
  </div>
);
