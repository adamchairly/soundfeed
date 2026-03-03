import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ArrowUp, ArrowUpDown, Check } from "lucide-react";
import { AddArtistButton, ArtistItem } from "./AddArtistButton";
import { SortableArtistItem } from "./SortableArtistItem";
import { ArtistGridSkeleton } from "@/components/common/ArtistGridSkeleton";
import type { Artist } from "@/types/Artist";

interface ArtistGridProps {
  artists: Artist[];
  loading?: boolean;
  onAddClick: () => void;
  onRemoveArtist?: (artistId: number) => void;
  initialVisibleMobile?: number;
  initialVisibleDesktop?: number;
  isAddOpen?: boolean;
  isReordering: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sensors: ReturnType<typeof import("@dnd-kit/core").useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  onToggleReorder: () => void;
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
  isAddOpen = false,
  isReordering,
  sensors,
  onDragEnd,
  onToggleReorder,
}: ArtistGridProps) => {
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const limit = isDesktop ? initialVisibleDesktop : initialVisibleMobile;

  if (loading && artists.length === 0) return <ArtistGridSkeleton />;

  const showAll = isReordering || expanded;
  const visibleArtists = showAll ? artists : artists.slice(0, limit);
  const hiddenCount = Math.max(0, artists.length - limit);

  const gridContent = isReordering ? (
    visibleArtists.map((a) => <SortableArtistItem key={a.id} artist={a} />)
  ) : (
    <>
      <div className="flex flex-col items-center">
        <AddArtistButton onClick={onAddClick} />
        {artists.length === 0 && !isAddOpen && (
          <ArrowUp size={24} className="text-slate-400 animate-bounce mt-4" />
        )}
      </div>
      {visibleArtists.map((a) => (
        <ArtistItem key={a.id} artist={a} onRemove={onRemoveArtist} />
      ))}
    </>
  );

  const grid = (
    <div className="w-full grid grid-cols-6 sm:grid-cols-8 gap-3 items-start mb-4">
      {gridContent}
    </div>
  );

  return (
    <section className="mb-4 w-full">
      {isReordering ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={visibleArtists.map((a) => a.id)}
            strategy={rectSortingStrategy}
          >
            {grid}
          </SortableContext>
        </DndContext>
      ) : (
        grid
      )}

      <div className="flex items-center gap-3">
        {!loading && !isReordering && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            {expanded ? "Show less" : `+${hiddenCount} more`}
          </button>
        )}

        {artists.length >= 2 && (
          <button
            onClick={onToggleReorder}
            className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
          >
            {isReordering ? (
              <>
                <Check size={14} />
                Done
              </>
            ) : (
              <>
                <ArrowUpDown size={14} />
                Reorder
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
};
