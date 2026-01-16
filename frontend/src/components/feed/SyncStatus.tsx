import { RefreshCw } from "lucide-react";

interface SyncStatusProps {
  lastSynced: string | null;
  onSync: () => void;
  isSyncing?: boolean;
}

export const SyncStatus = ({
  lastSynced,
  onSync,
  isSyncing = false,
}: SyncStatusProps) => {
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
      className="flex items-center justify-between mb-4 text-sm text-slate-400"
    >
      Last synced: {lastSynced ? formatDate(lastSynced) : "Never"}
      <button
        onClick={onSync}
        disabled={isSyncing}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
        Sync
      </button>
    </div>
  );
};
