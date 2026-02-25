import { useStats } from "@/contexts/StatsContext";
import { formatStatNumber } from "@/utils/formatters";

const StatItem = ({ value, label }: { value: number; label: string }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-slate-900">
      {formatStatNumber(value)}
    </div>
    <div className="text-sm text-slate-600">{label}</div>
  </div>
);

export const StatsBar = () => {
  const { stats, loading } = useStats();

  if (loading || !stats) return <div />;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
      <StatItem value={stats.users} label="Users" />
      <StatItem value={stats.tracks} label="Releases" />
      <StatItem value={stats.artists} label="Artists" />
      <StatItem value={stats.userSubscriptions} label="Subscriptions" />
    </div>
  );
};
