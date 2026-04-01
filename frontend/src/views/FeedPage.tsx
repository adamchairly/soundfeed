'use client';

import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useGetApiArtists, getGetApiArtistsQueryKey } from "@/api/endpoints/artists/artists";
import { useGetApiRelease, getGetApiReleaseQueryKey, useDeleteApiReleaseReleaseId } from "@/api/endpoints/release/release";
import { useGetApiSync, getGetApiSyncQueryKey, usePostApiSync } from "@/api/endpoints/sync/sync";
import { useDeleteApiSubscriptionArtistId } from "@/api/endpoints/subscription/subscription";
import { useAddArtistLogic } from "@/hooks/useAddArtist";
import { useArtistOrder } from "@/hooks/useArtistOrder";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

import { FeedList } from "@/components/feed/FeedList";
import { SyncStatus } from "@/components/feed/SyncStatus";
import { ArtistGrid } from "@/components/feed/ArtistGrid";
import { AddArtistDropdown } from "@/components/feed/AddArtistDropdown";

const FeedPage = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortDescending, setSortDescending] = useState(true);

  const { data: artists = [], isLoading: artistsLoading } = useGetApiArtists();
  const { data: releasesData, isLoading: releasesLoading } = useGetApiRelease(
    { page, pageSize, sortDescending },
    { query: { placeholderData: keepPreviousData } },
  );
  const { data: lastSynced } = useGetApiSync();

  const unsubscribeMutation = useDeleteApiSubscriptionArtistId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetApiArtistsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetApiReleaseQueryKey() });
        toast.success("Artist removed");
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    },
  });

  const dismissMutation = useDeleteApiReleaseReleaseId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetApiReleaseQueryKey() });
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    },
  });

  const syncMutation = usePostApiSync({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetApiSyncQueryKey() });
        toast.success("Syncing successfully started in the background");
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    },
  });

  const {
    showAdd,
    setShowAdd,
    displayValue,
    setDisplayValue,
    searchResults,
    isSearching,
    isLoadingMore,
    loadMore,
    selectArtist,
  } = useAddArtistLogic();

  const { orderedArtists, sensors, handleDragEnd } = useArtistOrder(artists);

  const [isReordering, setIsReordering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeAdd = useCallback(() => {
    setShowAdd(false);
  }, [setShowAdd]);

  useOnClickOutside(containerRef, closeAdd, showAdd);

  const handleToggleReorder = useCallback(() => {
    setIsReordering((v) => {
      if (!v) setShowAdd(false);
      return !v;
    });
  }, [setShowAdd]);

  const releases = releasesData?.items ?? null;
  const totalPages = releasesData?.totalPages ?? 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 selection:bg-slate-200 dark:selection:bg-slate-700">
      <main className="max-w-2xl mx-auto w-full py-6 px-4">
        <div className="mb-2 relative" ref={containerRef}>
          <SyncStatus
            lastSynced={lastSynced ?? null}
            onSync={() => syncMutation.mutate()}
            isSyncing={syncMutation.isPending}
            loading={artistsLoading}
          />

          <ArtistGrid
            artists={orderedArtists}
            loading={artistsLoading}
            onAddClick={() => setShowAdd((v) => !v)}
            onRemoveArtist={(id) => unsubscribeMutation.mutate({ artistId: id })}
            initialVisibleMobile={5}
            initialVisibleDesktop={7}
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
              loadMore={loadMore}
              selectArtist={selectArtist}
            />
          )}

          <FeedList
            releases={releases}
            loading={releasesLoading}
            hasArtists={artists.length > 0}
            onDismiss={(releaseId) => dismissMutation.mutate({ releaseId })}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            sortDescending={sortDescending}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            onSortChange={(desc) => { setSortDescending(desc); setPage(1); }}
          />
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
