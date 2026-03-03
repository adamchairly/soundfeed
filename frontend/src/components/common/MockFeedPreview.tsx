import type { Release } from "@/types/Release";
import { ReleaseCard } from "@/components/feed/ReleaseCard";

const PLACEHOLDER_COVER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e2e8f0'/%3E%3C/svg%3E";

const MOCK_RELEASE: Release = {
  id: -1,
  title: "Title",
  artistName: "Artist",
  releaseDate: "2025-01-01",
  coverUrl: PLACEHOLDER_COVER,
  spotifyUrl: "",
  releaseType: "Album",
  label: "Label",
};

const OPACITY_CLASSES = ["opacity-80", "opacity-60", "opacity-40", "opacity-20"];

export const MockFeedPreview = () => {
  return (
    <div className="text-center py-10">
      <p className="text-sm text-slate-400 mb-3">
        No new releases yet. They will appear like this.
      </p>
      <div className="pointer-events-none select-none">
        {OPACITY_CLASSES.map((opacity, index) => (
          <div key={index} className={opacity}>
            <ReleaseCard release={{ ...MOCK_RELEASE, id: -(index + 1) }} />
          </div>
        ))}
      </div>
    </div>
  );
};
