import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getGetApiArtistsQueryKey, getGetApiReleaseQueryKey } from "@/api/generated";
import type { SearchArtistResponse } from "@/api/generated/model";
import { AXIOS_INSTANCE } from "@/api/mutator/custom-instance";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const useAddArtistLogic = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchArtistResponse[]>([]);
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
      const { data } = await AXIOS_INSTANCE.get<SearchArtistResponse[]>(
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
      const { data } = await AXIOS_INSTANCE.get<SearchArtistResponse[]>(
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

    const isUrl =
      displayValue.startsWith("http://") || displayValue.startsWith("https://");
    if (isUrl) {
      setInputUrl(displayValue);
      setSearchResults([]);
      return;
    }

    setInputUrl("");

    const timer = setTimeout(() => {
      searchArtists(displayValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [displayValue, searchArtists]);

  const selectArtist = async (artist: SearchArtistResponse) => {
    setShowAdd(false);
    setDisplayValue("");
    setSearchResults([]);
    await submit(artist.spotifyUrl ?? "");
  };

  const submit = async (url?: string) => {
    const artistUrl = url || inputUrl;
    if (!artistUrl || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await AXIOS_INSTANCE.post("/api/Artists", null, { params: { artistUrl } });
      setInputUrl("");
      setDisplayValue("");
      setShowAdd(false);
      setSearchResults([]);
      queryClient.invalidateQueries({ queryKey: getGetApiArtistsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetApiReleaseQueryKey() });
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
