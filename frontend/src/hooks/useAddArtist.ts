import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useReleases } from "@/contexts/ReleaseContext";
import { useArtists } from "@/contexts/ArtistContext";
import httpClient from "@/api/HttpClient";
import type { SearchArtistResult } from "@/types/SearchArtistResult";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const useAddArtistLogic = () => {
  const { refreshReleases } = useReleases();
  const { addArtist } = useArtists();
  const [showAdd, setShowAdd] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchArtistResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [searchOffset, setSearchOffset] = useState(0);

  const pageSize = 10;

  const searchArtists = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasMore(false);
      setSearchOffset(0);
      return;
    }

    setSearchResults([]);
    setIsSearching(true);
    setSearchOffset(0);
    try {
      const { data } = await httpClient.get<SearchArtistResult[]>(
        "/api/Artists/search",
        {
          params: { query, offset: 0 },
        },
      );
      setSearchResults(data);
      setHasMore(data.length >= pageSize);
      setSearchOffset(data.length);
    } catch (err) {
      console.error("Failed to search artists:", err);
      setSearchResults([]);
      setHasMore(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !displayValue.trim() || searchOffset >= 20) return;

    setIsLoadingMore(true);
    try {
      const { data } = await httpClient.get<SearchArtistResult[]>(
        "/api/Artists/search",
        {
          params: { query: displayValue, offset: searchOffset },
        },
      );
      setSearchResults((prev) => [...prev, ...data]);
      setHasMore(data.length >= pageSize);
      setSearchOffset((prev) => prev + data.length);
    } catch (err) {
      console.error("Failed to load more artists:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, displayValue, searchOffset]);

  useEffect(() => {
    if (!displayValue.trim()) {
      setSearchResults([]);
      return;
    }

    // if its spotify url
    const isUrl =
      displayValue.startsWith("http://") || displayValue.startsWith("https://");
    if (isUrl) {
      // User typed a URL directly - use it as inputUrl
      setInputUrl(displayValue);
      setSearchResults([]);
      return;
    }

    // Clear any previously set URL when typing a search query
    setInputUrl("");

    const timer = setTimeout(() => {
      searchArtists(displayValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [displayValue, searchArtists]);

  const selectArtist = async (artist: SearchArtistResult) => {
    setShowAdd(false);
    setDisplayValue("");
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
      setDisplayValue("");
      setShowAdd(false);
      setSearchResults([]);
      await refreshReleases();
      toast.success("Artist added");
    } catch (err) {
      console.error("Failed to add artist:", err);
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showAdd,
    setShowAdd,
    displayValue,
    setDisplayValue,
    isSubmitting,
    submit,
    searchResults,
    isSearching,
    isLoadingMore,
    hasMore,
    loadMore,
    selectArtist,
  };
};
