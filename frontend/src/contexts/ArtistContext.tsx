import React, { createContext, useContext, useState, useEffect } from 'react';
import httpClient from '../api/HttpClient';
import type { Artist } from '../types/Artist';

interface ArtistContextType {
  artists: Artist[];
  loading: boolean;
  addArtist: (url: string) => Promise<void>;
  refreshArtists: () => Promise<void>;
}

const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

export const ArtistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshArtists = async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.get<Artist[]>('/api/Artists');
      setArtists(data);
    } finally {
      setLoading(false);
    }
  };

  const addArtist = async (artistUrl: string) => {
    await httpClient.post('/api/Artists', null, { params: { artistUrl } });
    await refreshArtists();
  };

  useEffect(() => { refreshArtists(); }, []);

  return (
    <ArtistContext.Provider value={{ artists, loading, addArtist, refreshArtists }}>
      {children}
    </ArtistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useArtists = () => {
  const ctx = useContext(ArtistContext);
  if (!ctx) throw new Error("useArtists must be used within ArtistProvider");
  return ctx;
};