import type { Track } from "@/types/Track";

export interface Release {
  id: number;
  title: string;
  artistName: string;
  releaseDate: string;
  coverUrl?: string;
  spotifyUrl?: string;
  releaseType?: string;
  label?: string;
  tracks?: Track[];
}
