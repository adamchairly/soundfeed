import { useRef, useState, useCallback } from "react";
import { useReleases } from "@/contexts/ReleaseContext";
import { useSync } from "@/contexts/SyncContext";
import { useArtists } from "@/contexts/ArtistContext";
import { useAddArtistLogic } from "@/hooks/useAddArtist";
import { useArtistOrder } from "@/hooks/useArtistOrder";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import { FeedList } from "@/components/feed/FeedList";
import { SyncStatus } from "@/components/feed/SyncStatus";
import { ArtistGrid } from "@/components/feed/ArtistGrid";
import { AddArtistDropdown } from "@/components/feed/AddArtistDropdown";

const FeedPage = () => {
  const {
    releases,
    loading: releasesLoading,
    dismissRelease,
    page,
    totalPages,
    pageSize,
    sortDescending,
    setPage,
    setPageSize,
    setSortDescending,
  } = useReleases();

  const { lastSynced, syncReleases } = useSync();

  const { artists, loading: artistsLoading, unsubscribe } = useArtists();

  const {
    showAdd,
    setShowAdd,
    displayValue,
    setDisplayValue,
    searchResults,
    isSearching,
    isLoadingMore,
    hasMore,
    loadMore,
    selectArtist,
  } = useAddArtistLogic();

  const { orderedArtists, sensors, handleDragEnd } = useArtistOrder(artists);

  const [isReordering, setIsReordering] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeAdd = useCallback(() => {
    setShowAdd(false);
  }, [setShowAdd]);

  useOnClickOutside(containerRef, closeAdd, showAdd);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncReleases();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleReorder = useCallback(() => {
    setIsReordering((v) => {
      if (!v) setShowAdd(false);
      return !v;
    });
  }, [setShowAdd]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 selection:bg-slate-200 dark:selection:bg-slate-700">
      <main className="max-w-2xl mx-auto w-full py-6 px-4">
        <div className="mb-2 relative" ref={containerRef}>
          <SyncStatus
            lastSynced={lastSynced}
            onSync={handleSync}
            isSyncing={isSyncing}
            loading={artistsLoading}
          />

          <ArtistGrid
            artists={orderedArtists}
            loading={artistsLoading}
            onAddClick={() => setShowAdd((v) => !v)}
            onRemoveArtist={(id) => unsubscribe(id)}
            initialVisibleMobile={5}
            initialVisibleDesktop={7}
            isAddOpen={showAdd}
            isReordering={isReordering}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onToggleReorder={handleToggleReorder}
          />

          {showAdd && (
            <AddArtistDropdown
              displayValue={displayValue}
              setDisplayValue={setDisplayValue}
              searchResults={searchResults}
              isSearching={isSearching}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              loadMore={loadMore}
              selectArtist={selectArtist}
            />
          )}

          <FeedList
            releases={releases}
            loading={releasesLoading}
            hasArtists={artists.length > 0}
            onDismiss={dismissRelease}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            sortDescending={sortDescending}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onSortChange={setSortDescending}
          />
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
