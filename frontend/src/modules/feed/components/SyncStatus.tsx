import { RefreshCw } from "lucide-react";
import { SyncStatusSkeleton } from "@/modules/feed/components/SyncStatusSkeleton";

interface SyncStatusProps {
  lastSynced: string | null;
  onSync: () => void;
  isSyncing?: boolean;
  loading?: boolean;
}

export const SyncStatus = ({
  lastSynced,
  onSync,
  isSyncing = false,
  loading = false,
}: SyncStatusProps) => {
  if (loading) return <SyncStatusSkeleton />;
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div
      className="flex items-center justify-between mb-4 text-sm text-slate-400 dark:text-slate-500"
    >
      Last synced: {lastSynced ? formatDate(lastSynced) : "Never"}
      <button
        onClick={onSync}
        disabled={isSyncing}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
        Sync
      </button>
    </div>
  );
};
