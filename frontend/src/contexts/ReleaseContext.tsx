/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import httpClient from "@/api/HttpClient";
import type { Release } from "@/types/Release";
import type { PageResult } from "@/types/PageResult";

interface ReleaseContextType {
  releases: Release[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
  sortDescending: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSortDescending: (desc: boolean) => void;
  refreshReleases: () => Promise<void>;
  addArtist: (url: string) => Promise<{ success: boolean; message: string }>;
  dismissRelease: (releaseId: number) => Promise<void>;
}

const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

export const ReleaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [releases, setReleases] = useState<Release[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sortDescending, setSortDescending] = useState(true);

  const refreshReleases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await httpClient.get<PageResult<Release>>("/api/Release", {
        params: { page, pageSize, sortDescending },
      });
      setReleases(response.data.items);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError("Could not connect to API, " + err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortDescending]);

  const addArtist = async (url: string) => {
    try {
      const res = await httpClient.post(`/api/Artists`, null, {
        params: { artistUrl: url },
      });
      if (res.status === 200 || res.status === 201) {
        await refreshReleases();
        return { success: true, message: "Artist Added!" };
      }
      return { success: false, message: "Failed to add." };
    } catch {
      return { success: false, message: "Network Error" };
    }
  };

  const dismissRelease = async (releaseId: number) => {
    try {
      await httpClient.delete(`/api/Release/${releaseId}`);
      await refreshReleases();
    } catch (err) {
      console.error("Failed to dismiss release:", err);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [pageSize, sortDescending]);

  useEffect(() => {
    refreshReleases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortDescending]);

  return (
    <ReleaseContext.Provider
      value={{ releases, loading, error, page, pageSize, totalPages, sortDescending, setPage, setPageSize, setSortDescending, refreshReleases, addArtist, dismissRelease }}
    >
      {children}
    </ReleaseContext.Provider>
  );
};

export const useReleases = () => {
  const context = useContext(ReleaseContext);
  if (!context)
    throw new Error("useReleases must be used within a ReleaseProvider");
  return context;
};