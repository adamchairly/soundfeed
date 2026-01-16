export const MonthDivider = ({ date }: { date: string }) => {
  const label = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 py-4 animate-in fade-in duration-500">
      <h3 className="text-slate-400 text-sm whitespace-nowrap">{label}</h3>
      <div className="h-px bg-slate-200 flex-1"></div>
    </div>
  );
};
