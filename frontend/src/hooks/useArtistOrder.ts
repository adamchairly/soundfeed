import { useState, useEffect, useCallback } from "react";
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { GetArtistResponse } from "@/api/model";

const STORAGE_KEY = "soundfeed-artist-order";

function readStoredOrder(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredOrder(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function reconcile(artists: GetArtistResponse[]): GetArtistResponse[] {
  if (artists.length === 0) return [];

  const storedOrder = readStoredOrder();
  const artistMap = new Map(artists.map((a) => [a.id!, a]));
  const remainingIds = new Set(artists.map((a) => a.id!));

  const ordered: GetArtistResponse[] = [];
  for (const id of storedOrder) {
    const artist = artistMap.get(id);
    if (artist) {
      ordered.push(artist);
      remainingIds.delete(id);
    }
  }

  for (const id of remainingIds) {
    ordered.push(artistMap.get(id)!);
  }

  return ordered;
}

export function useArtistOrder(artists: GetArtistResponse[]) {
  const [orderedArtists, setOrderedArtists] = useState<GetArtistResponse[]>(() =>
    reconcile(artists),
  );

  useEffect(() => {
    setOrderedArtists(reconcile(artists));
  }, [artists]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = orderedArtists.findIndex(
        (a) => a.id === Number(active.id),
      );
      const newIndex = orderedArtists.findIndex(
        (a) => a.id === Number(over.id),
      );
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(orderedArtists, oldIndex, newIndex);
      setOrderedArtists(reordered);
      writeStoredOrder(reordered.map((a) => a.id!));
    },
    [orderedArtists],
  );

  return { orderedArtists, sensors, handleDragEnd };
}
