import { useRef, useState, useCallback } from "react";
import { useReleases } from "../contexts/ReleaseContext";
import { useSync } from "../contexts/SyncContext";
import { useUser } from "../contexts/UserContext";
import { useAddArtistLogic } from "../hooks/useAddArtist";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { ArtistCarousel } from "../components/ArtistCarousel";
import { RecoveryModal } from "../components/RecoveryModal";
import { FeedList } from "../components/FeedList";
import { SyncStatus } from "../components/SyncStatus";
import { AddArtistDropdown } from "../components/AddArtistDropdown";
import { page as pageStyles } from "../styles/tailwind";

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
  const { userCode, recoverIdentity } = useUser();
  const {
    showAdd,
    setShowAdd,
    inputUrl,
    setInputUrl,
    searchResults,
    isSearching,
    isSubmitting,
    submit,
    selectArtist,
  } = useAddArtistLogic();

  const [showRecovery, setShowRecovery] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeAdd = useCallback(() => {
    setShowAdd(false);
  }, [setShowAdd]);

  useOnClickOutside(containerRef, closeAdd, showAdd);

  const handleRecover = async (code: string) => {
    const success = await recoverIdentity(code);
    if (success) {
      setShowRecovery(false);
      window.location.reload();
    } else {
      alert("Invalid Code");
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncReleases();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className={`${pageStyles.background} flex flex-col`}>
      <main className="flex-1 max-w-2xl mx-auto w-full py-6 px-4">
        <div className="mb-2 relative" ref={containerRef}>
          <SyncStatus
            lastSynced={lastSynced}
            onSync={handleSync}
            isSyncing={isSyncing}
          />
          <ArtistCarousel onAddClick={() => setShowAdd(!showAdd)} />
          {showAdd && (
            <AddArtistDropdown
              inputUrl={inputUrl}
              setInputUrl={setInputUrl}
              searchResults={searchResults}
              isSearching={isSearching}
              isSubmitting={isSubmitting}
              submit={() => submit()}
              selectArtist={selectArtist}
            />
          )}
          <FeedList
            releases={releases}
            loading={releasesLoading}
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

      {showRecovery && (
        <RecoveryModal
          currentCode={userCode}
          onClose={() => setShowRecovery(false)}
          onRecover={handleRecover}
        />
      )}
    </div>
  );
};

export default FeedPage;
