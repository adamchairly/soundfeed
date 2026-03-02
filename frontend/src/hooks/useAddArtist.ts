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

  const searchArtists = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchResults([]);
    setIsSearching(true);
    try {
      const { data } = await httpClient.get<SearchArtistResult[]>(
        "/api/Artists/search",
        {
          params: { query },
        },
      );
      setSearchResults(data);
    } catch (err) {
      console.error("Failed to search artists:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

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
    setDisplayValue(artist.name);
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
    selectArtist,
  };
};
