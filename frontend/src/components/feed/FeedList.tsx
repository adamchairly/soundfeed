import type { GetReleaseResponse } from "@/api/generated/model";
import { ReleaseCard } from "@/components/feed/ReleaseCard";
import { ReleaseCardSkeleton } from "@/components/common/ReleaseCardSkeleton";
import { MockFeedPreview } from "@/components/common/MockFeedPreview";
import { MonthDivider } from "@/components/feed/MonthDivider";
import { FeedPagination } from "@/components/feed/FeedPagination";

interface FeedListProps {
  releases: GetReleaseResponse[] | null;
  loading: boolean;
  hasArtists: boolean;
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
  hasArtists,
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
          <ReleaseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!releases || releases.length === 0) {
    if (!hasArtists) {
      return (
        <div className="text-center py-20 text-slate-400 dark:text-slate-500">
          <p>No artists yet, try adding some!</p>
        </div>
      );
    }

    return <MockFeedPreview />;
  }

  return (
    <section className="pb-5">
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
          !isSameMonth(release.releaseDate!, prevRelease.releaseDate!);

        return (
          <div key={release.id}>
            {showDivider && <MonthDivider date={release.releaseDate!} />}

            <ReleaseCard release={release} onDismiss={onDismiss} />
          </div>
        );
      })}
    </section>
  );
};
