import type { Release } from "../types/Release";
import { ReleaseCard } from "./ReleaseCard";
import { MonthDivider } from "./MonthDivider";
import { FeedPagination } from "./FeedPagination";
import { text } from "../styles/tailwind";

interface FeedListProps {
  releases: Release[] | null;
  loading: boolean;
  page: number;
  totalPages: number;
  pageSize: number;
  sortDescending: boolean;
  onDismiss?: (releaseId: number) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (desc: boolean) => void;
}

const isSameMonth = (d1: string, d2: string) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const FeedList = ({
  releases,
  loading,
  onDismiss,
  page,
  totalPages,
  pageSize,
  sortDescending,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: FeedListProps) => {
  if (loading && !releases) {
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
      <div className={`text-center py-20 ${text.muted}`}>
        <p>No releases found. Try adding some artists!</p>
      </div>
    );
  }

  return (
    <section className="pb-20">
      <FeedPagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        sortDescending={sortDescending}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortChange={onSortChange}
      />
      {releases.map((release, index) => {
        const prevRelease = releases[index - 1];
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
