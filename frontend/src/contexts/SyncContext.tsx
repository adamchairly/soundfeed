/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import httpClient from "../api/HttpClient";
import { useReleases } from "./ReleaseContext";

interface SyncContextType {
  lastSynced: string | null;
  syncReleases: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const { refreshReleases } = useReleases();

  const fetchLastSynced = async () => {
    try {
      const response = await httpClient.get<string | null>("/api/Sync");
      if (response.data) {
        setLastSynced(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch last synced time:", err);
    }
  };

  const syncReleases = async () => {
    try {
      await httpClient.post("/api/Sync");
      await Promise.all([refreshReleases(), fetchLastSynced()]);
    } catch (err) {
      console.error("Failed to sync releases:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLastSynced();
  }, []);

  return (
    <SyncContext.Provider value={{ lastSynced, syncReleases }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context)
    throw new Error("useSync must be used within a SyncProvider");
  return context;
};