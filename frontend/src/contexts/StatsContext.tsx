import React, { createContext, useContext, useState, useEffect } from 'react';
import httpClient from '@/api/HttpClient';

interface Stats {
  users: number;
  tracks: number;
  artists: number;
  userSubscriptions: number;
}

interface StatsContextType {
  stats: Stats | null;
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await httpClient.get<Stats>('/api/Stats');
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, refreshStats: fetchStats }}>
      {children}
    </StatsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStats = () => {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used within StatsProvider");
  return ctx;
};