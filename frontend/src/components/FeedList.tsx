import type { Release } from "../types/Release";
import { ReleaseCard } from "./ReleaseCard";
import { MonthDivider } from "./MonthDivider";

interface FeedListProps {
  releases: Release[] | null;
  loading: boolean;
  onDismiss?: (releaseId: number) => void;
}

const isSameMonth = (d1: string, d2: string) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const FeedList = ({ releases, loading, onDismiss }: FeedListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-white border border-slate-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!releases || releases.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>No releases found. Try adding some artists!</p>
      </div>
    );
  }

  const sortedReleases = [...releases].sort(
    (a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  return (
        <section className="pb-20">
      <div className="flex items-center gap-4 mb-2">
      </div>

      {sortedReleases.map((release, index) => {
        const prevRelease = sortedReleases[index - 1];
        const showDivider =
          !prevRelease ||
          !isSameMonth(release.releaseDate, prevRelease.releaseDate);

        return (
          <div key={release.id}>
            {showDivider && <MonthDivider date={release.releaseDate} />}
            
            <ReleaseCard release={release} onDismiss={onDismiss} />
          </div>
        );
      })}
    </section>
  );
};