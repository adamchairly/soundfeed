/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import httpClient from "../api/HttpClient";
import type { Release } from "../types/Release";

interface ReleaseContextType {
  releases: Release[] | null;
  loading: boolean;
  error: string | null;
  refreshReleases: () => Promise<void>;
  addArtist: (url: string) => Promise<{ success: boolean; message: string }>;
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

  const refreshReleases = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get<Release[]>("/api/Release");
      setReleases(response.data);
      setError(null);
    } catch (err) {
      setError("Could not connect to API, " + err);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    refreshReleases();
  }, []);

  return (
    <ReleaseContext.Provider
      value={{ releases, loading, error, refreshReleases, addArtist }}
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