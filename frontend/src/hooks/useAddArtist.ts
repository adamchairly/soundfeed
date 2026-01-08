import { useState, useEffect, useCallback } from 'react';
import { useReleases } from '@/contexts/ReleaseContext';
import { useArtists } from '@/contexts/ArtistContext';
import httpClient from '@/api/HttpClient';
import type { SearchArtistResult } from '@/types/SearchArtistResult';

export const useAddArtistLogic = () => {
  const { refreshReleases } = useReleases();
  const { addArtist } = useArtists();
  const [showAdd, setShowAdd] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchArtistResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchArtists = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchResults([]);
    setIsSearching(true);
    try {
      const { data } = await httpClient.get<SearchArtistResult[]>('/api/Artists/search', {
        params: { query }
      });
      setSearchResults(data);
    } catch (err) {
      console.error("Failed to search artists:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!inputUrl.trim()) {
      setSearchResults([]);
      return;
    }

    // if its spotify url
    const isUrl = inputUrl.startsWith('http://') || inputUrl.startsWith('https://');
    if (isUrl) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchArtists(inputUrl);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputUrl, searchArtists]);

  const selectArtist = async (artist: SearchArtistResult) => {
    setInputUrl(artist.spotifyUrl);
    setSearchResults([]);
    await submit(artist.spotifyUrl);
  };

  const submit = async (url?: string) => {
    const artistUrl = url || inputUrl;
    if (!artistUrl || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addArtist(artistUrl);
      setInputUrl("");
      setShowAdd(false);
      setSearchResults([]);
      await refreshReleases();
    } catch (err) {
      console.error("Failed to add artist:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showAdd,
    setShowAdd,
    inputUrl,
    setInputUrl,
    isSubmitting,
    submit,
    searchResults,
    isSearching,
    selectArtist
  };
};