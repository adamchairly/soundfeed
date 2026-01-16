import { useEffect, useState } from "react";
import { AddArtistButton, ArtistItem } from "./AddArtistButton";
import type { Artist } from "@/types/Artist";

interface ArtistGridProps {
  artists: Artist[];
  loading?: boolean;
  onAddClick: () => void;
  onRemoveArtist?: (artistId: number) => void;
  initialVisibleMobile?: number;
  initialVisibleDesktop?: number;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const ArtistGrid = ({
  artists,
  loading = false,
  onAddClick,
  onRemoveArtist,
  initialVisibleMobile = 5,
  initialVisibleDesktop = 7,
}: ArtistGridProps) => {
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const limit = isDesktop ? initialVisibleDesktop : initialVisibleMobile;

  const visibleArtists = expanded ? artists : artists.slice(0, limit);
  const hiddenCount = Math.max(0, artists.length - limit);

  return (
    <section className="mb-4 w-full">
      <div className="w-full grid grid-cols-6 sm:grid-cols-8 gap-3 items-start mb-4">
        <AddArtistButton onClick={onAddClick} />
        {visibleArtists.map((a) => (
          <ArtistItem key={a.id} artist={a} onRemove={onRemoveArtist} />
        ))}
      </div>

      {!loading && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          {expanded ? "Show less" : `+${hiddenCount} more`}
        </button>
      )}
    </section>
  );
};