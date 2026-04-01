import type { GetReleaseResponse } from "@/api/generated/model";
import { ReleaseCard } from "@/modules/feed/components/ReleaseCard";

const PLACEHOLDER_COVER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e2e8f0'/%3E%3C/svg%3E";

const MOCK_RELEASE: GetReleaseResponse = {
  id: -1,
  title: "Title",
  artistName: "Artist",
  releaseDate: "2025-01-01",
  coverUrl: PLACEHOLDER_COVER,
  spotifyUrl: "",
  releaseType: "Album",
};

const OPACITY_CLASSES = ["opacity-45", "opacity-25", "opacity-15", "opacity-5"];

export const MockFeedPreview = () => {
  return (
    <div className="py-5">
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
