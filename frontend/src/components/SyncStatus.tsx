import { RefreshCw } from "lucide-react";
import { button, rounded, text } from "@/styles/tailwind";

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
      className={`flex items-center justify-between mb-4 text-sm ${text.muted}`}
    >
      Last synced: {lastSynced ? formatDate(lastSynced) : "Never"}
      <button
        onClick={onSync}
        disabled={isSyncing}
        className={`flex items-center gap-2 px-3 py-1.5 ${button.secondary} ${rounded.md} ${button.disabled} font-medium`}
      >
        <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
        Sync
      </button>
    </div>
  );
};
