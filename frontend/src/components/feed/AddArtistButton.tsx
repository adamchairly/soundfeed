import { X } from "lucide-react";
import { button, text, shadow, border } from "@/styles/tailwind";
import type { Artist } from "@/types/Artist";

export const AddArtistButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`${button.base} flex flex-col items-center gap-1 group w-full`}
  >
    <div
      className={`aspect-square w-full max-w-[56px] flex items-center justify-center border-2 border-dashed transition-colors group-hover:border-green-500 group-hover:text-green-500 ${text.muted}`}
    >
      +
    </div>
    <span className={`${text.muted} text-[11px] text-center`}>Add</span>
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
        className={`w-14 h-14 object-cover ${border.default}`}
      />

      {onRemove && (
        <button
          onClick={() => onRemove(Number(artist.id))}
          className={`absolute -top-1.5 -right-1.5 z-10 bg-white ${button.icon.base} ${button.icon.size.md} ${button.icon.color.red} ${button.icon.rounded} ${shadow.sm}`}
          title={`Remove ${artist.name}`}
        >
          <X size={10} />
        </button>
      )}
    </div>

    <span
      className={`${text.muted} mt-1 text-[11px] text-center leading-tight line-clamp-2 w-full`}
    >
      {artist.name}
    </span>
  </div>
);
