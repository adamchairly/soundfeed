'use client';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArtistItem } from "./AddArtistButton";
import type { GetArtistResponse } from "@/api/model";

export const SortableArtistItem = ({ artist }: { artist: GetArtistResponse }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artist.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab" as const,
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="[&_a]:pointer-events-none"
      {...attributes}
      {...listeners}
    >
      <ArtistItem artist={artist} />
    </div>
  );
};
