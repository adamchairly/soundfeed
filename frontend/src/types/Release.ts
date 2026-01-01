import type { Track } from "./Track";

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
