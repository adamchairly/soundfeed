export const ReleaseCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-lg mb-3 animate-pulse">
    <div className="flex items-center p-3 gap-4">
      <div className="w-16 h-16 bg-slate-200 rounded flex-shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
        <div className="h-4 w-3/4 bg-slate-200 rounded mb-1.5" />
        <div className="h-3.5 w-1/2 bg-slate-200 rounded mb-2" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2 pl-2">
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
      </div>
    </div>
  </div>
);
