'use client';

import { useGetApiStats } from "@/api/generated";
import { formatStatNumber } from "@/modules/shared/utils/formatters";

const StatItem = ({ value, label }: { value: number; label: string }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
      {formatStatNumber(value)}
    </div>
    <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
  </div>
);

export const StatsBar = () => {
  const { data: stats, isLoading } = useGetApiStats();

  if (isLoading || !stats) return <div />;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
      <StatItem value={stats.users ?? 0} label="Users" />
      <StatItem value={stats.tracks ?? 0} label="Releases" />
      <StatItem value={stats.artists ?? 0} label="Artists" />
      <StatItem value={stats.userSubscriptions ?? 0} label="Subscriptions" />
    </div>
  );
};
